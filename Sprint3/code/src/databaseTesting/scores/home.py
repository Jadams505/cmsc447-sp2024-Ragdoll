from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound;
import scores.database as database;

home = Blueprint("home", __name__, url_prefix="/")

@home.route("/", methods=["GET", "POST"])
def homepage():
    try:
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Users")
        tableData = cursor.fetchall()

        return render_template("tableViewPlayer.html", title = "Home", tableData = tableData)

    except TemplateNotFound:
        abort(404)

@home.route("<int:id>/scores", methods=["GET", "POST"])
def userScores():
    try:
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Scores WHERE userID = @0", (id,))
        if(cursor.fetchone() == None):
            abort(400)
        else:
            tableData = cursor.fetchall()
            return render_template("tableViewScores.html", title= "Score View", tableData = tableData)
    except TemplateNotFound:
        abort(404)

@home.route("/scores", methods=["GET", "POST"])
def allScores():
    try:
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Scores")
        tableData = cursor.fetchall()
        return render_template("tableViewScores.html", title= "Score View", tableData = tableData)
    except TemplateNotFound:
        abort(404)