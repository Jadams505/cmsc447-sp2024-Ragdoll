from flask import Blueprint, render_template, abort, request, redirect, url_for, jsonify
from jinja2 import TemplateNotFound;
import requests;
import database


update = Blueprint("update", __name__, url_prefix="/update")

@update.route("/updateUser/", methods=["GET"])
def updatePage():
    return render_template("update/updateUserCapture.html")


@update.route("/updateUserCapture/", methods=["POST"])
def updateUser():
    try:
        playerName = request.json.get("name")
        playerId = request.json.get("id")
        playerScores = request.json.get("scores")

        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE Users SET levelOne=?, levelTwo=?, levelThree=?, levelFour=?, levelFive=? WHERE userID=?", (playerScores[0], playerScores[1], playerScores[2], playerScores[3], playerScores[4], playerId))
        db.commit()
        cursor.close()

        return jsonify({})
    except Exception as e:
        print(e)
        return jsonify({})

@update.route("/uri", methods=["POST"])
def updateUri():
    try:
        users = [];
        db = database.get_db();
        cursor = db.cursor();
        cursor.execute("SELECT * FROM Users");
        while(True):
            newUser = cursor.fetchone();
            if(newUser == None):
                break;
            #end if

            isUserValid = True;
            for l in range(5):
                if(newUser[l + 1] == -1):
                    isUserValid = False;
                    break;
                #end if
            #end for

            if(isUserValid):
                users.append(newUser);
            #end if
        #end while
        cursor.close();

        users.sort(key=lambda x: (x[1] + x[2] + x[3] + x[4] + x[5]));
        numTopUsers = 0;
        topUsers = [];
        topScores = [];
        while(len(users) > 0 and numTopUsers < 5):
            topUsers.append(users[0][0]);
            topScores.append(users[0][1] + users[0][2] + users[0][3] + users[0][4] + users[0][5]);
            users.pop(0);
            numTopUsers += 1;
        #end while
        cursor.close();
        #print(topUsers)

        # get best 5 and make JSON out of it
        inner_dict = {
            "Group": "Ragdoll",
            "Title": "Top 5 Scores"
        }
        
        for u in range(len(topUsers)):
            inner_dict[topUsers[u]] = str(topScores[u]);
        #end for
        for u in range(len(topUsers), 5):
            inner_dict["NO_SCORE_" + str(u)] = str(-1);
        #end for

        json = {"data": [inner_dict]}
        #print(jsonify(json).json);
        result = requests.post("https://eope3o6d7z7e2cc.m.pipedream.net", data=json);
        #print(result)

        return jsonify(
            {
                'ok': result.ok
            });
    except TemplateNotFound:
        abort(404)
    except Exception as e:
        print(e)
        return jsonify({});
#end updateUri()

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
def updateLevel(id):
    try:
        levelName = request.form.get("levelName")
        levelSerialized = request.form.get("levelSerialized")
        creatorScore = request.form.get("creatorScore")

        db = database.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Levels WHERE levelID=?", (id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "Level to update does not exist!"}), 400

        cursor.execute("UPDATE Levels SET name=?, levelSerialized=?, creatorScore=? WHERE levelID=?", (levelName, levelSerialized, creatorScore, id))
        db.commit()
        cursor.close()
        return jsonify({"success": "Level has been updated!"})

    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred"}), 500


@update.route("/deleteUser/<int:id>", methods=["POST"])
def deleteUser(id):
    try:
        db = database.get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM Users WHERE userID=?", (id,))
        if cursor.fetchone() is None:
            abort(400)
        else:
            cursor.execute("DELETE FROM Users WHERE userID=?", (id,))
            cursor.execute("DELETE FROM Scores WHERE userID=?", (id,))
            cursor.execute("DELETE FROM Levels WHERE creatorID=?", (id,))
            db.commit()
            return redirect("update/deletePlayer.html")

    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred"}), 500

#deletes a level given the id passed in
@update.route("/deleteLevel/<int:id>", methods=["POST"])
def deleteLevel(id):
    try:
        db = database.get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM Levels WHERE levelID=?", (id,))
        if cursor.fetchone() is None:
            #if the level to delete doesnt exist, error out
            abort(400)
        else:
             #otherwise we delete the given level
            cursor.execute("DELETE FROM Levels WHERE levelID=?", (id,))
            db.commit()
            return redirect("update/deleteLevel.html")
        #send it back to user
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred"}), 500