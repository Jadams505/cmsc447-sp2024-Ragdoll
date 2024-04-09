from flask import Blueprint, render_template, abort, request, redirect, url_for
from jinja2 import TemplateNotFound;
import database;


update = Blueprint("update", __name__, url_prefix="/<int:id>/update")

@update.route('/<int:id>/updateUser', methods=("POST"))
def update(id):
    #NEED TO IMPLEMENT IN DATABASE.PY
    
    if request.method == 'POST':
        error = None
        username = request.form['username']

    if error is not None:
        abort(404)
    else:
        db = database.get_db()
        db.execute(
            'UPDATE Users SET name = ?'
            ' WHERE userID = ?',
            (username, id)
            )
        return redirect(url_for('index'))
    
    return render_template('player/updateUser.html', user = user)

 


@update.route('/<int:id>/delete', methods=('POST'))
def delete(id):
    db = database.get_db()
    db.execute(
        'DELETE FROM Users WHERE userID = ?', 
        'DELETE FROM Scores WHERE userID = ?',
        'DELETE FROM Levels WHERE creatorID = ?', (id,)
    )
    db.commit()

    return redirect('player/create.html')