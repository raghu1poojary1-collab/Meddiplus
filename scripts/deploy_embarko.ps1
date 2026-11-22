$src = $PSScriptRoot + "\.."
$dest = "C:\Users\raghu\AppData\Local\Temp\medflow-frontend"
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path "$dest\css" -Force | Out-Null
New-Item -ItemType Directory -Path "$dest\js" -Force | Out-Null

Copy-Item "$src\index.html" -Destination $dest
Copy-Item "$src\favicon.png" -Destination $dest
Copy-Item "$src\css\medipulse-animated.css" -Destination "$dest\css\"
Copy-Item "$src\js\react.production.min.js" -Destination "$dest\js\"
Copy-Item "$src\js\react-dom.production.min.js" -Destination "$dest\js\"
Copy-Item "$src\js\medipulse-app.js" -Destination "$dest\js\"

$tarPath = "C:\Users\raghu\AppData\Local\Temp\frontend.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }

python -c "
import os, tarfile
dest = r'$dest'
tar_path = r'$tarPath'
with tarfile.open(tar_path, 'w:gz') as tar:
    for root, dirs, files in os.walk(dest):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, dest).replace('\\', '/')
            tar.add(full, arcname=rel)
"

& "C:\Windows\System32\curl.exe" -sS -X POST "https://ship.embarko.ai/apps" `
  -H "X-App-Name: medipulse-live" `
  -H "X-Agent-Name: antigravity" `
  --oauth2-bearer "emb_8c678fa4d6eeed3000f1d79394414cccded8f4920491cea57238da18dbc826fe" `
  -F "source=@$tarPath;type=application/gzip"
