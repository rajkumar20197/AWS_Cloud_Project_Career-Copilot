# AWS Cognito User Count Checker (PowerShell)
# 
# This script checks how many users are registered in your Cognito User Pool
# 
# Usage: .\check-user-count.ps1

$USER_POOL_ID = "us-east-1_RbxnBYOCS"
$REGION = "us-east-1"

Write-Host "🔍 Checking AWS Cognito User Pool Registration Count..." -ForegroundColor Cyan
Write-Host ""

try {
    # Check if AWS CLI is available
    $awsVersion = aws --version 2>$null
    if (-not $awsVersion) {
        Write-Host "❌ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
        Write-Host "💡 Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
        exit 1
    }

    Write-Host "✅ AWS CLI found: $($awsVersion.Split(' ')[0])" -ForegroundColor Green
    Write-Host ""

    # Method 1: Quick user count
    Write-Host "📊 Getting User Count..." -ForegroundColor Yellow
    Write-Host ("-" * 50)

    $listUsersCmd = "aws cognito-idp list-users --user-pool-id $USER_POOL_ID --region $REGION --query `"Users[].Username`" --output json"
    
    try {
        $result = Invoke-Expression $listUsersCmd | ConvertFrom-Json
        $userCount = $result.Count
        
        Write-Host "✅ Total Registered Users: $userCount" -ForegroundColor Green
        
        if ($userCount -gt 0) {
            Write-Host ""
            Write-Host "👥 Registered Users:" -ForegroundColor Cyan
            for ($i = 0; $i -lt $result.Count; $i++) {
                Write-Host "   $($i + 1). $($result[$i])" -ForegroundColor White
            }
        } else {
            Write-Host "   No users registered yet." -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ Error getting user list: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 This might be due to missing AWS credentials or permissions." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host ("-" * 50)

    # Method 2: Detailed information
    Write-Host ""
    Write-Host "📋 Getting Detailed User Information..." -ForegroundColor Yellow
    Write-Host ("-" * 50)

    $detailedCmd = "aws cognito-idp list-users --user-pool-id $USER_POOL_ID --region $REGION --output json"
    
    try {
        $detailedResult = Invoke-Expression $detailedCmd | ConvertFrom-Json
        $users = $detailedResult.Users
        
        Write-Host "✅ Total Users: $($users.Count)" -ForegroundColor Green
        
        if ($users.Count -gt 0) {
            Write-Host ""
            Write-Host "📊 User Details:" -ForegroundColor Cyan
            
            $statusCounts = @{}
            $creationDates = @()
            
            foreach ($user in $users) {
                # Count by status
                $status = $user.UserStatus
                if ($statusCounts.ContainsKey($status)) {
                    $statusCounts[$status]++
                } else {
                    $statusCounts[$status] = 1
                }
                
                # Collect creation dates
                $creationDates += [DateTime]$user.UserCreateDate
                
                # Show user details
                $email = ($user.Attributes | Where-Object { $_.Name -eq "email" }).Value
                $emailVerified = ($user.Attributes | Where-Object { $_.Name -eq "email_verified" }).Value
                $createdDate = [DateTime]$user.UserCreateDate
                
                Write-Host ""
                Write-Host "   👤 User: $($user.Username)" -ForegroundColor White
                Write-Host "      📧 Email: $($email ?? 'No email')" -ForegroundColor Gray
                Write-Host "      ✅ Verified: $($emailVerified ?? 'false')" -ForegroundColor Gray
                Write-Host "      📊 Status: $status" -ForegroundColor Gray
                Write-Host "      📅 Created: $($createdDate.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
            }
            
            Write-Host ""
            Write-Host "📈 Status Summary:" -ForegroundColor Cyan
            foreach ($status in $statusCounts.Keys) {
                Write-Host "   $status`: $($statusCounts[$status]) users" -ForegroundColor White
            }
            
            # Registration timeline
            if ($creationDates.Count -gt 0) {
                $sortedDates = $creationDates | Sort-Object
                $firstUser = $sortedDates[0]
                $lastUser = $sortedDates[-1]
                
                Write-Host ""
                Write-Host "📅 Registration Timeline:" -ForegroundColor Cyan
                Write-Host "   First User: $($firstUser.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
                Write-Host "   Latest User: $($lastUser.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
                
                # Users registered today
                $today = Get-Date -Hour 0 -Minute 0 -Second 0
                $todayUsers = ($creationDates | Where-Object { $_ -ge $today }).Count
                Write-Host "   Registered Today: $todayUsers users" -ForegroundColor White
                
                # Users registered this week
                $weekAgo = (Get-Date).AddDays(-7)
                $weekUsers = ($creationDates | Where-Object { $_ -ge $weekAgo }).Count
                Write-Host "   Registered This Week: $weekUsers users" -ForegroundColor White
            }
        }
        
    } catch {
        Write-Host "❌ Error getting detailed user information: $($_.Exception.Message)" -ForegroundColor Red
    }

} catch {
    Write-Host "❌ Script execution error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Make sure AWS CLI is installed: aws --version" -ForegroundColor Gray
    Write-Host "   2. Configure AWS credentials: aws configure" -ForegroundColor Gray
    Write-Host "   3. Check if you have Cognito permissions" -ForegroundColor Gray
    Write-Host "   4. Verify the User Pool ID is correct" -ForegroundColor Gray
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "🎯 User Pool Information:" -ForegroundColor Cyan
Write-Host "   User Pool ID: $USER_POOL_ID" -ForegroundColor White
Write-Host "   Region: $REGION" -ForegroundColor White
Write-Host "   Client ID: 5a6kq9althf2te07sv157a26so" -ForegroundColor White
Write-Host ("=" * 60) -ForegroundColor Cyan