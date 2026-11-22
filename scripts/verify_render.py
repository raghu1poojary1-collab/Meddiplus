import http.server
import socketserver
import threading
import subprocess
import os

PORT = 8997
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd = [chrome, '--headless=new', '--disable-gpu', '--virtual-time-budget=3000', '--dump-dom', f'http://127.0.0.1:{PORT}/index.html']
res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True, encoding='utf-8')
dom = res.stdout
server.shutdown()

print("DOM Length:", len(dom))
if '<div id="root">' in dom:
    pos = dom.find('<div id="root">')
    print("Inner root snippet (first 600 chars):")
    print(dom[pos:pos+600])
else:
    print("No #root tag found!")
