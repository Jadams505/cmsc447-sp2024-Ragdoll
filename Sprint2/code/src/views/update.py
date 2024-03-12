# -*- coding: utf-8 -*-
"""
Created on Wed Feb 28 12:57:26 2024

@author: jetth
"""

from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound;
import database;

update = Blueprint("update", __name__, url_prefix="/update");

@update.route("/", methods=["POST"])
def index():
    try:
        try:
            name = request.form.get("name");
            iden = request.form.get("id");
            points = request.form.get("points");
        except:
            abort(400);
        #end try
        
        return render_template(
            "update/index.html",
            title="Update",
            name=name,
            id=iden,
            points=points,
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()

@update.route("/result/", methods=["POST"])
def result():
    try:
        responseHeader = "";
        responseBody = "";
        
        try:
            oldName = request.form.get("oldName");
            oldIden = request.form.get("oldId");
            oldPoints = request.form.get("oldPoints");
            
            name = request.form.get("name");
            iden = request.form.get("id");
            points = request.form.get("points");
        except:
            abort(400);
        #end try
        
        db = database.GetDatabase();
        cursor = db.cursor();
        
        if(oldIden != iden):
            cursor.execute("SELECT * FROM data WHERE id=@0", (iden,));
            if(cursor.fetchone() != None):
                responseHeader = "Failure";
                responseBody = "Entry with that ID exists already."
            else:
                cursor.execute("UPDATE data SET name=@0, id=@1, points=@2 WHERE name=@3 AND id=@4 AND points=@5", (name, iden, points, oldName, oldIden, oldPoints));
                db.commit();
                
                responseHeader = "Success";
                responseBody = "The entry was successfully updated."    
            #end if
        else:
            cursor.execute("UPDATE data SET name=@0, id=@1, points=@2 WHERE name=@3 AND id=@4 AND points=@5", (name, iden, points, oldName, oldIden, oldPoints));
            db.commit();
            
            responseHeader = "Success";
            responseBody = "The entry was successfully updated." 
        #end if
        
        cursor.close();
        
        return render_template(
            "update/result.html",
            title="Update Result",
            responseHeader=responseHeader,
            responseBody=responseBody
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()