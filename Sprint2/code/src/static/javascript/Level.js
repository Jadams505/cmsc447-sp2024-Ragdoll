class Level
{
	levelName;
	boardDataString;	
	boardData;
	moveCount;
	levelZoom;

	constructor(levelName, boardDataString)
	{
		this.levelName = levelName;
		this.boardDataString = boardDataString;	
		this.boardData = BoardData.DeserializeBoardData(this.boardDataString);
		this.moveCount = 0;
		this.levelZoom = CalculateBoardScale(this.boardData.boardWidth, this.boardData.boardHeight);
	}

	ResetLevel()
	{
		this.boardData = BoardData.DeserializeBoardData(this.boardDataString);
		this.moveCount = 0;
	}

	DrawBoard()
	{
		this.boardData.ClearBoard();
		this.boardData.DrawBoard(this.levelZoom)
	}
}
