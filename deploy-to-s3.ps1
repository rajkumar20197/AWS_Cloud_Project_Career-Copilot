# PowerShell Script for S3 Deployment
# AI Career Agent Coach - S3 Static Website Deployment

Write-Host "🚀 AI Career Agent Coach - S3 Deployment Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Configuration
$BUCKET_NAME = "aicareeragentcoach-frontend"
$REGION = "us-east-1"

# Step 1: Build the application
Write-Host "`n🏗️ Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix build errors first." -ForegroundColor Red
    exit 1
}

# Step 2: Check if AWS CLI is configured
Write-Host "`n🔧 Checking AWS CLI configuration..." -ForegroundColor Yellow
aws sts get-caller-identity | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} else {
    Write-Host "❌ AWS CLI not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Step 3: Create S3 bucket (if it doesn't exist)
Write-Host "`n🪣 Creating S3 bucket..." -ForegroundColor Yellow
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Bucket created: $BUCKET_NAME" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Bucket might already exist, continuing..." -ForegroundColor Blue
}

# Step 4: Upload files to S3
Write-Host "`n📤 Uploading files to S3..." -ForegroundColor Yellow
aws s3 sync build/ s3://$BUCKET_NAME --delete
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files uploaded successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Upload failed. Check your AWS permissions." -ForegroundColor Red
    exit 1
}

# Step 5: Enable static website hosting
Write-Host "`n🌐 Enabling static website hosting..." -ForegroundColor Yellow
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document 404.html
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Static website hosting enabled!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to enable website hosting." -ForegroundColor Red
    exit 1
}

# Step 6: Set bucket policy for public access
Write-Host "`n🔓 Setting public read permissions..." -ForegroundColor Yellow
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://s3-bucket-policy.json
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Public read permissions set!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set bucket policy." -ForegroundColor Red
    exit 1
}

# Step 7: Display results
Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "🌐 Your website is live at:" -ForegroundColor Yellow
Write-Host "   http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test your website URL above" -ForegroundColor White
Write-Host "   2. Deploy your backend to Railway/Lambda" -ForegroundColor White
Write-Host "   3. Update API URLs in your frontend" -ForegroundColor White
Write-Host "   4. Set up CloudFront for HTTPS (optional)" -ForegroundColor White
Write-Host ""
Write-Host "🎓 Perfect for F1 students - professional AWS deployment!" -ForegroundColor Green