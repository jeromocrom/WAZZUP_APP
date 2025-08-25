Param(
  [string]$Path = ".\package.json",
  [string]$Main = "index.js"
)

if (!(Test-Path $Path)) {
  Write-Error "package.json non trouvé: $Path"
  exit 1
}

# Charge le JSON
$json = Get-Content $Path -Raw | ConvertFrom-Json

# Met à jour le champ 'main'
$json.main = $Main

# Corrige un éventuel 'expo.entryPoint' conflictuel
if ($json.PSObject.Properties.Name -contains "expo") {
  if ($json.expo.PSObject.Properties.Name -contains "entryPoint") {
    $json.expo.PSObject.Properties.Remove("entryPoint") | Out-Null
  }
}

# Réécrit le JSON avec indentation
$json | ConvertTo-Json -Depth 100 | Out-File $Path -Encoding UTF8

Write-Host "✔ Champ 'main' réglé sur '$Main' dans $Path"
