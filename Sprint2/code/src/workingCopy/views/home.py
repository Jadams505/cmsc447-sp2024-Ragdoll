# -*- coding: utf-8 -*-
"""
Created on Tue Feb 20 16:02:54 2024

@author: jetth
"""

import database
from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound;

home = Blueprint("home", __name__, url_prefix="/");

@home.route("/", methods=["GET", "POST"])
def index():
    try:
        db = database.GetDatabase();
        cursor = db.cursor();
        cursor.execute("SELECT * FROM data");
        tableData = cursor.fetchall();
        
        if(request.method == "POST"):
            searchReq = request.form.get("searchBtn", None);
            deleteReq = request.form.get("deleteBtn", None);
            
            if(searchReq != None):
                try:
                    searchName = request.form.get("name");
                    searchIden = request.form.get("id");
                    searchPoints = request.form.get("points");
                    
                    if(searchName != ""):
                        if(searchIden != ""):
                            if(searchPoints != ""):
                                cursor.execute("SELECT * FROM data WHERE name=@0 AND id=@1 AND points=@2", (searchName, searchIden, searchPoints,));
                                tableData = cursor.fetchall();
                            else:
                                cursor.execute("SELECT * FROM data WHERE name=@0 AND id=@1", (searchName, searchIden,));
                                tableData = cursor.fetchall();
                            #end if
                        elif(searchPoints != ""):
                            cursor.execute("SELECT * FROM data WHERE name=@0 AND points=@1", (searchName, searchPoints,));
                            tableData = cursor.fetchall();
                        else:
                            cursor.execute("SELECT * FROM data WHERE name=@0", (searchName,));
                            tableData = cursor.fetchall();
                        #end if
                    elif(searchIden != ""):
                        if(searchPoints != ""):
                            cursor.execute("SELECT * FROM data WHERE id=@0 AND points=@1", (searchIden, searchPoints,));
                            tableData = cursor.fetchall();
                        else:
                            cursor.execute("SELECT * FROM data WHERE id=@0", (searchIden,));
                            tableData = cursor.fetchall();
                        #end if
                    elif(searchPoints != ""):
                        cursor.execute("SELECT * FROM data WHERE points=@0", (searchPoints,));
                        tableData = cursor.fetchall();
                    #end if
                except:
                    abort(400);
                #end try
            elif(deleteReq != None):
                try:
                    deleteName = request.form.get("name");
                    deleteIden = request.form.get("id");
                    deletePoints = request.form.get("points");
                    
                    cursor.execute("DELETE FROM data WHERE name=@0 AND id=@1 AND points=@2", (deleteName, deleteIden, deletePoints,));
                    db.commit();
                    
                    cursor.execute("SELECT * FROM data");
                    tableData = cursor.fetchall();
                except:
                    abort(400);
                #end try
            #end if
        #end if
        
        return render_template(
            "home/index.html",
            title="Home",
            tableData=tableData,
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()