const MOVE_UP = 0;
const MOVE_LEFT = 1;
const MOVE_DOWN = 2;
const MOVE_RIGHT = 3;

const MOVE_TEXT_X = 300;
const MOVE_TEXT_Y = 20;

class LevelPlayer extends Phaser.Scene
{
	inEditor = false;
	isPlaying = false;
	curLevel;
	moveCount = 0;
	moveText = null;
	volatileGuiGroup; //Refreshed on move
	stableBoardGroup; //Refreshed on board size change
	volatileBoardGroup; //Subject to frequent refresh
	miniMenuOpen = false;
	isMainLevel = false;

	constructor()
	{
		super({ key: LEVEL_PLAYER_SCENE_NAME });
	}

	init(data)
	{
		this.curLevel = data.level;
		this.inEditor = data.inEditor == undefined ? false : data.inEditor;
		this.isMainLevel = data.isMainLevel == undefined ? false : data.isMainLevel;

		this.SubscribeToEvents();

		this.isPlaying = true;
	}

	create()
	{
		this.moveText = null;
		this.volatileGuiGroup = this.physics.add.staticGroup();
		this.stableBoardGroup = this.physics.add.staticGroup();
		this.volatileBoardGroup = this.physics.add.staticGroup();

		this.ResetLevel();
		this.Draw();
		this.CheckVictory();
	}

	SubscribeToEvents()
	{
		this.input.keyboard.on('keydown', this.HotkeyEvents, this);
	}

	UnsubscribeFromEvents()
	{
		this.input.keyboard.off('keydown', this.HotkeyEvents);
	}

	HotkeyEvents(event)
	{
		//Only accept moves if playing
		if(!this.isPlaying)
		{
			return;
		}

		switch(event.key)
		{
			case("W"):
			case("w"):
			//case("ArrowUp"):
				//Move Up
				if(this.TryMakeMove(MOVE_UP))
				{
					this.moveCount++;
				}
				break;
			case("A"):
			case("a"):
			//case("ArrowLeft"):
				//Move Left
				if(this.TryMakeMove(MOVE_LEFT))
				{
					this.moveCount++;
				}
				break;
			case("S"):
			case("s"):
			//case("ArrowDown"):
				//Move Down
				if(this.TryMakeMove(MOVE_DOWN))
				{
					this.moveCount++;
				}
				break;
			case("D"):
			case("d"):
			//case("ArrowRight"):
				//Move Right
				if(this.TryMakeMove(MOVE_RIGHT))
				{
					this.moveCount++;
				}
				break;
			case("R"):
			case("r"):
				//Reset Level
				this.ResetLevel();
				break;
		}
		
		this.CheckVictory();
		this.moveText.setText(`MOVES: ${this.moveCount}`);
	}

	TryMakeMove(moveDir)
	{
		var moveX = 0;
		var moveY = 0;
		switch(moveDir)
		{
			case(MOVE_UP):
				moveY = -1;
				break;
			case(MOVE_LEFT):
				moveX = -1;
				break;
			case(MOVE_DOWN):
				moveY = 1;
				break;
			case(MOVE_RIGHT):
				moveX = 1;
				break;
		}

		var newLevelData = this.curLevel.boardData.DeepCopyLevelData();
		var moveablePlayers = [];

		//Check which players can move
		for(var i = 0; i < this.curLevel.boardData.boardWidth; i++)
		{
			for(var j = 0; j < this.curLevel.boardData.boardHeight; j++)
			{
				if(this.curLevel.boardData.levelData[i][j] == PLAYER_ID)
				{
					if(this.CanMove(i, j, moveX, moveY))
					{
						moveablePlayers.push([i, j]);
					}
				}
			}
		}


		//Clear moving players beforehand
		for(var i = 0; i < moveablePlayers.length; i++)
		{
			const posX = moveablePlayers[i][0];
			const posY = moveablePlayers[i][1];
			newLevelData[posX][posY] = FLOOR_ID;
		}

		//Make moves
		for(var i = 0; i < moveablePlayers.length; i++)
		{
			const posX = moveablePlayers[i][0];
			const posY = moveablePlayers[i][1];
			if(this.curLevel.boardData.levelData[posX+moveX][posY+moveY] != FLOOR_ID)
			{
				newLevelData[posX + (2*moveX)][posY + (2*moveY)] =	this.curLevel.boardData.levelData[posX+moveX][posY+moveY];
			}

			newLevelData[posX + moveX][posY + moveY] = this.curLevel.boardData.levelData[posX][posY];
		}

		//Place moving players in their new positions
		for(var i = 0; i < moveablePlayers.length; i++)
		{
			const posX = moveablePlayers[i][0] + moveX;
			const posY = moveablePlayers[i][1] + moveY;
			newLevelData[posX][posY] = PLAYER_ID;
		}

		this.curLevel.boardData.levelData = newLevelData;

		this.DrawVolatile();

		//Return if a move was made or not
		return (moveablePlayers.length > 0);
	}

	CanMove(posX, posY, moveX, moveY)
	{
		//Check border
		if(posX + moveX < 0 || posX + moveX >= this.curLevel.boardData.boardWidth ||
			posY + moveY < 0 || posY + moveY >= this.curLevel.boardData.boardHeight)
		{
			return false;
		}

		
		var destTile = this.curLevel.boardData.levelData[posX + moveX][posY + moveY];
		
		switch(destTile)
		{
			case(FLOOR_ID):
				//Floor means empty, so we can move
				return true;
				break;
			case(WALL_ID):
				//We can't move into a wall
				return false;
				break;
			case(PLAYER_ID):
				//If next tile is a player, we need to recursively check if they can move.
				return this.CanMove(posX + moveX, posY + moveY, moveX, moveY);
				break;
			case(BOX_DEFAULT_ID):
			default:
				var curTile = this.curLevel.boardData.levelData[posX][posY];
				if(curTile == PLAYER_ID)
				{
					//If we're a player, we can push boxes, so we need to recursively check
					return this.CanMove(posX + moveX, posY + moveY, moveX, moveY);
				}
				else
				{
					//If we're a box, boxes can't push boxes
					return false;
				}
				break;
		}

		//Should never occur
		return false;
	}

	ResetLevel(checkVictory = true)
	{
		this.curLevel.ResetLevel();
		this.moveCount = 0;
		this.DrawVolatile();

		//Stupid thing for mini menu
		if(this.moveText != null)
		{
			this.moveText.setText(`MOVES: ${this.moveCount}`);
		}

		this.CloseMiniMenu();

		if(checkVictory)
		{
			this.CheckVictory();
		}
	}

	CheckVictory()
	{
		if(this.curLevel.CheckVictory())
		{
			if(this.inEditor)
			{
				this.OpenEditorVictory();
			}
			else
			{
				if(this.isMainLevel)
				{
					//Update scores
					if(PLAYER.mainLevelScores[this.curLevel.levelId] > this.moveCount || PLAYER.mainLevelScores[this.curLevel.levelId] == -1)
					{
						PLAYER.mainLevelScores[this.curLevel.levelId] = this.moveCount;

						PLAYER.UpdateDatabase();
					}

					//Update completed levels
					if(PLAYER.mainLevelsCompleted <= this.curLevel.levelId)
					{
						PLAYER.mainLevelsCompleted++;
					}

					this.OpenPlayerVictoryMainLevel();
				}
				else
				{
					this.OpenPlayerVictoryCustomLevel();
				}
			}
		}

		//Else do nothing
	}

	OpenMiniMenu()
	{
		this.miniMenuOpen = true;
		this.isPlaying = false;
		if(this.inEditor)
		{
			this.scene.launch(MINI_MENU_SCENE_NAME, {contextScene:this, menuButtons:["Resume", "Restart", "Edit"], menuFuncs:[this.CloseMiniMenu, this.ResetLevel, this.OpenEditor], menuTitle: "Pause", dataTitle:""});
		}
		else
		{
			if(this.isMainLevel)
			{
				this.scene.launch(MINI_MENU_SCENE_NAME, {contextScene:this, menuButtons:["Resume", "Restart", "Menu"], menuFuncs:[this.CloseMiniMenu, this.ResetLevel, this.OpenMainLevelsScene], menuTitle: "Pause", dataTitle:""});
			}
			else
			{
				this.scene.launch(MINI_MENU_SCENE_NAME, {contextScene:this, menuButtons:["Resume", "Restart", "Menu"], menuFuncs:[this.CloseMiniMenu, this.ResetLevel, this.OpenCustomLevelsScene], menuTitle: "Pause", dataTitle:""});
			}
		}
	}

	OpenPlayerVictoryMainLevel()
	{
		this.miniMenuOpen = true;
		this.isPlaying = false;
		this.scene.launch(MINI_MENU_SCENE_NAME, {contextScene:this, menuButtons:["Continue", "Restart", "Menu"], menuFuncs:[this.OpenNextLevel, this.ResetLevel, this.OpenMainLevelsScene], menuTitle: "Victory", dataTitle:`Moves: ${this.moveCount}`});
	}

	OpenNextLevel()
	{
		const levelId = this.curLevel.levelId + 1;//PLAYER.mainLevelsCompleted;
		if(levelId == 5)
		{
			this.OpenMainLevelsScene();
			return;
		}

        var boardDataString = MAIN_LEVEL_STRINGS[levelId];
        var testLevel = new Level(levelId, MAIN_LEVEL_NAMES[levelId], boardDataString);

        //var testPlayer = new LevelPlayer(testLevel);
        //testPlayer.Draw();
        
        this.CloseMiniMenu();
        //this.scene.stop(LEVEL_PLAYER_SCENE_NAME);
        this.scene.start(LEVEL_PLAYER_SCENE_NAME, {level:testLevel, inEditor:false, isMainLevel:true });
	}

	OpenPlayerVictoryCustomLevel()
	{
		this.miniMenuOpen = true;
		this.isPlaying = false;
		this.scene.launch(MINI_MENU_SCENE_NAME, {contextScene:this, menuButtons:["Restart", "Menu"], menuFuncs:[this.ResetLevel, this.OpenCustomLevelsScene], menuTitle: "Victory", dataTitle:`Moves: ${this.moveCount}`});
	}

	OpenEditorVictory()
	{
		this.miniMenuOpen = true;
		this.isPlaying = false;
		this.scene.launch(MINI_MENU_SCENE_NAME, {contextScene:this, menuButtons:["Restart", "Edit", "Upload"], menuFuncs:[this.ResetLevel, this.OpenEditor, this.UploadLevel], menuTitle: "Victory", dataTitle:`Moves: ${this.moveCount}`});
	}

	OpenEditor()
	{
		this.ResetLevel(false);
		this.CloseMiniMenu();
		this.scene.launch(LEVEL_EDITOR_SCENE_NAME, {level:this.curLevel});
		this.scene.stop(LEVEL_PLAYER_SCENE_NAME)
	}

	CloseMiniMenu()
	{
		if(this.miniMenuOpen)
		{
			this.scene.stop(MINI_MENU_SCENE_NAME);
			this.miniMenuOpen = false;
			this.isPlaying = true;
		}
	}

	OpenMainLevelsScene()
	{
		this.CloseMiniMenu();

		this.scene.launch(MAIN_LEVELS_SCENE_NAME);
		this.scene.stop(LEVEL_PLAYER_SCENE_NAME);
	}

	OpenCustomLevelsScene()
	{
		this.CloseMiniMenu();

		this.scene.launch(CUSTOM_LVL_SCENE_NAME);
		this.scene.stop(LEVEL_PLAYER_SCENE_NAME);
	}

	UploadLevel()
	{
		this.CloseMiniMenu();

		var levelName = prompt("Enter a name for the level:");
		while(levelName == "")
		{
			levelName = prompt("You must enter a name for the level:");
		}

		//User hit cancel, send them back to the editor
		if(levelName == null)
		{
			this.OpenEditor();
			return;
		}

		//console.log(levelName, PLAYER.playerName, PLAYER.playerId, -1, this.curLevel.boardDataString)
		fetch("create/customLevel", {
		    method: "POST",
		    headers: 
		    {
		        'Content-Type': "application/json"
		    },
		    body: JSON.stringify(
		    {
		    	'levelName': levelName,
		    	'creatorName': PLAYER.playerName,
		    	'creatorId': PLAYER.playerId,
		    	'levelString': this.curLevel.boardDataString
		    })
		}).then(response => 
		{
		    if(!response.ok)
		    {
		        throw ":)";
		    }

		    return response.json();
		}).then(json => 
		{
			window.alert("Successfully uploaded custom level!");
			this.scene.launch(MAIN_MENU_SCENE_NAME);
			this.scene.stop(LEVEL_PLAYER_SCENE_NAME);
		}).catch(error => 
	    {
	    	console.log(error);
	    	window.alert("Failed to upload level, going back to editor!");
	    	this.OpenEditor();
	    });
	}

	DrawPlayerGui()
	{
		//TODO: Draw current moves amount
		this.moveText = this.add.text(MOVE_TEXT_X, MOVE_TEXT_Y, "MOVES: 0", {fill:'#ffffff', fontSize:'24px', stroke:0x000000, strokeThickness:4});
	}

	DrawMenuButton()
	{
		const menuBtn = this.add.sprite(CANVAS_WIDTH, 0, MINI_MENU_BTN).setOrigin(1, 0);
		menuBtn.setInteractive();
		menuBtn.on("pointerdown", () => {menuBtn.clearTint(); this.OpenMiniMenu();});
		menuBtn.on("pointerover", () => menuBtn.setTint(0xcccccc));
		menuBtn.on("pointerout", () => menuBtn.clearTint());
	}

	DrawStable()
	{
		this.DrawPlayerGui();
		this.DrawMenuButton();
	}

	DrawVolatile()
	{
		this.curLevel.DrawVolatileBoard(this);
	}

	Draw()
	{
		this.DrawStable();
		this.curLevel.Draw(this);
	}

	Clear()
	{
		this.curLevel.Clear(this);
	}
}