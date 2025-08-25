
param(
  [switch]$StartExpo = $true
)

$ErrorActionPreference = "Continue"

Write-Host ">>> WAZZUP SDK53 Windows Fixer" -ForegroundColor Cyan

# 0) Kill Node/Metro to release file locks
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 1) Use pinned package.json if present
if (Test-Path ".\package.sdk53.pinned.json") {
  Write-Host "Found package.sdk53.pinned.json -> replacing package.json" -ForegroundColor Yellow
  Copy-Item .\package.sdk53.pinned.json .\package.json -Force
} else {
  Write-Host "No package.sdk53.pinned.json found in project folder. Skipping replacement." -ForegroundColor DarkYellow
}

# 2) Ensure babel.config.js contains the Reanimated plugin (last)
$babelPath = Join-Path $PWD "babel.config.js"
$babelRequired = @"
module.exports = function(api){
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { alias: { '@': './src' } }],
      'react-native-reanimated/plugin' // IMPORTANT: must be last
    ]
  };
};
"@
if (Test-Path $babelPath) {
  Copy-Item $babelPath "$babelPath.bak" -Force
}
$existingBabel = ""
if (Test-Path $babelPath) { $existingBabel = Get-Content $babelPath -Raw }
if (-not $existingBabel -or ($existingBabel -notmatch "react-native-reanimated/plugin")) {
  Write-Host "Writing babel.config.js with Reanimated plugin" -ForegroundColor Yellow
  $babelRequired | Set-Content -Path $babelPath -Encoding UTF8
} else {
  Write-Host "babel.config.js already contains Reanimated plugin." -ForegroundColor Green
}

# 3) Delete node_modules aggressively (4 strategies)
$nm = Join-Path $PWD "node_modules"
if (Test-Path $nm) {
  Write-Host "Deleting node_modules ... this may take a minute." -ForegroundColor Yellow

  Write-Host "Attempt 1: CMD rmdir" -ForegroundColor DarkCyan
  cmd /c "rmdir /s /q node_modules" | Out-Null

  if (Test-Path $nm) {
    Write-Host "Attempt 2: npx rimraf" -ForegroundColor DarkCyan
    npx --yes rimraf node_modules 2>$null | Out-Null
  }

  if (Test-Path $nm) {
    Write-Host "Attempt 3: robocopy mirror (empty dir -> node_modules)" -ForegroundColor DarkCyan
    $empty = Join-Path $PWD ".empty_dir_wup"
    New-Item -Type Directory $empty -Force | Out-Null
    robocopy $empty $nm /MIR | Out-Null
    Remove-Item $empty -Recurse -Force -ErrorAction SilentlyContinue
    cmd /c "rmdir /s /q node_modules" | Out-Null
  }

  if (Test-Path $nm) {
    Write-Host "Attempt 4: long-path Remove-Item" -ForegroundColor DarkCyan
    $long = "\\?\$nm"
    Remove-Item -LiteralPath $long -Recurse -Force -ErrorAction SilentlyContinue
  }

  if (Test-Path $nm) {
    Write-Host "node_modules still exists. Close VS Code/File Explorer and re-run this script." -ForegroundColor Red
    exit 1
  } else {
    Write-Host "node_modules removed." -ForegroundColor Green
  }
} else {
  Write-Host "No node_modules found. OK." -ForegroundColor Green
}

# 4) Remove lockfile & verify npm cache
Remove-Item .\package-lock.json -Force -ErrorAction SilentlyContinue
npm cache verify | Out-Null

# 5) Install dependencies
Write-Host "Installing dependencies (npm install) ..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed." -ForegroundColor Red; exit 1 }

# 6) Doctor
Write-Host "Running expo doctor ..." -ForegroundColor Cyan
npx expo-doctor

# 7) Start Expo (clear cache)
if ($StartExpo) {
  Write-Host "Starting Expo with cache clear ..." -ForegroundColor Cyan
  npx expo start -c
}
