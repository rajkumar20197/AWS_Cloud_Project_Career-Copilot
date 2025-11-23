#!/bin/bash

# AI Career Agent - VPC & Networking Deployment Script
# Module 7: Networking Implementation

set -e

echo "🌐 Deploying VPC & Networking Infrastructure..."
echo "================================================"
echo ""

# Configuration
STACK_NAME="ai-career-agent-network"
TEMPLATE_FILE="vpc-networking-setup.yaml"
REGION="us-east-1"
PROJECT_NAME="ai-career-agent"
ENVIRONMENT="production"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Template file not found: $TEMPLATE_FILE"
    exit 1
fi

echo "📋 Configuration:"
echo "  Stack Name: $STACK_NAME"
echo "  Region: $REGION"
echo "  Project: $PROJECT_NAME"
echo "  Environment: $ENVIRONMENT"
echo ""

# Check if stack already exists
STACK_EXISTS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    2>&1 || true)

if echo "$STACK_EXISTS" | grep -q "does not exist"; then
    echo "🚀 Creating new stack..."
    
    aws cloudformation create-stack \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --parameters \
            ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
            ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    echo "⏳ Waiting for stack creation to complete..."
    echo "   This will take 5-10 minutes..."
    
    aws cloudformation wait stack-create-complete \
        --stack-name $STACK_NAME \
        --region $REGION
    
    echo "✅ Stack created successfully!"
else
    echo "📦 Stack already exists. Updating..."
    
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --parameters \
            ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
            ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --capabilities CAPABILITY_IAM \
        --region $REGION \
        2>&1 || echo "No updates needed"
    
    echo "⏳ Waiting for stack update to complete..."
    
    aws cloudformation wait stack-update-complete \
        --stack-name $STACK_NAME \
        --region $REGION \
        2>&1 || echo "Update complete or no changes"
    
    echo "✅ Stack updated successfully!"
fi

echo ""
echo "📊 Stack Outputs:"
echo "================="

aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Review the outputs above"
echo "  2. Update Lambda functions to use VPC"
echo "  3. Create Application Load Balancer"
echo "  4. Add CloudFront distribution"
echo ""
echo "💰 Estimated Monthly Cost: $35-50"
echo "   - NAT Gateway: ~$32/month"
echo "   - Data Transfer: ~$3-18/month"
echo ""
echo "📚 Documentation: docs/MODULE_7_NETWORKING_IMPLEMENTATION.md"
