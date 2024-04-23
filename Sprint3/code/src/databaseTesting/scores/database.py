import sqlite3, json

import click
from flask import current_app, g, abort

#idk what this does, i think its a leftover bit of code from early on. not touching in case it actually does something
def get_user(id):
    user = get_db().execute(
        'SELECT '
    ).fetchone()
    if id is None:
        abort(404, f"Player {id} not Exist")
    return user

#retrieve an instance of the db. if an instance already exists, instead just return the already existing instance
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

# putting this here for now, feel free to move this if you have a better place for it
def get_api_json():
    """Formats the top 5 scores from the database as JSON as specified in the project doc.

    Totally guessing at what to do if there are fewer than 5 users.
    """

    # there's probably an easier way to do this but whatever
    # get and sort a list (not dict because no .sort) with names and scores
    db = get_db()
    cur = db.cursor()
    user_score_pairs = []
    for row in cur.execute("SELECT * from Scores").fetchall():
        userid, *scores = row
        username, = cur.execute(f"SELECT name from Users WHERE userID = {userid}").fetchone()
        score = sum(scores)
        user_score_pairs.append((username, score))
    user_score_pairs.sort(key=lambda pair: pair[1])

    # get best 5 and make JSON out of it
    inner_dict = {
        "Group": "Ragdoll",
        "Title": "Top 5 Scores"
    }
    for index, (name, score) in enumerate(user_score_pairs):
        if index > 4:
            break
        inner_dict[name] = score
    json_object = {"data": [inner_dict]}
    return json.dumps(json_object)

#if a database connection does exist, close it for safe keeping
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

#reset the database to the default as defined in 'schema.sql'. please god be careful with this
def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

#calls above as an argument command on-launch
@click.command('init-db')
def init_db_command():
    """Reset all databases. This includes Scores, Levels, and Users. Please check before committing."""
    init_db()
    click.echo('All Data Reset. God Save You.')

#app setup shenanigans
def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

