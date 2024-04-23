from flask import Blueprint, render_template, request, redirect, url_for
import database

# Define the blueprint
login = Blueprint("login", __name__, url_prefix="/login")

# Define the login page handler
@login.route("/", methods=["GET"])
def loginpage():
    return render_template("login/login.html")


@login.route("/result", methods=["POST"])
def login_result():
    name = request.form.get("name")
    db = database.GetDatabase()
    cursor = db.cursor()

   
    cursor.execute("SELECT id FROM data WHERE name = ?", (name,))
    record = cursor.fetchone()

    if record:
        responseHeader = "Welcome Back!"
        responseBody = f"Hello, {name}. Your ID is {record[0]}."
    else:
       
        cursor.execute("INSERT INTO data (name) VALUES (?)", (name,))
        db.commit()
        new_id = cursor.lastrowid
        responseHeader = "Welcome!"
        responseBody = f"Hello, {name}. Your new ID is {new_id}."

    cursor.close()
    return render_template(
        "login/result.html",
        title="Login Result",
        responseHeader=responseHeader,
        responseBody=responseBody,
    )
