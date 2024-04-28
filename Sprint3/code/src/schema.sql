CREATE TABLE IF NOT EXISTS Users (
    name TEXT UNIQUE,
    levelOne INTEGER,
    levelTwo INTEGER,
    levelThree INTEGER,
    levelFour INTEGER,
    levelFive INTEGER,
    userID INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS Scores (
    userID INTEGER PRIMARY KEY,
    levelOne INTEGER,
    levelTwo INTEGER,
    levelThree INTEGER,
    levelFour INTEGER,
    levelFive INTEGER,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE IF NOT EXISTS Levels ( 
    name TEXT UNIQUE NOT NULL,
    creatorID INTEGER NOT NULL,
    creatorScore INTEGER NOT NULL,
    levelSerialized TEXT NOT NULL,

    levelID INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (creatorID) REFERENCES Users(userID)
);