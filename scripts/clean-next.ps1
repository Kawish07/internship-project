param()

# Usage:
# From project root: .\scripts\clean-next.ps1

$root = Get-Location
$nextPath = Join-Path $root '.next'

Write-Host "Project root: $root"
Write-Host "Targeting folder: $nextPath"

if (-not (Test-Path $nextPath)) {
    Write-Host ".next folder not found — nothing to clean." -ForegroundColor Yellow
    exit 0
}

Write-Host "Attempting Remove-Item -Recurse -Force ..." -ForegroundColor Cyan
try {
    Remove-Item -LiteralPath $nextPath -Recurse -Force -ErrorAction Stop
    Write-Host ".next removed successfully." -ForegroundColor Green
    exit 0
} catch {
    Write-Host "Remove-Item failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Falling back to cmd rmdir (this may work for reparse/junction issues)..." -ForegroundColor Cyan
try {
    & cmd /c "rmdir /s /q \"$nextPath\""
    if (-not (Test-Path $nextPath)) {
        Write-Host ".next removed successfully (cmd rmdir)." -ForegroundColor Green
        exit 0
    } else {
        Write-Host ".next still exists after cmd rmdir." -ForegroundColor Red
    }
} catch {
    Write-Host "cmd rmdir failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "If .next still exists, try:"
Write-Host " - Pause OneDrive sync and retry, or"
Write-Host " - Move your project out of OneDrive (recommended for local builds)." -ForegroundColor Yellow
exit 1
