const DEFAULT_EMPTY_BOARD_DATA_STR = "9 5 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
const TILE_SELECTOR_LEFT_EDGE = 8;
const TILE_SELECTOR_RIGHT_EDGE = 344;
const WIDTH_GUI_X = 360;
const HEIGHT_GUI_X = 480;
const DIM_GUI_OFFSET = 30;
const DIM_BTN_OFFSET = 65;

class LevelEditor extends Phaser.Scene
{
	inEditor = true; //If the editor is in use (so it doesn't eat inputs)
	//editorScene;
	selectedTile = FLOOR_ID;
	curLevel;
	volatileEditorGuiGroup; //Subject to frequent refresh
	stableBoardGroup; //Refreshed on board size change
	volatileBoardGroup; //Subject to frequent refresh

	constructor()
	{
		super({ key: 'LevelEditor' });
	}

	init(data)
	{
		if(data.level == null)
		{
			this.curLevel = new Level(-1, "Default", DEFAULT_EMPTY_BOARD_DATA_STR);
		}
		else
		{
			this.curLevel = data.level;
		}
	}

	create()
	{
		this.volatileEditorGuiGroup = this.physics.add.staticGroup();
		this.stableBoardGroup = this.physics.add.staticGroup();
		this.volatileBoardGroup = this.physics.add.staticGroup();

		this.SubscribeToEvents();
		this.Draw();
	}

	DrawEditorGuiSprite(volatile, worldPosX, worldPosY, spriteID, levelZoom)
	{
		var group = (volatile) ? this.volatileEditorGuiGroup : null;
		DrawGameSprite(this, group, worldPosX, worldPosY, spriteID, levelZoom);
	}

	SubscribeToEvents()
	{
		this.input.on("pointerdown", this.ProcessClick, this);
		this.input.keyboard.on('keydown', this.HotkeyEvents, this);
	}

	UnsubscribeFromEvents()
	{
		this.input.off("pointerdown", this.ProcessClick);
		this.input.keyboard.off('keydown', this.HotkeyEvents);
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
			case("E"):
			case("e"):
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
			if(this.curLevel.boardData.targetData[tilePos[0]][tilePos[1]] == 1 || this.curLevel.boardData.levelData[tilePos[0]][tilePos[1]] == WALL_ID)
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
					
					//If we're placing a wall, make sure to remove any targets under the walls!
					if(this.selectedTile == WALL_ID)
					{
						this.curLevel.boardData.targetData[tilePos[0]][tilePos[1]] = 0;
					}
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

		var fullRedraw = false;

		if(pointer.downY < GUI_Y_BUFFER)
		{
			if(pointer.downX < TILE_SELECTOR_RIGHT_EDGE)
			{
				this.TryChooseSelectedTile(pointer);
			}
			else
			{
				this.TryUpdateBoardDimensions(pointer);
				fullRedraw = true;
			}
		}
		else
		{
			this.TryPlaceTile(pointer);
		}
		
		if(fullRedraw)
		{
			this.curLevel.DrawFullBoard(this);
		}

		this.DrawVolatile();
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
			//this.UpdateBoard();
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
			//this.UpdateBoard();
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
			//this.UpdateBoard();
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
			//this.UpdateBoard();
		}
	}

	OpenMainMenu()
	{
		this.scene.launch(MAIN_MENU_SCENE_NAME);
		this.scene.stop(LEVEL_EDITOR_SCENE_NAME);
	}

	//Volatile
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

		var selectedTileSprite = this.add.sprite((16*offset + (4+(16*3))*(offset-1)) + 24, 8 + 24, EDITOR_TILE_SELECTOR_NAME).setScale(4);
        this.volatileEditorGuiGroup.add(selectedTileSprite);
		//editorGuiGroup.create((16*offset + (4+(16*3))*(offset-1)) + 24, 8 + 24, EDITOR_TILE_SELECTOR_NAME).setScale(4);
	}

	//Volatile
	DrawVolatileWidthEditor()
	{
		var val = this.add.text(WIDTH_GUI_X + DIM_GUI_OFFSET, 20, this.curLevel.boardData.boardWidth, {fill:'#ffffff', fontSize:'24px', stroke:0x000000, strokeThickness:4});
		//this.volatileEditorGuiGroup.add(label);
		this.volatileEditorGuiGroup.add(val);

		
		//this.volatileEditorGuiGroup.add(widthUpBtn);
		
		//this.volatileEditorGuiGroup(widthDownBtn);
	}

	//Stable
	DrawStableWidthEditor()
	{
		var label = this.add.text(WIDTH_GUI_X, 20, "W:", {fill:'#ffffff', fontSize:'24px', stroke:0x000000, strokeThickness:4});

		const widthUpBtn = this.add.sprite(WIDTH_GUI_X + DIM_BTN_OFFSET, 0, UP_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		widthUpBtn.setInteractive();
		//widthUpBtn.on("pointerdown", this.IncreaseBoardWidth, this);
		widthUpBtn.on("pointerdown", () => widthUpBtn.setTint(0xcccccc));
		widthUpBtn.on("pointerup", () => widthUpBtn.clearTint());
		widthUpBtn.on("pointerout", () => widthUpBtn.clearTint());

		const widthDownBtn = this.add.sprite(WIDTH_GUI_X + DIM_BTN_OFFSET, (16 * 2), DOWN_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		widthDownBtn.setInteractive();
		//widthDownBtn.on("pointerdown", this.DecreaseBoardWidth, this);
		widthDownBtn.on("pointerdown", () => widthDownBtn.setTint(0xcccccc));
		widthDownBtn.on("pointerup", () => widthDownBtn.clearTint());
		widthDownBtn.on("pointerout", () => widthDownBtn.clearTint());
	}

	//Volatile
	DrawVolatileHeightEditor()
	{
		
		var val = this.add.text(HEIGHT_GUI_X + DIM_GUI_OFFSET, 20, this.curLevel.boardData.boardHeight, {fill:'#ffffff', fontSize:'24px', stroke:0x000000, strokeThickness:4});
		//this.volatileEditorGuiGroup.add(label);
		this.volatileEditorGuiGroup.add(val);

		//const heightUpBtn = this.volatileEditorGuiGroup.create(HEIGHT_GUI_X + DIM_BTN_OFFSET, 0, UP_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		//const heightDownBtn = this.volatileEditorGuiGroup.create(HEIGHT_GUI_X + DIM_BTN_OFFSET, (16 * 2), DOWN_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
	}

	//Stable
	DrawStableHeightEditor()
	{
		var label = this.add.text(HEIGHT_GUI_X, 20, "H:", {fill:'#ffffff', fontSize:'24px', stroke:0x000000, strokeThickness:4});

		const heightUpBtn = this.add.sprite(HEIGHT_GUI_X + DIM_BTN_OFFSET, 0, UP_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		heightUpBtn.setInteractive();
		//heightUpBtn.on("pointerdown", this.IncreaseBoardHeight, this);
		heightUpBtn.on("pointerdown", () => heightUpBtn.setTint(0xcccccc));
		heightUpBtn.on("pointerup", () => heightUpBtn.clearTint());
		heightUpBtn.on("pointerout", () => heightUpBtn.clearTint());

		const heightDownBtn = this.add.sprite(HEIGHT_GUI_X + DIM_BTN_OFFSET, (16 * 2), DOWN_ARROW_BUTTON_NAME).setScale(2).setOrigin(0, 0);
		heightDownBtn.setInteractive();
		//heightDownBtn.on("pointerdown", this.DecreaseBoardHeight, this);
		heightDownBtn.on("pointerdown", () => heightDownBtn.setTint(0xcccccc));
		heightDownBtn.on("pointerup", () => heightDownBtn.clearTint());
		heightDownBtn.on("pointerout", () => heightDownBtn.clearTint());
	}

	//Stable
	DrawStableDimensionEditors()
	{
		this.DrawStableWidthEditor();
		this.DrawStableHeightEditor();
	}

	//Volatile
	DrawVolatileDimensionEditors()
	{
		this.DrawVolatileWidthEditor();
		this.DrawVolatileHeightEditor();
	}

	//Stable
	DrawSelectableTiles()
	{
		this.DrawEditorGuiSprite(false, 16*1 + (4+(16*3))*(1-1), 8, FLOOR_ID, 3);
		this.DrawEditorGuiSprite(false, 16*2 + (4+(16*3))*(2-1), 8, WALL_ID, 3);
		this.DrawEditorGuiSprite(false, 16*3 + (4+(16*3))*(3-1), 8, BOX_DEFAULT_ID, 3);
		this.DrawEditorGuiSprite(false, 16*4 + (4+(16*3))*(4-1), 8, PLAYER_ID, 3);
		this.DrawEditorGuiSprite(false, 16*5 + (4+(16*3))*(5-1), 8, TARGET_ID, 3);
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
		this.DrawStableDimensionEditors();
		this.DrawSelectableTiles();
		this.DrawMenuButton();
	}

	DrawVolatile()
	{
		this.ClearEditor();
		this.ClearBoard();

		this.DrawVolatileDimensionEditors();
		this.DrawSelectedTile();
		this.curLevel.DrawVolatileBoard(this);
	}

	Draw()
	{
		this.DrawStable();
		this.DrawVolatile();
		this.curLevel.Draw(this);
	}

	ClearEditor()
	{
		this.volatileEditorGuiGroup.clear(true, true);
	}

	ClearBoard()
	{
		this.volatileBoardGroup.clear(true, true);
	}

	Clear()
	{
		this.ClearEditor();
		this.ClearBoard();
		this.curLevel.Clear(this);
	}
}