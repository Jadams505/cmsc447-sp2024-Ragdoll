from flask import Blueprint, render_template, abort, request, redirect, url_for, jsonify
from jinja2 import TemplateNotFound;
import database;


update = Blueprint("update", __name__, url_prefix="/update")


@update.route("/updateUser", methods=["POST"])
def updateUser():   
    try:
        playerName = request.json.get("name");
        playerId = request.json.get("id");
        playerScores = request.json.get("scores");

        db = database.get_db();
        cursor = db.cursor();
        #cursor.execute("UPDATE (levelOne, levelTwo, levelThree, levelFour, levelFive) FROM Users WHERE userID = @0 SET (@1, @2, @3, @4, @5)", (playerId, *playerScores,))
        #cursor.execute("UPDATE Users SET levelOne=@1, levelTwo=@2, levelThree=@3, levelFour=@4, levelFive=@5 WHERE userID=@0;", (playerId, playerScores[0], playerScores[1], playerScores[2], playerScores[3], playerScores[4],));
        cursor.execute("UPDATE Users SET levelOne=?, levelTwo=?, levelThree=?, levelFour=?, levelFive=? WHERE userID=?;", (playerScores[0], playerScores[1], playerScores[2], playerScores[3], playerScores[4], playerId));
        db.commit();
        cursor.close();

        return jsonify({});
    except TemplateNotFound:
        abort(404)
    except Exception as e:
        print(e)
        return jsonify({});

@update.route("/updateScores/<int:id>", methods = ["POST"])
def updateScores():
    try:
        responseHeader = ""
        responseBody = ""
        try:
            score1 = request.form.get("score1")
            score2 = request.form.get("score2")
            score3 = request.form.get("score3")
            score4 = request.form.get("score4")
            score5 = request.form.get("score5")
        except:
            abort(400)

        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Scores WHERE userID = @0", (id,))
        if(cursor.fetchone() == None):
            responseHeader = "Failed!"
            responseBody = "Score Table to update does not exist!"

        else: # :( i hate this
            cursor.execute("UPDATE Levels SET score1 = ?",
                           "UPDATE Levels SET score2 = ?",
                           "UPDATE Levels SET score3 = ?",
                           "UPDATE Levels SET score4 = ?",
                           "UPDATE Levels SET score5 = ?",
                           "WHERE userID = ?",
                           (score1,score2,score3,score4,score5, id,))
            
            responseHeader = "Success!"
            responseBody = "Scores have been updated!"
            db.commit()
            cursor.close()
            return render_template("update/updateScores.html", title="Update Scores", responseHeader=responseHeader, responseBody=responseBody,)
        
    except TemplateNotFound:
        abort(404)

@update.route("/updateLevel/<int:id>", methods=["POST"])
def updateLevel():
    try:
        responseHeader = ""
        responseBody = ""
        try:
            levelName = request.form.get("levelName")
            levelSerialized = request.form.get("levelSerialized")
            creatorScore = request.form.get("creatorScore")

        except:
            abort(400)

        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Levels WHERE levelID = @0", (id,))
        if(cursor.fetchone() == None):
            responseHeader = "Failed!"
            responseBody = "Level to update does not exist!"
        else:
            cursor.execute("UPDATE Levels SET name = ?",
                           "UPDATE Levels SET levelSerialized = ?",
                           "UPDATE Levels SET creatorScore = ?",
                           "WHERE levelID = ?",
                           (levelName, levelSerialized, creatorScore, id,)
                           )
            responseHeader = "Success!"
            responseBody = "Level has been updated!"
            db.commit()
            cursor.close()
            return render_template("update/updateLevel.html", title="Update Level", responseHeader=responseHeader, responseBody=responseBody,)
        
    except TemplateNotFound:
        abort(404)


@update.route("/deletePlayer/<int:id>", methods=["POST"])
def deletePlayer():
    db = database.get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM Users WHERE userID @0", (id,))
    if(cursor.fetchone() == None):
        #if the level to delete doesnt exist, error out
        abort(400)
    else:
        db.execute(
            "DELETE FROM Users WHERE userID = ?", 
            "DELETE FROM Scores WHERE userID = ?",
            "DELETE FROM Levels WHERE creatorID = ?", (id, id, id,)
        )
        db.commit()

    return redirect("update/deletePlayer.html")

#deletes a level given the id passed in
@update.route("/deleteLevel/<int:id>", methods=["POST"])
def deleteLevel():
    db = database.get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Levels WHERE levelID @0", (id,))
    if(cursor.fetchone() == None):
        #if the level to delete doesnt exist, error out
        abort(400)
    else:
        #otherwise we delete the given level
        db.execute(
            "DELETE FROM Levels WHERE levelID = ?", (id,)
        )
        db.commit()
    #send it back to user
    return redirect("update/deleteLevel.html")