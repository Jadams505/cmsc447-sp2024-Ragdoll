class BoardData
{
	boardWidth; 	//X dimension
	boardHeight;	//Y dimension
	levelData;		//Player, Wall, and Box positions
	targetData;		//Target positions

	constructor(boardWidth, boardHeight, levelData, targetData)
	{
		this.boardWidth = boardWidth; 	//X dimension
		this.boardHeight = boardHeight;	//Y dimension
		this.levelData = levelData;		//Player, Wall, and Box positions
		this.targetData = targetData;	//Target positions
	}

	//Precondition: level is a valid BoardData object
	//boardData is a BoardData object
	//Returns a string
	static SerializeBoardData(boardData)
	{
	    var boardDataString = "";
	    boardDataString += boardData.boardWidth + " " + boardData.boardHeight + " ";
	    for(var i = 0; i < boardData.boardWidth; i++)
	    {
	        for(var j = 0; j < boardData.boardHeight; j++)
	        {
	            boardDataString += boardData.levelData[i][j];
	            boardDataString += boardData.targetData[i][j];
	        }
	    }

	    return boardDataString;
	}

	//Precondition: boardDataString is a valid board data string
	//boardDataString is a string
	//Returns a BoardData object
	static DeserializeBoardData(boardDataString)
	{
		var splitString = boardDataString.split(' ');
		var boardWidth = parseInt(splitString[0]);
		var boardHeight = parseInt(splitString[1]);
		var levelData = [];
		var targetData = [];

		var stringPos = 0;
		for(var i = 0; i < boardWidth; i++)
		{
			levelData.push([]);
			targetData.push([]);
			for(var j = 0; j < boardHeight; j++)
			{
				levelData[i].push(parseInt(splitString[2][stringPos], 16));
				targetData[i].push(parseInt(splitString[2][stringPos + 1]));

				stringPos += 2;
			}
		}

		return new BoardData(boardWidth, boardHeight, levelData, targetData);
	}

	DeepCopyLevelData()
	{
		var newLevelData = [];
		for(var i = 0; i < this.boardWidth; i++)
		{
			newLevelData.push([]);
			for(var j = 0; j < this.boardHeight; j++)
			{
				newLevelData[i].push(this.levelData[i][j]);
			}
		}

		return newLevelData;
	}

	CheckVictory()
	{
		for(var i = 0; i < this.boardWidth; i++)
		{
			for(var j = 0; j < this.boardHeight; j++)
			{
				if(this.targetData[i][j])
				{
					if(this.levelData[i][j] != WALL_ID && this.levelData[i][j] != BOX_DEFAULT_ID)
					{
						return false;
					}
				}
			}
		}

		return true;
	}

	static DrawBoardSprite(scene, group, worldPosX, worldPosY, spriteID, levelZoom)
	{
		DrawGameSprite(scene, group, worldPosX, worldPosY, spriteID, levelZoom);
	}

	DrawBoardBorderWalls(scene, levelZoom)
	{
	    //Draw Top and Bottom Borders
	    for(var i = 0; i < this.boardWidth + (BORDER_WALLS * 2); i++)
	    {
	        for(var j = 0; j < BORDER_WALLS; j++)
	        {
	            BoardData.DrawBoardSprite(scene, scene.stableBoardGroup, i * SPRITE_RESOLUTION * levelZoom, (j * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID, levelZoom);
	            BoardData.DrawBoardSprite(scene, scene.stableBoardGroup, i * SPRITE_RESOLUTION * levelZoom, ((((BORDER_WALLS * 2) + this.boardHeight - 1) * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER) - (j * SPRITE_RESOLUTION * levelZoom), WALL_ID, levelZoom);
	        }
	    }

	    //Draw Left and Right Borders
	    for(var j = BORDER_WALLS; j < this.boardHeight + BORDER_WALLS; j++)
	    {
	        for(var i = 0; i < BORDER_WALLS; i++)
	        {
	            BoardData.DrawBoardSprite(scene, scene.stableBoardGroup, i * SPRITE_RESOLUTION * levelZoom, (j * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID, levelZoom);
	            BoardData.DrawBoardSprite(scene, scene.stableBoardGroup, (i + BORDER_WALLS + this.boardWidth) * SPRITE_RESOLUTION * levelZoom, (j * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID, levelZoom);
	        }
	    }
	}

	DrawBaseBoard(scene, levelZoom)
	{
		this.DrawBoardBorderWalls(scene, levelZoom);

		//Draw floor sprites
	    for(var i = 0; i < this.boardWidth; i++)
	    {
	        for(var j = 0; j < this.boardHeight; j++)
	        {
	        	var tilePos = GridToWorldSpace(i, j, levelZoom);

	            //Always draw the floor, since some tiles are semi-transparent
	            BoardData.DrawBoardSprite(scene, scene.stableBoardGroup, tilePos[0], tilePos[1], FLOOR_ID, levelZoom);
	        }
	    }
	}

	DrawLevelData(scene, levelZoom)
	{
		//Draw board sprites
	    for(var i = 0; i < this.boardWidth; i++)
	    {
	        for(var j = 0; j < this.boardHeight; j++)
	        {
	            var tilePos = GridToWorldSpace(i, j, levelZoom);

	            //Always draw the floor, since some tiles are semi-transparent
	            //BoardData.DrawBoardSprite(tilePos[0], tilePos[1], FLOOR_ID, levelZoom);

	            //Draw Targets
	            if(this.targetData[i][j])
	            {
	                BoardData.DrawBoardSprite(scene, scene.volatileBoardGroup, tilePos[0], tilePos[1], TARGET_ID, levelZoom);
	            }

	            //Check if tile being drawn is a box. If so, we need to check for targets to properly light them
	            if(this.levelData[i][j] == BOX_DEFAULT_ID)
	            {
	                //Target data is truthy, so this works
	                if(this.targetData[i][j])
	                {
	                    BoardData.DrawBoardSprite(scene, scene.volatileBoardGroup, tilePos[0], tilePos[1], BOX_ACTIVE_ID, levelZoom);
	                }
	                else
	                {
	                    BoardData.DrawBoardSprite(scene, scene.volatileBoardGroup, tilePos[0], tilePos[1], BOX_INACTIVE_ID, levelZoom);
	                }
	            }
	            else
	            {
	            	if(this.levelData[i][j] != FLOOR_ID)
	            	{
	                	BoardData.DrawBoardSprite(scene, scene.volatileBoardGroup, tilePos[0], tilePos[1], this.levelData[i][j], levelZoom);
	            	}
	            }
	        }
	    }
	}

	Draw(scene, levelZoom)
	{
		this.Clear(scene);

	    //Draw outer level bounds
	    this.DrawBaseBoard(scene, levelZoom);
	    this.DrawLevelData(scene, levelZoom)
	}

	ClearLevelData(scene)
	{
		scene.volatileBoardGroup.clear(true, true);
	}

	Clear(scene)
	{
	    scene.stableBoardGroup.clear(true, true);
	    scene.volatileBoardGroup.clear(true, true);
	}
}





