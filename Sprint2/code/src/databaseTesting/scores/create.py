from flask import Blueprint, abort, render_template, request
from jinja2 import TemplateNotFound
import scores.database as database;

create = Blueprint("create", __name__, url_prefix="/create")

@create.route("/", methods=("GET,"))
def createIndex():
    try:
        return render_template("create/index.html", title="Create",)
    except TemplateNotFound:
        abort(404)

@create.route("/outputUser", methods =("POST"))
def resultUser():
    try:
        responseHeader = ""
        responseBody = ""
        try:
            name = request.form.get("name")
            uid = request.form.get("id")
        except:
            abort(400)
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Users WHERE id = @0", (uid,))
        if(cursor.fetchone != None):
            responseHeader = "Failed"
            responseBody = "Player ID Exists!"
        else:
            cursor.execute("INSERT INTO Users VALUES (?, ?)", (name, uid))
            cursor.execute("INSERT INTO Scores VALUES (?, ?, ?, ?, ?, ?)", (uid, 0, 0, 0, 0, 0,))
            db.commit()
        #TODO add scores table here!
            responseHeader = "Complete"
            responseBody = "Player added to directory"

        cursor.close()

        return render_template("create/resultUser.html", title="Add Player", responseHeader=responseHeader, responseBody=responseBody,)

    except TemplateNotFound:
        abort(404)


@create.route("/outputScores", methods =("POST"))
def resultUser():
    try:
        responseHeader = ""
        responseBody = ""
        try: 
            uid = request.form.get("id")
            score1 = request.form.get("score1")
            score2 = request.form.get("score2")
            score3 = request.form.get("score3")
            score4 = request.form.get("score4")
            score5 = request.form.get("score5")
        except:
            abort(400)
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Scores WHERE userID = @0", (uid,))
        if(cursor.fetchone != None):
            responseHeader = "Failed"
            responseBody = "Score table already exists!"
        else:
            cursor.execute("INSERT INTO Scores VALUES (?, ?, ?, ?, ?, ?,)", (uid, score1, score2, score3, score4, score5,))
            db.commit()
            responseHeader = "Complete"
            responseBody = "Scores added to directory"
        cursor.close()

        return render_template("create/resultScores.html", title="Add Scores", responseHeader=responseHeader, responseBody=responseBody,)

    except TemplateNotFound:
        abort(404)

@create.route("/outputLevel", methods =("POST"))
def resultUser():
    try:
        responseHeader = ""
        responseBody = ""
        try: 
            name = request.form.get("name")
            crID = request.form.get("creatorID")
            crSc = request.form.get("creatorScore")
            levelID = request.form.get("levelID")
            lvSer = request.form.get("levelSerialized")

        except:
            abort(400)
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Levels WHERE levelID = @0", (levelID,))
        if(cursor.fetchone != None):
            responseHeader = "Failed"
            responseBody = "Player ID Exists!"
        else:
            cursor.execute("INSERT INTO Levels VALUES (?, ?, ?, ?,)", (name, crID, crSc, lvSer,))
            db.commit()
        #TODO add scores table here!
            responseHeader = "Complete"
            responseBody = "Player added to directory"

        cursor.close()

        return render_template("create/resultLevel.html", title="Add Level", responseHeader=responseHeader, responseBody=responseBody,)

    except TemplateNotFound:
        abort(404)