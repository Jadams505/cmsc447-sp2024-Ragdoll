# -*- coding: utf-8 -*-
"""
Created on Thu Apr  4 17:51:01 2024

@author: jetth
"""

import database
from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound;

mainmenu = Blueprint("mainmenu", __name__, url_prefix="/mm");

@mainmenu.route("/", methods=["GET", "POST"])
def index():
    try:
        return render_template(
            "mainMenue/index.html",
            title="Main Menu",
            );
    except TemplateNotFound:
        abort(404);
    #end try
#end index()