# -*- coding: utf-8 -*-
"""
Created on Tue Feb 20 16:02:54 2024

@author: jetth
"""

import database
from flask import Blueprint, render_template, abort, request, redirect, url_for
from jinja2 import TemplateNotFound;

home = Blueprint("home", __name__, url_prefix="/");

@home.route("/", methods=["GET", "POST"])
def index():
    try:
        if(request.method == "GET"):
            return redirect(url_for("login.loginpage"));
        else:
            return render_template(
                "home/index.html",
                title="Home",
                #playerName = request.args.get('playerName'),
                #playerId = request.args.get('playerId'),
                #playerScores = request.args.getlist('playerScores')
                );
        #end if
    except TemplateNotFound:
        abort(404);
    #end try
#end index()