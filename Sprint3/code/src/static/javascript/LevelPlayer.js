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
	moveText;
	volatileGuiGroup; //Refreshed on move
	stableBoardGroup; //Refreshed on board size change
	volatileBoardGroup; //Subject to frequent refresh

	constructor()
	{
		super({ key: 'LevelPlayer' });
	}

	init(data)
	{
		this.curLevel = data.level;

		this.SubscribeToEvents();

		this.isPlaying = true;
	}

	create()
	{
		this.volatileGuiGroup = this.physics.add.staticGroup();
		this.stableBoardGroup = this.physics.add.staticGroup();
		this.volatileBoardGroup = this.physics.add.staticGroup();

		this.ResetLevel();
		this.Draw();
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
			case("ArrowUp"):
				//Move Up
				if(this.TryMakeMove(MOVE_UP))
				{
					this.moveCount++;
				}
				break;
			case("A"):
			case("a"):
			case("ArrowLeft"):
				//Move Left
				if(this.TryMakeMove(MOVE_LEFT))
				{
					this.moveCount++;
				}
				break;
			case("S"):
			case("s"):
			case("ArrowDown"):
				//Move Down
				if(this.TryMakeMove(MOVE_DOWN))
				{
					this.moveCount++;
				}
				break;
			case("D"):
			case("d"):
			case("ArrowRight"):
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

	ResetLevel()
	{
		this.curLevel.ResetLevel();
		this.moveCount = 0;
		this.DrawVolatile();
	}

	CheckVictory()
	{
		if(this.curLevel.CheckVictory())
		{
			//TODO: Bring up menu
			//For Now: Return to main menu
			this.OpenMainMenu();
		}

		//Else do nothing
	}

	OpenMainMenu()
	{
		this.scene.launch(MAIN_MENU_SCENE_NAME);
		this.scene.stop(LEVEL_PLAYER_SCENE_NAME);
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
		menuBtn.on("pointerdown", () => {menuBtn.setTint(0xcccccc); this.OpenMainMenu()});
		menuBtn.on("pointerup", () => menuBtn.clearTint());
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