from flask import Blueprint, render_template, abort, flash
from jinja2 import TemplateNotFound;
import database;


update = Blueprint("update", __name__, url_prefix="/<int:id>/update")

@update.route('/<int:id>/updateUser', methods=("GET", "POST"))
def update(id):
    user = get_user(id)
    #NEED TO IMPLEMENT IN DATABASE.PY
    try:
        db = database.get_db()
        db.execute(
            'UPDATE Users SET name = ?'
            ' WHERE id = ?',
            (id, name)
            )
        return render_template('player/updateUser.html', user = user)

    except(TemplateNotFound):
        abort(404)

    