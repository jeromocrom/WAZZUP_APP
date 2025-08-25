WAZZUP — Fix 'main' entry + Gestures

1) Place these files at the project root:
   - index.js        (entrypoint JS with GH Root HOC)
   - App.js          (bridge to App.tsx)
   - package-main-fix.ps1

2) Run in PowerShell (from project root):
   powershell -ExecutionPolicy Bypass -File .\package-main-fix.ps1 -Path .\package.json -Main index.js

3) Ensure you have App.tsx at the project root (the real app).

4) Restart clean:
   Stop-Process -Name node -Force -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force .expo .cache 2>$null
   npx expo start -c
