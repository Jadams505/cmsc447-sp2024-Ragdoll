from flask import Blueprint, render_template, abort, request, redirect, url_for, jsonify
from jinja2 import TemplateNotFound;
import database;


read = Blueprint("read", __name__, url_prefix="/read")


@read.route("/readMainLeaderBoard", methods=["POST"])
def readMainLeaderBoard():
    try:
        level = request.json.get("level");

        users = [];
        db = database.get_db();
        cursor = db.cursor();
        cursor.execute("SELECT * FROM Users");
        while(True):
        	newUser = cursor.fetchone();
        	if(newUser == None):
        		break;
        	#end if

        	if(newUser[level] != -1):
        		users.append(newUser);
        	#end if
        #end while
        cursor.close();

        users.sort(key=lambda x: x[level]);
        numTopUsers = 0;
        topUsers = [];
        topScores = [];
        while(len(users) > 0 and numTopUsers < 5):
        	topUsers.append(users[0][0]);
        	topScores.append(users[0][level]);
        	users.pop(0);
        	numTopUsers += 1;
        #end while

        return jsonify(
        	{
        		'topUsers': topUsers,
        		'topScores': topScores
        	});
    except TemplateNotFound:
        abort(404)
    except Exception as e:
        print(e)
        return jsonify(
        	{
        		'topUsers': [],
        		'topScores': []
        	});
#end readMainLeaderBoard()


@read.route("/readFullLeaderBoard", methods=["POST"])
def readFullLeaderBoard():
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

        #print(users);
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

        return jsonify(
        	{
        		'topUsers': topUsers,
        		'topScores': topScores
        	});
    except TemplateNotFound:
        abort(404)
    except Exception as e:
        print(e)
        return jsonify(
        	{
        		'topUsers': [],
        		'topScores': []
        	});
#end readMainLeaderBoard()

@read.route("/customLevels", methods=["POST"])
def customLevels():
	lowerId = request.json.get("lowerId");
	db = database.get_db();
	cursor = db.cursor();
	cursor.execute("SELECT * FROM Levels");
	customLevels = cursor.fetchall();
	cursor.close();

	print(customLevels);

	customLevels.sort(key=lambda x: x[5]);
	customLevels = customLevels[min(lowerId,len(customLevels)):min(lowerId+5,len(customLevels))];

	customLevelStrings = [];
	customLevelNames = [];
	customLevelCreators = [];

	for l in range(len(customLevels)):
		customLevelStrings.append(customLevels[l][4]);
		customLevelNames.append(customLevels[l][0]);
		customLevelCreators.append(customLevels[l][1]);
	#end for

	return jsonify(
		{
			'customLevelStrings': customLevelStrings,
			'customLevelNames': customLevelNames,
			'customLevelCreators': customLevelCreators
		});
#end customLevels()