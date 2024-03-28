# -*- coding: utf-8 -*-
"""
Created on Wed Feb 28 15:48:28 2024

@author: jetth
"""

from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound;
import database;

add = Blueprint("add", __name__, url_prefix="/add");

@add.route("/", methods=["GET", "POST"])
def index():
    try:
        return render_template(
            "add/index.html",
            title="Add",
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()

@add.route("/result/", methods=["POST"])
def result():
    try:
        responseHeader = "";
        responseBody = "";
        
        try:
            name = request.form.get("name");
            iden = request.form.get("id");
            points = request.form.get("points");
        except:
            abort(400);
        #end try

        db = database.GetDatabase();
        cursor = db.cursor();

        cursor.execute("SELECT * FROM data WHERE id=@0", (iden,));
        if(cursor.fetchone() != None):
            responseHeader = "Failure";
            responseBody = "Entry with that ID exists already."
        else:
            cursor.execute("INSERT INTO data VALUES (?, ?, ?)", (name, iden, points));
            db.commit();
            
            responseHeader = "Success";
            responseBody = "The entry was added to the database."    
        #end if
        
        cursor.close();
        
        return render_template(
            "add/result.html",
            title="Add Result",
            responseHeader=responseHeader,
            responseBody=responseBody,
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()