# -*- coding: utf-8 -*-
"""
Created on Tue Feb 20 15:56:24 2024

@author: jetth
"""

import os
from flask import Flask, g
from views.home import home
#from views.update import update
#from views.add import add
#from views.mainmenu import mainmenu
from views.update import update
from views.create import create
from views.login import login
from views.dhome import dhome
import database


app = Flask(__name__, instance_relative_config=True);
app.debug = True;

app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'database.db'),
);

# load the instance config, if it exists, when not testing
app.config.from_pyfile('config.py', silent=True)

# ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass;
#end try


@app.teardown_appcontext
def close_connection(exception):
    # close database
    db = getattr(g, 'DATABASE', None);
    if db is not None:
        db.close();
    #end if
#end CloseConnection()

app.register_blueprint(home)
#app.register_blueprint(update)
#app.register_blueprint(add)
#app.register_blueprint(mainmenu);
app.register_blueprint(login)
app.register_blueprint(create);
app.register_blueprint(update);
app.register_blueprint(dhome);

# a simple page that says hello
@app.route('/hello')
def hello():
    return 'I\'m not dead yet!' 

if __name__ == '__main__':
    # application
    database.init_app(app);
    app.run(port=8000, threaded=True)
