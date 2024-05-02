from flask import Blueprint, abort, render_template, request, jsonify, redirect, url_for
from jinja2 import TemplateNotFound
import database as database;

create = Blueprint("create", __name__, url_prefix="/create")

@create.route("/customLevel", methods=["POST"])
def customLevel():
	levelName = request.json.get("levelName");
	creatorName = request.json.get("creatorName");
	creatorID = request.json.get("creatorId");
	creatorScore = -1;
	levelSerialized = request.json.get("levelString");

	#print(levelName, creatorName, creatorID, creatorScore, levelSerialized)

	db = database.get_db();
	cursor = db.cursor();
	cursor.execute("INSERT INTO Levels (name, creatorName, creatorID, creatorScore, levelSerialized) VALUES (?, ?, ?, ?, ?)", (levelName, creatorName, creatorID, creatorScore, levelSerialized));
	db.commit();
	cursor.close();
	
	return jsonify({});
#end customLevel()

#Default /create/ route, just sends to the index page /create/index.html
@create.route("/", methods=["GET", "POST"])
def createIndex():
    try:
        return render_template("create/index.html", title="Create",)
    except TemplateNotFound:
        abort(404)

#/create/outputUser, creates a new user from the passed in information "name" and "id", which populates with all 0 scores until updated
@create.route("/outputUser", methods=["POST"])
def resultUser():
    try:
        try:
            name = request.form.get("name")
            uid = request.form.get("id")
        except:
            abort(400)
            
        #send the data to the actual database
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Users WHERE userID = ?", (uid,))
        
        #fail if we find the actual DB
        if cursor.fetchone() is not None:
                cursor.close()
                return redirect(url_for("dhome.dhomepage"))
        else:
        #otherwise send it to the tables
        #does not check for the scores table existence
            cursor.execute("INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?, ?)", (name, -1, -1, -1, -1, -1, uid))
            db.commit()

        cursor.close()
        #send it back with the relevant data
        return redirect(url_for("dhome.dhomepage"))

    except TemplateNotFound:
        abort(404)

#route for creating a new score table
@create.route("/outputScores", methods=["POST"])
def resultScores():
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
        #create a new score if and only if another score doesnt exitst.
        #this probably will never be called bc its done above, but its good to have for testing
        if(cursor.fetchone != None):
            responseHeader = "Failed"
            responseBody = "Score table already exists!"
        else:
            #insert it!
            cursor.execute("INSERT INTO Scores VALUES (?, ?, ?, ?, ?, ?,)", (uid, score1, score2, score3, score4, score5,))
            db.commit()
            responseHeader = "Complete"
            responseBody = "Scores added to directory"
        cursor.close()
        #send it back!
        return render_template("create/resultScores.html", title="Add Scores", responseHeader=responseHeader, responseBody=responseBody,)

    except TemplateNotFound:
        abort(404)

#create new level given data passed in. 
@create.route("/outputLevel", methods =["POST"])
def resultLevel():
    try:
        responseHeader = ""
        responseBody = ""
        #collect relevant data
        try: 
            name = request.form.get("name")
            crID = request.form.get("creatorID")
            crSc = request.form.get("creatorScore")
            levelID = request.form.get("levelID")
            lvSer = request.form.get("levelSerialized")
        except:
            #if we cant find the data, error out
            abort(400)
        #check if the level id already exists
        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Levels WHERE levelID = @0", (levelID,))
        if(cursor.fetchone != None):
            responseHeader = "Failed"
            responseBody = "Player ID Exists!"
        else:
            #if the level doesnt exist, we insert and commit
            cursor.execute("INSERT INTO Levels VALUES (?, ?, ?, ?,)", (name, crID, crSc, lvSer,))
            db.commit()
            responseHeader = "Complete"
            responseBody = "Player added to directory"
        cursor.close() #ensure database safety
        #throw it home
        return render_template("create/resultLevel.html", title="Add Level", responseHeader=responseHeader, responseBody=responseBody,)

    except TemplateNotFound:
        abort(404)