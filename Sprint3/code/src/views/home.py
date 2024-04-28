# -*- coding: utf-8 -*-
"""
Created on Tue Feb 20 16:02:54 2024

@author: jetth
"""

import database
from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound;

home = Blueprint("home", __name__, url_prefix="/");

@home.route("/", methods=["GET"])
def index():
    try:
        
        
        return render_template(
            "home/index.html",
            title="Home",
            playerName = request.args.get('playerName'),
            playerId = request.args.get('playerId'),
            playerScores = request.args.getlist('playerScores')
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()