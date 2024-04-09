from flask import Blueprint, abort, render_template
from jinja2 import TemplateNotFound
import database

create = Blueprint("create", __name__, url_prefix="/create")

@create.route("/", methods=("GET,"))
def create():
    try:
        return render_template(
            "create/index.html",
            title="Create",
        )
    except TemplateNotFound:
        abort(404)

@create.route("", methods =("POST"))
def result():
    return