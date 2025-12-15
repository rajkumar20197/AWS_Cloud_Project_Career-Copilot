# Disaster Recovery Script for AI Career Agent Platform
# Automatically failover to backup region if primary is down

param(
    [string]$Action = "check",  # check, failover, restore
    [string]$PrimaryRegion = "us-east-1",
    [string]$DRRegion = "us-west-2"
)

$PRIMARY_BUCKET = "aicareeragentcoach-frontend"
$DR_BUCKET = "aicareeragentcoach-frontend-dr"

Write-Host "🚨 AI Career Agent - Disaster Recovery Script" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red

function Test-RegionHealth {
    param([string]$Region, [string]$Bucket)
    
    try {
        aws s3 ls s3://$Bucket --region $Region 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Deploy-DRSite {
    Write-Host "🚀 Deploying to Disaster Recovery region: $DRRegion" -ForegroundColor Yellow
    
    # 1. Create DR bucket
    Write-Host "📦 Creating DR bucket..." -ForegroundColor Blue
    aws s3 mb s3://$DR_BUCKET --region $DRRegion
    
    # 2. Disable block public access
    Write-Host "🔓 Configuring public access..." -ForegroundColor Blue
    aws s3api put-public-access-block --bucket $DR_BUCKET --region $DRRegion --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
    
    # 3. Upload files
    Write-Host "📤 Uploading files to DR site..." -ForegroundColor Blue
    aws s3 sync build/ s3://$DR_BUCKET --region $DRRegion --delete
    
    # 4. Enable website hosting
    Write-Host "🌐 Enabling website hosting..." -ForegroundColor Blue
    aws s3 website s3://$DR_BUCKET --index-document index.html --error-document 404.html --region $DRRegion
    
    # 5. Set bucket policy
    Write-Host "🔐 Setting bucket policy..." -ForegroundColor Blue
    $policyContent = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$DR_BUCKET/*"
        }
    ]
}
"@
    
    $policyContent | Out-File -FilePath "dr-bucket-policy.json" -Encoding UTF8
    aws s3api put-bucket-policy --bucket $DR_BUCKET --policy file://dr-bucket-policy.json --region $DRRegion
    
    Write-Host "✅ DR site deployed successfully!" -ForegroundColor Green
    Write-Host "🌐 DR URL: http://$DR_BUCKET.s3-website-$DRRegion.amazonaws.com" -ForegroundColor Cyan
}

# Main execution
switch ($Action.ToLower()) {
    "check" {
        Write-Host "🔍 Checking system health..." -ForegroundColor Yellow
        
        $primaryHealthy = Test-RegionHealth -Region $PrimaryRegion -Bucket $PRIMARY_BUCKET
        $drHealthy = Test-RegionHealth -Region $DRRegion -Bucket $DR_BUCKET
        
        if ($primaryHealthy) {
            Write-Host "✅ Primary site (us-east-1): HEALTHY" -ForegroundColor Green
            Write-Host "   URL: http://$PRIMARY_BUCKET.s3-website-$PrimaryRegion.amazonaws.com" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Primary site (us-east-1): DOWN" -ForegroundColor Red
        }
        
        if ($drHealthy) {
            Write-Host "✅ DR site (us-west-2): HEALTHY" -ForegroundColor Green
            Write-Host "   URL: http://$DR_BUCKET.s3-website-$DRRegion.amazonaws.com" -ForegroundColor Cyan
        } else {
            Write-Host "⚠️  DR site (us-west-2): NOT DEPLOYED" -ForegroundColor Yellow
        }
        
        if (-not $primaryHealthy -and -not $drHealthy) {
            Write-Host "🚨 CRITICAL: Both sites are down!" -ForegroundColor Red
            Write-Host "💡 Alternative: Deploy to Netlify/Vercel" -ForegroundColor Yellow
        }
    }
    
    "failover" {
        Write-Host "🚨 Initiating failover to DR region..." -ForegroundColor Red
        
        $primaryHealthy = Test-RegionHealth -Region $PrimaryRegion -Bucket $PRIMARY_BUCKET
        
        if ($primaryHealthy) {
            Write-Host "⚠️  Primary site appears healthy. Are you sure you want to failover? (Y/N)" -ForegroundColor Yellow
            $confirm = Read-Host
            if ($confirm -ne "Y" -and $confirm -ne "y") {
                Write-Host "❌ Failover cancelled." -ForegroundColor Red
                exit
            }
        }
        
        Deploy-DRSite
        
        Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Yellow
        Write-Host "1. Update DNS records to point to DR site" -ForegroundColor White
        Write-Host "2. Notify users about the failover" -ForegroundColor White
        Write-Host "3. Monitor DR site performance" -ForegroundColor White
        Write-Host "4. Plan restoration to primary region" -ForegroundColor White
    }
    
    "restore" {
        Write-Host "🔄 Restoring to primary region..." -ForegroundColor Yellow
        
        $primaryHealthy = Test-RegionHealth -Region $PrimaryRegion -Bucket $PRIMARY_BUCKET
        
        if (-not $primaryHealthy) {
            Write-Host "❌ Primary region still appears down. Cannot restore." -ForegroundColor Red
            exit
        }
        
        Write-Host "✅ Primary region is healthy. Safe to restore." -ForegroundColor Green
        Write-Host "📋 Manual steps required:" -ForegroundColor Yellow
        Write-Host "1. Update DNS records back to primary site" -ForegroundColor White
        Write-Host "2. Verify primary site functionality" -ForegroundColor White
        Write-Host "3. Notify users about restoration" -ForegroundColor White
        Write-Host "4. Keep DR site as backup" -ForegroundColor White
    }
    
    default {
        Write-Host "❌ Invalid action. Use: check, failover, or restore" -ForegroundColor Red
        Write-Host "Examples:" -ForegroundColor Yellow
        Write-Host "  .\disaster-recovery.ps1 -Action check" -ForegroundColor White
        Write-Host "  .\disaster-recovery.ps1 -Action failover" -ForegroundColor White
        Write-Host "  .\disaster-recovery.ps1 -Action restore" -ForegroundColor White
    }
}

Write-Host "`n🔗 BACKUP URLS (if AWS is completely down):" -ForegroundColor Yellow
Write-Host "   Netlify: https://app.netlify.com/ (deploy from GitHub)" -ForegroundColor Cyan
Write-Host "   Vercel: https://vercel.com/ (deploy from GitHub)" -ForegroundColor Cyan
Write-Host "   Railway: https://railway.app/ (for backend)" -ForegroundColor Cyan