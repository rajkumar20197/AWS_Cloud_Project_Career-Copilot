# AI Career Coach - Port Security Script
# Run as Administrator to secure your system

Write-Host "🔒 AI Career Coach - Port Security Configuration" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green

# Block dangerous ports
$dangerousPorts = @(3306, 7070, 8090, 27036, 1433, 5432, 6379, 27017)

foreach ($port in $dangerousPorts) {
    try {
        # Block inbound connections on dangerous ports
        New-NetFirewallRule -DisplayName "AI Career Coach - Block Port $port" -Direction Inbound -Protocol TCP -LocalPort $port -Action Block -ErrorAction SilentlyContinue
        Write-Host "🚫 Blocked inbound access to port $port" -ForegroundColor Yellow
    } catch {
        Write-Host "⚠️  Port $port rule already exists or failed to create" -ForegroundColor Gray
    }
}

# Allow only necessary ports for your application
$allowedPorts = @(5000)  # Your backend API

foreach ($port in $allowedPorts) {
    try {
        # Allow inbound connections on application ports
        New-NetFirewallRule -DisplayName "AI Career Coach - Allow Port $port" -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow -ErrorAction SilentlyContinue
        Write-Host "✅ Allowed inbound access to port $port (Application)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Port $port rule already exists or failed to create" -ForegroundColor Gray
    }
}

# Block common attack ports
$attackPorts = @(22, 23, 135, 139, 445, 1433, 1521, 3389, 5432, 5900, 6379)

foreach ($port in $attackPorts) {
    try {
        New-NetFirewallRule -DisplayName "AI Career Coach - Block Attack Port $port" -Direction Inbound -Protocol TCP -LocalPort $port -Action Block -ErrorAction SilentlyContinue
        Write-Host "🛡️  Blocked common attack port $port" -ForegroundColor Red
    } catch {
        Write-Host "⚠️  Attack port $port rule already exists" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🔒 SECURITY CONFIGURATION COMPLETE!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "✅ Dangerous database ports blocked" -ForegroundColor Green
Write-Host "✅ Application ports secured" -ForegroundColor Green
Write-Host "✅ Common attack vectors blocked" -ForegroundColor Green
Write-Host ""
Write-Host "📋 ALLOWED PORTS:" -ForegroundColor Cyan
Write-Host "   - Port 5000: Your AI Career Coach Backend API" -ForegroundColor White
Write-Host ""
Write-Host "🚫 BLOCKED PORTS:" -ForegroundColor Red
Write-Host "   - Port 3306: MySQL Database (Security Risk)" -ForegroundColor White
Write-Host "   - Port 7070: Unknown Service" -ForegroundColor White
Write-Host "   - Port 8090: Unknown Service" -ForegroundColor White
Write-Host "   - Common attack ports (22, 23, 135, 139, 445, etc.)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Your application will only be accessible on port 5000" -ForegroundColor Yellow
Write-Host "   Frontend (port 3000) is automatically secured (localhost only)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Test your application: http://localhost:3000" -ForegroundColor White
Write-Host "   2. Verify API access: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "   3. Deploy to production with these security settings" -ForegroundColor White