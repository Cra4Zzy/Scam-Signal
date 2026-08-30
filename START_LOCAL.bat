@echo off
setlocal
cd /d "%~dp0"

echo.
echo ============================================
echo   ScamSignal - lokaler Start
echo ============================================
echo.

if not exist package.json (
  echo FEHLER: package.json wurde nicht gefunden.
  echo Starte diese Datei direkt aus dem ScamSignal-Projektordner.
  pause
  exit /b 1
)

if not exist .env.local (
  echo FEHLER: .env.local fehlt.
  echo Kopiere .env.example zu .env.local und trage deine Supabase-Werte ein.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Abhaengigkeiten werden installiert...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo npm install ist fehlgeschlagen.
    pause
    exit /b 1
  )
)

echo.
echo Supabase wird vor dem Start geprueft...
call npm.cmd run check
if errorlevel 1 (
  echo.
  echo ScamSignal wurde NICHT gestartet, weil die Verbindung noch nicht korrekt ist.
  echo Lies die Fehlermeldung direkt ueber dieser Zeile.
  pause
  exit /b 1
)

echo.
echo ScamSignal startet auf http://localhost:3000
call npm.cmd run dev
