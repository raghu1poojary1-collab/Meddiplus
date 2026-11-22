import http.server
import socketserver
import subprocess
import threading
import time
import os
import re
import html

PORT = 8765

html_worker = """<!DOCTYPE html>
<html>
<head>
  <script src="/js/babel.min.js"></script>
</head>
<body>
<div id="status">WORKING</div>
<textarea id="output" style="display:none;"></textarea>
<script>
fetch('/src/App.tsx')
  .then(r => r.text())
  .then(code => {
    // Replace React import with React object destructuring
    code = code.replace(/import\\s+\\{[^}]+\\}\\s+from\\s+['"]react['"];?/, 'const { useEffect, useMemo, useRef, useState } = React;');
    code = code.replace(/export\\s+default\\s+function\\s+App/, 'function App');
    const res = Babel.transform(code, {
      presets: [
        ['react', { runtime: 'classic' }],
        'typescript'
      ]
    }).code;
    document.getElementById('output').textContent = res;
    document.getElementById('status').innerText = 'COMPLETED';
  })
  .catch(err => {
    document.getElementById('status').innerText = 'ERROR: ' + err;
  });
</script>
</body>
</html>"""

with open('compile_worker.html', 'w', encoding='utf-8') as f:
    f.write(html_worker)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

server = socketserver.TCPServer(('127.0.0.1', PORT), QuietHandler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()
print('Started local compiler server on port', PORT)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd = [chrome_path, '--headless=new', '--disable-gpu', '--virtual-time-budget=6000', '--dump-dom', f'http://127.0.0.1:{PORT}/compile_worker.html']

print('Running Chrome headless to transpile App.tsx...')
proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
output_dom = proc.stdout

server.shutdown()
if os.path.exists('compile_worker.html'):
    os.remove('compile_worker.html')

match = re.search(r'<textarea id="output"[^>]*>(.*?)</textarea>', output_dom, re.DOTALL)
if match:
    compiled_js = html.unescape(match.group(1))
    target_path = os.path.join('js', 'medipulse-app.js')
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write('// MediPulse Standalone React Application\n')
        f.write(compiled_js)
        f.write('\n\n// Mount React application\n')
        f.write('document.addEventListener("DOMContentLoaded", function() {\n')
        f.write('  var rootEl = document.getElementById("root");\n')
        f.write('  if (rootEl && typeof ReactDOM !== "undefined") {\n')
        f.write('    ReactDOM.createRoot(rootEl).render(React.createElement(App));\n')
        f.write('  }\n')
        f.write('});\n')
    print(f'SUCCESS! Wrote {target_path} ({len(compiled_js)} chars).')
else:
    print('Failed to locate output textarea. HTML status was:')
    status_match = re.search(r'<div id="status">(.*?)</div>', output_dom)
    if status_match:
        print('Status:', status_match.group(1))
    else:
        print(output_dom[:500])
