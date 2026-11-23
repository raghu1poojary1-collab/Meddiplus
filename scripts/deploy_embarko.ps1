$src = $PSScriptRoot + "\.."
$dest = "C:\Users\raghu\AppData\Local\Temp\medflow-static"
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null
Copy-Item "$src\index.html" -Destination $dest
Copy-Item "$src\hospital.html" -Destination $dest
Copy-Item "$src\admin.html" -Destination $dest
Copy-Item "$src\login.html" -Destination $dest
Copy-Item "$src\staff-login.html" -Destination $dest
Copy-Item "$src\signup.html" -Destination $dest
Copy-Item "$src\privacy.html" -Destination $dest
Copy-Item "$src\terms.html" -Destination $dest
Copy-Item "$src\css" -Destination "$dest\css" -Recurse
Copy-Item "$src\js" -Destination "$dest\js" -Recurse
Copy-Item "$src\data" -Destination "$dest\data" -Recurse
if (Test-Path "$src\images") { Copy-Item "$src\images" -Destination "$dest\images" -Recurse }
tar -czf C:\Users\raghu\AppData\Local\Temp\medflow-static.tar.gz -C $dest .
& "C:\Windows\System32\curl.exe" -sS -X POST "https://ship.embarko.ai/apps" `
  -H "X-App-Name: medipulse-live" `
  -H "X-Agent-Name: antigravity" `
  --oauth2-bearer "emb_8c678fa4d6eeed3000f1d79394414cccded8f4920491cea57238da18dbc826fe" `
  -F "source=@C:\Users\raghu\AppData\Local\Temp\medflow-static.tar.gz;type=application/gzip"

