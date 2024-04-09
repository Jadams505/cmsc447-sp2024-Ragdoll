const EMPTY_4X4_BOARD_DATA_STR = "4 4 00000000000000000000000000000000";
const TILE_SELECTOR_LEFT_EDGE = 8;
const TILE_SELECTOR_RIGHT_EDGE = 344;
const WIDTH_GUI_X = 360;
const HEIGHT_GUI_X = 480;
const DIM_GUI_OFFSET = 30;
const DIM_BTN_OFFSET = 65;

class LevelEditor
{
	inEditor = false; //If the editor is in use (so it doesn't eat inputs)
	//editorScene;
	selectedTile = FLOOR_ID;
	curLevel;

	constructor(levelId, levelName, boardDataString)
	{
		//this.editorScene = new Phaser.Scene();

		if(boardDataString == null)
		{
			this.curLevel = new Level(-1, "Default", EMPTY_4X4_BOARD_DATA_STR);
		}
		else
		{
			this.curLevel = new Level(levelId, levelName, boardDataString);
		}

		this.SubscribeToClickEvents();
		this.inEditor = true;
	}

	static DrawEditorGuiSprite(worldPosX, worldPosY, spriteID, levelZoom)
	{
		DrawGameSprite(editorGuiGroup, worldPosX, worldPosY, spriteID, levelZoom);
	}

	SubscribeToClickEvents()
	{
		globalScene.input.on("pointerdown", this.ProcessClick, this);
		globalScene.input.keyboard.on('keydown', this.HotkeyEvents, this);
	}

	UnsubscribeFromClickEvents()
	{
		globalScene.input.off("pointerdown", this.ProcessClick);
		globalScene.input.keyboard.off('keydown', this.HotkeyEvents);
	}

	HotkeyEvents(event)
	{
		switch(event.key)
		{
			case("1"):
				this.selectedTile = FLOOR_ID;
				break;
			case("2"):
				this.selectedTile = WALL_ID;
				break;
			case("3"):
				this.selectedTile = BOX_DEFAULT_ID;
				break;
			case("4"):
				this.selectedTile = PLAYER_ID;
				break;
			case("5"):
				this.selectedTile = TARGET_ID;
				break;
			case("e"):
			case("E"):
				this.ExportLevelToClipboard();
				break;
		}

		this.Draw();
	}

	ExportLevelToClipboard()
	{
		//If we can't access the clipboard, we can't continue
		if(!navigator.clipboard)
		{
			return;
		}

		try
		{
			navigator.clipboard.writeText(BoardData.SerializeBoardData(this.curLevel.boardData));
			console.log("Copied level data to clipboard!");
		}
		catch(err)
		{
			console.log("Failed to copy to clipboard!", err);
		}
	}

	TryChooseSelectedTile(pointer)
	{
		if(pointer.downX < TILE_SELECTOR_LEFT_EDGE || pointer.downX >= TILE_SELECTOR_RIGHT_EDGE)
		{
			return;
		}

		if(pointer.downX <= 16*1 + (4+(16*3))*(1-1) + 24 + 32)
		{
			this.selectedTile = FLOOR_ID;
		}
		else if(pointer.downX <= 16*2 + (4+(16*3))*(2-1) + 24 + 32)
		{
			this.selectedTile = WALL_ID;
		}
		else if(pointer.downX <= 16*3 + (4+(16*3))*(3-1) + 24 + 32)
		{
			this.selectedTile = BOX_DEFAULT_ID;
		}
		else if(pointer.downX <= 16*4 + (4+(16*3))*(4-1) + 24 + 32)
		{
			this.selectedTile = PLAYER_ID;
		}
		else
		{
			this.selectedTile = TARGET_ID;
		}
	}

	TryUpdateBoardDimensions(pointer)
	{
		//We're guaranteed to be in the GUI buffer and to the right of the tile selection
		if(pointer.downX >= WIDTH_GUI_X + DIM_BTN_OFFSET && pointer.downX < WIDTH_GUI_X + DIM_BTN_OFFSET + 16*2)
		{
			//The up and down buttons take up the whole valid vertical slice, and are 16x16 images scaled to 2
			if(pointer.downY < 16*2)
			{
				this.IncreaseBoardWidth();
			}
			else
			{
				this.DecreaseBoardWidth();
			}
		}
		else if(pointer.downX >= HEIGHT_GUI_X + DIM_BTN_OFFSET && pointer.downX < HEIGHT_GUI_X + DIM_BTN_OFFSET + 16*2)
		{
			//The up and down buttons take up the whole valid vertical slice, and are 16x16 images scaled to 2
			if(pointer.downY < 16*2)
			{
				this.IncreaseBoardHeight();
			}
			else
			{
				this.DecreaseBoardHeight();
			}
		}
	}

	TryPlaceTile(pointer)
	{
		const tilePos = WorldToGridSpace(pointer.downX, pointer.downY, this.curLevel);
		//Check out of bounds
		if(tilePos[0] == -1 || tilePos[1] == -1)
		{
			return;
		}

		if(this.selectedTile == TARGET_ID)
		{
			if(this.curLevel.boardData.targetData[tilePos[0]][tilePos[1]] == 1)
			{
				this.curLevel.boardData.targetData[tilePos[0]][tilePos[1]] = 0;
			}
			else
			{
				this.curLevel.boardData.targetData[tilePos[0]][tilePos[1]] = 1;
			}
		}
		else
		{
			if(this.selectedTile != FLOOR_ID)
			{
				if(this.selectedTile == this.curLevel.boardData.levelData[tilePos[0]][tilePos[1]])
				{
					this.curLevel.boardData.levelData[tilePos[0]][tilePos[1]] = FLOOR_ID;
				}
				else
				{
					this.curLevel.boardData.levelData[tilePos[0]][tilePos[1]] = this.selectedTile;
				}
			}
			else
			{
				this.curLevel.boardData.levelData[tilePos[0]][tilePos[1]] = this.selectedTile;
			}
		}
	}

	ProcessClick(pointer, currentlyOver)
	{
		if(!this.inEditor)
		{
			console.log(`Not in editor [${this.inEditor}]`);
			return;
		}

		//Ignore non left clicks
		if(pointer.buttons != 1)
		{
			return;
		}

		if(pointer.downY < GUI_Y_BUFFER)
		{
			if(pointer.downX < TILE_SELECTOR_RIGHT_EDGE)
			{
				this.TryChooseSelectedTile(pointer);
			}
			else
			{
				this.TryUpdateBoardDimensions(pointer);
			}
		}
		else
		{
			this.TryPlaceTile(pointer);
		}
		

		this.Draw();
	}

	IncreaseBoardWidth()
	{
		if(this.curLevel.boardData.boardWidth < MAX_X_TILES)
		{
			this.curLevel.boardData.boardWidth += 1;

			this.curLevel.boardData.levelData.push([]);
			this.curLevel.boardData.targetData.push([]);
			for(var i = 0; i < this.curLevel.boardData.boardHeight; i++)
			{
				this.curLevel.boardData.levelData[this.curLevel.boardData.boardWidth - 1].push(FLOOR_ID);
				this.curLevel.boardData.targetData[this.curLevel.boardData.boardWidth - 1].push(0);
			}

			this.curLevel.CalculateLevelZoom();
		}
	}

	DecreaseBoardWidth()
	{
		if(this.curLevel.boardData.boardWidth > MIN_X_TILES)
		{
			this.curLevel.boardData.boardWidth -= 1;

			this.curLevel.boardData.levelData.pop();
			this.curLevel.boardData.targetData.pop();

			this.curLevel.CalculateLevelZoom();
		}
	}

	IncreaseBoardHeight()
	{
		if(this.curLevel.boardData.boardHeight < MAX_Y_TILES)
		{
			this.curLevel.boardData.boardHeight += 1;

			for(var i = 0; i < this.curLevel.boardData.boardWidth; i++)
			{
				this.curLevel.boardData.levelData[i].push(FLOOR_ID);
				this.curLevel.boardData.targetData[i].push(0);
			}

			this.curLevel.CalculateLevelZoom();
		}
	}

	DecreaseBoardHeight()
	{
		if(this.curLevel.boardData.boardHeight > MIN_Y_TILES)
		{
			this.curLevel.boardData.boardHeight -= 1;

			for(var i = 0; i < this.curLevel.boardData.boardWidth; i++)
			{
				this.curLevel.boardData.levelData[i].pop();
				this.curLevel.boardData.targetData[i].pop();
			}

			this.curLevel.CalculateLevelZoom();
		}
	}

	DrawSelectedTile()
	{
		var offset = 0;
		var worldPosX = 0;
		const worldPosY = 0;
		switch(this.selectedTile)
		{
			case(FLOOR_ID):
				offset = 1;
				break;
			case(WALL_ID):
				offset = 2;
				break;
			case(BOX_DEFAULT_ID):
				offset = 3;
				break;
			case(PLAYER_ID):
				offset = 4;
				break;
			case(TARGET_ID):
				offset = 5;
				break;
		}


		editorGuiGroup.create((16*offset + (4+(16*3))*(offset-1)) + 24, 8 + 24, EDITOR_TILE_SELECTOR_NAME).setScale(4);
	}

	DrawWidthEditor()
	{
		var label = globalScene.add.text(WIDTH_GUI_X, 20, "W:", {'fill':'#ffffff', 'fontSize':'24px'});
		var val = globalScene.add.text(WIDTH_GUI_X + DIM_GUI_OFFSET, 20, this.curLevel.boardData.boardWidth, {'fill':'#ffffff', 'fontSize':'24px'});
		editorGuiGroup.add(label);
		editorGuiGroup.add(val);

		const widthUpBtn = editorGuiGroup.create(WIDTH_GUI_X + DIM_BTN_OFFSET, 0, UP_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		const widthDownBtn = editorGuiGroup.create(WIDTH_GUI_X + DIM_BTN_OFFSET, (16 * 2), DOWN_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
	}

	DrawHeightEditor()
	{
		var label = globalScene.add.text(HEIGHT_GUI_X, 20, "H:", {'fill':'#ffffff', 'fontSize':'24px'});
		var val = globalScene.add.text(HEIGHT_GUI_X + DIM_GUI_OFFSET, 20, this.curLevel.boardData.boardHeight, {'fill':'#ffffff', 'fontSize':'24px'});
		editorGuiGroup.add(label);
		editorGuiGroup.add(val);

		const heightUpBtn = editorGuiGroup.create(HEIGHT_GUI_X + DIM_BTN_OFFSET, 0, UP_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		const heightDownBtn = editorGuiGroup.create(HEIGHT_GUI_X + DIM_BTN_OFFSET, (16 * 2), DOWN_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
	}

	DrawDimensionEditors()
	{
		this.DrawWidthEditor();
		this.DrawHeightEditor();
	}

	DrawEditor()
	{
		this.ClearEditor();
		LevelEditor.DrawEditorGuiSprite(16*1 + (4+(16*3))*(1-1), 8, FLOOR_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*2 + (4+(16*3))*(2-1), 8, WALL_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*3 + (4+(16*3))*(3-1), 8, BOX_DEFAULT_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*4 + (4+(16*3))*(4-1), 8, PLAYER_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*5 + (4+(16*3))*(5-1), 8, TARGET_ID, 3);

		this.DrawSelectedTile();
		this.DrawDimensionEditors();
	}

	Draw()
	{
		this.DrawEditor();
		this.curLevel.Draw();
	}

	ClearEditor()
	{
		editorGuiGroup.clear(true, true);
	}

	Clear()
	{
		this.ClearEditor();
		this.curLevel.Clear();
	}
}