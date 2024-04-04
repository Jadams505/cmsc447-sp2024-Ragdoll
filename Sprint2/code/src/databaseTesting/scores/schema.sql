DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Scores;
DROP TABLE IF EXISTS Levels;

CREATE TABLE Users (
    name TEXT UNIQUE,
    userID INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE Scores (
    userID INTEGER PRIMARY KEY,
    levelOne INTEGER,
    levelTwo INTEGER,
    levelThree INTEGER,
    levelFour INTEGER,
    levelFive INTEGER,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Levels ( 
    name TEXT UNIQUE NOT NULL,
    creatorID INTEGER NOT NULL,
    creatorScore INTEGER NOT NULL,
    --everything above this may be deleted to serialize into levelSerialize.
    --but this complitcates the serialization and removes some info from accessiblity
    --come back to this later
    levelID INTEGER PRIMARY KEY AUTOINCREMENT,
    levelSerialized TEXT NOT NULL,
    FOREIGN KEY (creatorID) REFERENCES Users(userID)
);