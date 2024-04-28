from flask import Blueprint, render_template, request, redirect, url_for
import database

# Define the blueprint
login = Blueprint("login", __name__, url_prefix="/login")

# Define the login page handler
@login.route("/", methods=["GET"])
def loginpage():
    database.init_db();
    return render_template("login/login.html")


@login.route("/result", methods=["POST"])
def login_result():
    name = request.form.get("name")
    db = database.get_db()
    cursor = db.cursor()

   
    cursor.execute("SELECT * FROM Users WHERE name = ?", (name,))
    record = cursor.fetchone()

    l1 = -1;
    l2 = -1;
    l3 = -1;
    l4 = -1;
    l5 = -1;
    if record:
        responseHeader = "Welcome Back!"
        responseBody = f"Hello, {name}. Your ID is {record[0]}."
        user_id = record[6];
        l1 = record[1];
        l2 = record[2];
        l3 = record[3];
        l4 = record[4];
        l5 = record[5];
    else:
       
        cursor.execute("INSERT INTO Users (name, levelOne, levelTwo, levelThree, levelFour, levelFive) VALUES (?, ?, ?, ?, ?, ?)", (name, l1, l2, l3, l4, l5))
        db.commit()
        user_id = cursor.lastrowid
    #end if

    cursor.close()
    return redirect(
        url_for("home.index",
        title="B.O.X.E.S.",
        playerName = name,
        playerId = user_id,
        playerScores = [l1, l2, l3, l4, l5])
    )
#end login_result