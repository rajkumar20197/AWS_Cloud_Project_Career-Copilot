# AI Career Agent - VPC & Networking Deployment Script (PowerShell)
# Module 7: Networking Implementation

$ErrorActionPreference = "Stop"

Write-Host "🌐 Deploying VPC & Networking Infrastructure..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$STACK_NAME = "ai-career-agent-network"
$TEMPLATE_FILE = "vpc-networking-setup.yaml"
$REGION = "us-east-1"
$PROJECT_NAME = "ai-career-agent"
$ENVIRONMENT = "production"

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if template file exists
if (-not (Test-Path $TEMPLATE_FILE)) {
    Write-Host "❌ Template file not found: $TEMPLATE_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Stack Name: $STACK_NAME"
Write-Host "  Region: $REGION"
Write-Host "  Project: $PROJECT_NAME"
Write-Host "  Environment: $ENVIRONMENT"
Write-Host ""

# Check if stack already exists
try {
    $stackExists = aws cloudformation describe-stacks `
        --stack-name $STACK_NAME `
        --region $REGION `
        2>&1
    $exists = $true
} catch {
    $exists = $false
}

if (-not $exists) {
    Write-Host "🚀 Creating new stack..." -ForegroundColor Green
    
    aws cloudformation create-stack `
        --stack-name $STACK_NAME `
        --template-body file://$TEMPLATE_FILE `
        --parameters `
            ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME `
            ParameterKey=Environment,ParameterValue=$ENVIRONMENT `
        --capabilities CAPABILITY_IAM `
        --region $REGION
    
    Write-Host "⏳ Waiting for stack creation to complete..." -ForegroundColor Yellow
    Write-Host "   This will take 5-10 minutes..." -ForegroundColor Yellow
    
    aws cloudformation wait stack-create-complete `
        --stack-name $STACK_NAME `
        --region $REGION
    
    Write-Host "✅ Stack created successfully!" -ForegroundColor Green
} else {
    Write-Host "📦 Stack already exists. Updating..." -ForegroundColor Yellow
    
    try {
        aws cloudformation update-stack `
            --stack-name $STACK_NAME `
            --template-body file://$TEMPLATE_FILE `
            --parameters `
                ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME `
                ParameterKey=Environment,ParameterValue=$ENVIRONMENT `
            --capabilities CAPABILITY_IAM `
            --region $REGION
        
        Write-Host "⏳ Waiting for stack update to complete..." -ForegroundColor Yellow
        
        aws cloudformation wait stack-update-complete `
            --stack-name $STACK_NAME `
            --region $REGION
        
        Write-Host "✅ Stack updated successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ℹ️ No updates needed or update complete" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "📊 Stack Outputs:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

aws cloudformation describe-stacks `
    --stack-name $STACK_NAME `
    --region $REGION `
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' `
    --output table

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the outputs above"
Write-Host "  2. Update Lambda functions to use VPC"
Write-Host "  3. Create Application Load Balancer"
Write-Host "  4. Add CloudFront distribution"
Write-Host ""
Write-Host "💰 Estimated Monthly Cost: `$35-50" -ForegroundColor Cyan
Write-Host "   - NAT Gateway: ~`$32/month"
Write-Host "   - Data Transfer: ~`$3-18/month"
Write-Host ""
Write-Host "📚 Documentation: docs/MODULE_7_NETWORKING_IMPLEMENTATION.md" -ForegroundColor Cyan
