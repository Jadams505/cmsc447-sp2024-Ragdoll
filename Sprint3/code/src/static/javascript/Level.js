class Level
{
	levelId;
	levelName;
	boardDataString;	
	boardData;
	moveCount;
	levelZoom;

	constructor(levelId, levelName, boardDataString)
	{
		this.levelId = levelId;
		this.levelName = levelName;
		this.boardDataString = boardDataString;	
		this.boardData = BoardData.DeserializeBoardData(this.boardDataString);
		this.moveCount = 0;
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
		this.moveCount = 0;
	}

	DrawGui()
	{
		//TODO: Draw move count, pause button, etc.
	}

	Draw()
	{
		this.boardData.Clear();
		this.boardData.Draw(this.levelZoom)
		this.DrawGui();
	}

	Clear()
	{
		this.boardData.Clear();
	}
}
