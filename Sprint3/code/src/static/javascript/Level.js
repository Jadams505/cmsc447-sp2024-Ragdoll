class Level
{
	levelId;
	levelName;
	boardDataString;	
	boardData;
	levelZoom;

	constructor(levelId, levelName, boardDataString)
	{
		this.levelId = levelId;
		this.levelName = levelName;
		this.boardDataString = boardDataString;	
		this.boardData = BoardData.DeserializeBoardData(this.boardDataString);
		this.levelZoom = this.CalculateLevelZoom();
	}

	CalculateLevelZoom()
	{
		this.levelZoom = CalculateBoardScale(this.boardData);
		return this.levelZoom;
	}

	ResetLevel()
	{
		this.boardData = BoardData.DeserializeBoardData(this.boardDataString);
	}

	CheckVictory()
	{
		return this.boardData.CheckVictory();
	}

	Draw(scene)
	{
		this.DrawFullBoard(scene);
	}

	DrawFullBoard(scene)
	{
		this.boardData.Clear(scene);
		this.boardData.Draw(scene, this.levelZoom)
	}

	DrawVolatileBoard(scene)
	{
		this.boardData.ClearLevelData(scene);
		this.boardData.DrawLevelData(scene, this.levelZoom)
	}

	Clear()
	{
		this.boardData.Clear();
	}
}
