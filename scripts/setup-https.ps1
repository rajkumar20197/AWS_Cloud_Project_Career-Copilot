# HTTPS Setup Script for AI Career Agent Coach
# This script sets up CloudFront distribution with SSL certificate

Write-Host "🔒 Setting up HTTPS with CloudFront..." -ForegroundColor Green

$BUCKET_NAME = "aicareeragentcoach-frontend"
$DOMAIN_NAME = "aicareeragentcoach.com"
$REGION = "us-east-1"

# Step 1: Create CloudFront distribution
Write-Host "📡 Creating CloudFront distribution..." -ForegroundColor Yellow

$DISTRIBUTION_CONFIG = @"
{
  "CallerReference": "$(Get-Date -Format 'yyyyMMddHHmmss')",
  "Comment": "AI Career Agent Coach - HTTPS Distribution",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BUCKET_NAME",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "Compress": true
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$BUCKET_NAME",
        "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "PriceClass": "PriceClass_100"
}
"@

# Save config to temp file
$CONFIG_FILE = "cloudfront-config.json"
$DISTRIBUTION_CONFIG | Out-File -FilePath $CONFIG_FILE -Encoding UTF8

# Create distribution
Write-Host "Creating CloudFront distribution..." -ForegroundColor Blue
aws cloudfront create-distribution --distribution-config file://$CONFIG_FILE

Write-Host "✅ CloudFront distribution created!" -ForegroundColor Green
Write-Host "⏳ Distribution deployment takes 15-20 minutes..." -ForegroundColor Yellow
Write-Host "🌐 Your HTTPS URL will be: https://[distribution-id].cloudfront.net" -ForegroundColor Cyan

# Cleanup
Remove-Item $CONFIG_FILE

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Wait for CloudFront deployment to complete" -ForegroundColor White
Write-Host "2. Update your DNS to point to CloudFront" -ForegroundColor White
Write-Host "3. Test HTTPS access" -ForegroundColor White