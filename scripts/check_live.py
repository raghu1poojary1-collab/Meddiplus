import subprocess

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd = [chrome, '--headless=new', '--disable-gpu', '--virtual-time-budget=3000', '--dump-dom', 'https://medipulse-live.embarko.app']
res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True, encoding='utf-8')
dom = res.stdout

print("Total DOM length:", len(dom))
if '<div id="root">' in dom:
    pos = dom.find('<div id="root">')
    print("LIVE ROOT CONTENT:")
    print(dom[pos:pos+700])
else:
    print("NO ROOT TAG FOUND")
