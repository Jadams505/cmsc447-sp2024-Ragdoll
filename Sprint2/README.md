# cmsc447-sp2024-Ragdoll

Running:
Using a python environment with Flask, run the "run.py" file located in code/src/run.py
Then, in a web browser, access "127.0.0.1:8000" or whatever port Flask is set to.

Accessible Features:
Main Menu: Accessible from 127.0.0.1:8000
Level Player: Click "Play" on the main menu to access the player
Level Editor: Click "Editor" on the main menu to access the editor

Level Player:
Use "WASD" or the arrow keys to move.
Currently no win conditions.

Level Editor:
Use the mouse to click on elements and create a level.


Database:
The database is currently on a branch (database-testing)

To activate:
flask --app scores run (initializes database for basic CRUD actions)
flask --app scores init-db (wipes database and resets it)