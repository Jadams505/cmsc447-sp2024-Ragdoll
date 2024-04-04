const EMPTY_4X4_BOARD_DATA_STR = "4 4 00000000000000000000000000000000";

class LevelEditor
{
	inEditor = false; //If the editor is in use (so it doesn't eat inputs)
	//editorScene;
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
	}

	static DrawEditorGuiSprite(worldPosX, worldPosY, spriteID, levelZoom)
	{
		DrawGameSprite(editorGuiGroup, worldPosX, worldPosY, spriteID, levelZoom);
	}

	SubscribeToClickEvents()
	{
		globalScene.input.on("pointerdown", this.ProcessClick);
	}

	UnsubscribeFromClickEvents()
	{
		globalScene.input.off("pointerdown", this.ProcessClick);
	}

	ProcessClick(pointer)
	{

	}

	DrawEditor()
	{
		this.ClearEditor();
		LevelEditor.DrawEditorGuiSprite(16*1 + (4+(16*3))*(1-1), 8, FLOOR_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*2 + (4+(16*3))*(2-1), 8, WALL_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*3 + (4+(16*3))*(3-1), 8, BOX_DEFAULT_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*4 + (4+(16*3))*(4-1), 8, PLAYER_ID, 3);
		LevelEditor.DrawEditorGuiSprite(16*5 + (4+(16*3))*(5-1), 8, TARGET_ID, 3);
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