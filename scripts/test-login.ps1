$ErrorActionPreference = "Continue"
$body = @{ username = "admin"; password = "admin" } | ConvertTo-Json
$headers = @{ "Content-Type" = "application/json" }
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
Write-Host "Body: $($response.Content)"
