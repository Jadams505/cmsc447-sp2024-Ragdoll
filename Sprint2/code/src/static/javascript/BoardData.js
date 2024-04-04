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

	static DrawBoardSprite(worldPosX, worldPosY, spriteID, levelZoom)
	{
		DrawGameSprite(gameBoardGroup, worldPosX, worldPosY, spriteID, levelZoom);
	}

	DrawBoardBorderWalls(levelZoom)
	{
	    //Draw Top and Bottom Borders
	    for(var i = 0; i < this.boardWidth + (BORDER_WALLS * 2); i++)
	    {
	        for(var j = 0; j < BORDER_WALLS; j++)
	        {
	            BoardData.DrawBoardSprite(i * SPRITE_RESOLUTION * levelZoom, (j * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID, levelZoom);
	            BoardData.DrawBoardSprite(i * SPRITE_RESOLUTION * levelZoom, ((((BORDER_WALLS * 2) + this.boardHeight - 1) * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER) - (j * SPRITE_RESOLUTION * levelZoom), WALL_ID, levelZoom);
	        }
	    }

	    //Draw Left and Right Borders
	    for(var j = BORDER_WALLS; j < this.boardHeight + BORDER_WALLS; j++)
	    {
	        for(var i = 0; i < BORDER_WALLS; i++)
	        {
	            BoardData.DrawBoardSprite(i * SPRITE_RESOLUTION * levelZoom, (j * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID, levelZoom);
	            BoardData.DrawBoardSprite((i + BORDER_WALLS + this.boardWidth) * SPRITE_RESOLUTION * levelZoom, (j * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID, levelZoom);
	        }
	    }
	}

	Draw(levelZoom)
	{
	    //Draw outer level bounds
	    this.DrawBoardBorderWalls(levelZoom);

	    //Draw board sprites
	    for(var i = 0; i < this.boardWidth; i++)
	    {
	        for(var j = 0; j < this.boardHeight; j++)
	        {
	            var tilePos = GridToWorldSpace(i, j, levelZoom);

	            //Always draw the floor, since some tiles are semi-transparent
	            BoardData.DrawBoardSprite(tilePos[0], tilePos[1], FLOOR_ID, levelZoom);

	            //Check if tile being drawn is a box. If so, we need to check for targets to properly light them
	            if(this.levelData[i][j] == BOX_DEFAULT_ID)
	            {
	                //Target data is truthy, so this works
	                if(this.targetData[i][j])
	                {
	                    BoardData.DrawBoardSprite(tilePos[0], tilePos[1], BOX_ACTIVE_ID, levelZoom);
	                }
	                else
	                {
	                    BoardData.DrawBoardSprite(tilePos[0], tilePos[1], BOX_INACTIVE_ID, levelZoom);
	                }
	            }
	            else
	            {
	                BoardData.DrawBoardSprite(tilePos[0], tilePos[1], this.levelData[i][j], levelZoom);
	            }

	            //Draw Targets
	            if(this.targetData[i][j])
	            {
	                BoardData.DrawBoardSprite(tilePos[0], tilePos[1], TARGET_ID, levelZoom);
	            }
	        }
	    }
	}

	Clear()
	{
	    gameBoardGroup.clear(true, true);
	}
}





