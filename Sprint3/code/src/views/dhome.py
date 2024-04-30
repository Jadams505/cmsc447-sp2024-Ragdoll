from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
import json
import database as database

dhome = Blueprint("dhome", __name__, url_prefix="/dhome")

#dhomepage displays all the current "users" in the database TODO this does not actually work and its driving me insane
@dhome.route("/", methods=["GET", "POST"])
def dhomepage():
    try:
        #access the database and get all the data from it
        db = database.get_db()
        tableData = db.execute( 'SELECT p.name, p.userID'
                                ' FROM Users p JOIN Users u ON p.userId = u.userID'
                                ' ORDER BY p.userID DESC'
        ).fetchall()
        #display it out
        db.close()
        print(tableData)
        return render_template("tableViewPlayer.html", title = "dhome", tableData = tableData)

    except TemplateNotFound:
        #catch error by yelling at the user
        abort(404)

#display out a single user score called "ID", as well as providing access to Update/Delete functions
@dhome.route("/scores/<int:id>", methods=["GET", "POST"])
def userScores():
    try:
        #get db access
        db = database.get_db()
        cursor = db.cursor()
        #get all the scores
        cursor.execute("SELECT * FROM Scores WHERE userID = @0", (id,))
        if(cursor.fetchone() == None):
            #if we have no scores, error out
            abort(400)
        else:
            #otherwise throw the data to the table
            tableData = cursor.fetchall()
            db.close()
            return render_template("tableViewScores.html", title= "Score View", tableData = tableData)
    except TemplateNotFound:
        abort(404)

#display out all scores into a table, provides update/delete access
@dhome.route("/scores", methods=["GET", "POST"])
def allScores():
    try:
        #try to access the database
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Scores")
        #send all the data to the table and then send it dhome
        tableData = cursor.fetchall()
        db.close()
        return render_template("tableViewScores.html", title= "Score View All", tableData = tableData)
    except TemplateNotFound:
        abort(404)

#TODO: allow fetch by ID
@dhome.route("/gimmeLevels/<int:firstId>", methods=["GET",])
def getLevels():
    try:
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Levels")
        levels = {
            "level1": cursor.fetchone(),
            "level2": cursor.fetchone(),
            "level3": cursor.fetchone(),
            "level4": cursor.fetchone(),
            "level5": cursor.fetchone(),
        }
        json_object = {"data": [levels]}
        return json.dumps(json_object)
    except TemplateNotFound:
                #catch error by yelling at the user
        abort(404)


#login method,
@dhome.route("/login/<string:nameP>", methods=["GET", "POST"])
def loginUser(nameP):
    try:
        #if passed no name, die
        if(nameP == ""):
            abort(400)
        #access the database and get all the data from it
        db = database.get_db()
        cursor = db.cursor()
        #check if the user exists already
        cursor.execute("SELECT * FROM Users WHERE name = @0", (nameP,))
        #if the user does not exist, we create the user
        obj = cursor.fetchone()
        userScores = [-1,0,0,0,0,0]
        if(obj == None):
            #insert and immediately commit
            cursor.execute("INSERT INTO Users VALUES ?", (nameP,))
            db.commit()
            #then get the user to get their UID
            cursor.execute("SELECT * FROM Users WHERE name = @0", (nameP,))
            obj = cursor.fetchone()
            uid = obj[1]
            #then create the scores table based on the harvested UID
            cursor.execute("INSERT INTO Scores VALUES (?, ?, ?, ?, ?, ?)", (uid, 0, 0, 0, 0, 0,))
            #commit again. bro?
            db.commit()
            userScores = cursor.execute("SELECT * FROM Scores WHERE userID = @0", (obj[1],))
        # gods most cursed json
        db.close()
        userToReturn = {
                "name": obj[0],
                "userID" : obj[1],
                "score1": userScores[1],
                "score2": userScores[2],
                "score3": userScores[3],
                "score4": userScores[4],
                "score5": userScores[5],
        }
        json_object = {"data": [userToReturn]}
        return json.dumps(json_object)

    except TemplateNotFound:
        #catch error by yelling at the user
        abort(404)

#this is what the docs say!
@dhome.errorhandler(404)
def page_not_found(e):
    return render_template('404.html')