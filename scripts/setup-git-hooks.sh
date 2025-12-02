#!/bin/bash

# Setup Git hooks to prevent credential leaks
echo "Setting up Git security hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Pre-commit hook to check for secrets
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook to prevent committing secrets
echo "🔍 Checking for secrets before commit..."

# Patterns to check for
SECRET_PATTERNS=(
    "AKIA[0-9A-Z]{16}"                    # AWS Access Key
    "sk_live_[0-9a-zA-Z]{24,}"           # Stripe Live Secret Key
    "sk_test_[0-9a-zA-Z]{24,}"           # Stripe Test Secret Key
    "pk_live_[0-9a-zA-Z]{24,}"           # Stripe Live Publishable Key
    "rk_live_[0-9a-zA-Z]{24,}"           # Stripe Live Restricted Key
    "[0-9]+-[0-9A-Za-z_]{32}"            # Google OAuth Client Secret
    "AIza[0-9A-Za-z\\-_]{35}"            # Google API Key
    "ya29\\.[0-9A-Za-z\\-_]+"            # Google OAuth Access Token
    "ghp_[0-9a-zA-Z]{36}"                # GitHub Personal Access Token
    "gho_[0-9a-zA-Z]{36}"                # GitHub OAuth Token
    "ghu_[0-9a-zA-Z]{36}"                # GitHub User Token
    "ghs_[0-9a-zA-Z]{36}"                # GitHub Server Token
    "ghr_[0-9a-zA-Z]{36}"                # GitHub Refresh Token
    "-----BEGIN PRIVATE KEY-----"         # Private Key
    "-----BEGIN RSA PRIVATE KEY-----"     # RSA Private Key
    "password\\s*=\\s*[\"'][^\"'\\s]{8,}" # Passwords
    "secret\\s*=\\s*[\"'][^\"'\\s]{8,}"   # Secrets
)

# Check staged files for secrets
FOUND_SECRETS=false

for pattern in "${SECRET_PATTERNS[@]}"; do
    if git diff --cached --name-only | xargs grep -l -E "$pattern" 2>/dev/null; then
        echo "❌ BLOCKED: Found potential secret matching pattern: $pattern"
        echo "Files containing secrets:"
        git diff --cached --name-only | xargs grep -l -E "$pattern" 2>/dev/null
        FOUND_SECRETS=true
    fi
done

# Check for .env files being committed
if git diff --cached --name-only | grep -E "\.env$|\.env\..*$"; then
    echo "❌ BLOCKED: Attempting to commit .env file(s):"
    git diff --cached --name-only | grep -E "\.env$|\.env\..*$"
    echo "Environment files should never be committed!"
    FOUND_SECRETS=true
fi

if [ "$FOUND_SECRETS" = true ]; then
    echo ""
    echo "🚨 COMMIT BLOCKED: Potential secrets detected!"
    echo ""
    echo "To fix:"
    echo "1. Remove secrets from files"
    echo "2. Use environment variables instead"
    echo "3. Add sensitive files to .gitignore"
    echo "4. Use git-secrets or similar tools"
    echo ""
    echo "To bypass this check (NOT RECOMMENDED):"
    echo "git commit --no-verify"
    exit 1
fi

echo "✅ No secrets detected. Commit allowed."
exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git security hooks installed!"
echo ""
echo "The pre-commit hook will now:"
echo "• Check for AWS keys, API keys, and other secrets"
echo "• Prevent committing .env files"
echo "• Block commits containing potential credentials"
echo ""
echo "To test: Try committing a file with 'password=secret123'"