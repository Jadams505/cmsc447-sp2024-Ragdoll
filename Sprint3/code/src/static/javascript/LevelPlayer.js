const MOVE_UP = 0;
const MOVE_LEFT = 1;
const MOVE_DOWN = 2;
const MOVE_RIGHT = 3;

class LevelPlayer extends Phaser.Scene
{
	inEditor = false;
	isPlaying = false;
	curLevel;
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
				this.TryMakeMove(MOVE_UP);
				break;
			case("A"):
			case("a"):
			case("ArrowLeft"):
				//Move Left
				this.TryMakeMove(MOVE_LEFT);
				break;
			case("S"):
			case("s"):
			case("ArrowDown"):
				//Move Down
				this.TryMakeMove(MOVE_DOWN);
				break;
			case("D"):
			case("d"):
			case("ArrowRight"):
				//Move Right
				this.TryMakeMove(MOVE_RIGHT);
				break;
			case("R"):
			case("r"):
				//Reset Level
				break;
		}
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

		this.Draw();
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

	DrawPlayerGui()
	{
		//TODO: Draw current moves amount
	}

	DrawMenuButton()
	{
		const menuBtn = this.add.sprite(CANVAS_WIDTH, 0, MINI_MENU_BTN).setOrigin(1, 0);
		menuBtn.setInteractive();
		menuBtn.on("pointerdown", () => menuBtn.setTint(0xcccccc));
		menuBtn.on("pointerup", () => menuBtn.clearTint());
		menuBtn.on("pointerout", () => menuBtn.clearTint());
	}

	DrawStable()
	{
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