@echo off
echo Iniciando servidor Flask...
set FLASK_APP=generate_story.py
set FLASK_ENV=development
flask run
pause
