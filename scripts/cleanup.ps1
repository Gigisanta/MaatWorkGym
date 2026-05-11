Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
netstat -ano | Where-Object { $_.State -eq "LISTENING" -and $_.LocalAddress -match ":3000" } | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Write-Host "Cleanup complete"
