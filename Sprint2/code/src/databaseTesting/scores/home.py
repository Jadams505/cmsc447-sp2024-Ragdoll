from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound;
import database;

home = Blueprint("update", __name__, url_prefix="/")

@home.route("/", methods=["GET", "POST"])
def homepage():
    try:
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Users")
        tableData = cursor.fetchall()

        return render_template("home.html", title = "Home", tableData = tableData)

    except TemplateNotFound:
        abort(404)

