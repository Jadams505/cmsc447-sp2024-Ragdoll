# -*- coding: utf-8 -*-
"""
Created on Thu Feb 29 14:39:00 2024

@author: jetth
"""

from flask import g
import sqlite3;

def GetDatabase():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect("database.db");
    return db
#end GetDatabase()

def InitDatabase():
    db = sqlite3.connect("database.db");
    cursor = db.cursor();
    cursor.execute("CREATE TABLE IF NOT EXISTS data (name TEXT, id INTEGER, points INTEGER)");
    db.commit();
    cursor.close();
    db.close();
#end InitDatabase()