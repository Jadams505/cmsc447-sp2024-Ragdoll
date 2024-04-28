class PlayerData
{
	playerName = "DEFAULT";
	playerId = -1;
	mainLevelScores = [-1, -1, -1, -1, -1];
	mainLevelsCompleted = 0;

	constructor(playerName, playerId, levelScores)
	{
		this.playerName = playerName;
		this.playerId = playerId;
		this.mainLevelScores = levelScores;
		for(var i = 0; i < this.mainLevelScores.length; i++)
		{
			if(this.mainLevelScores[i] == -1)
			{
				break;
			}
			//else
			this.mainLevelsCompleted++;
		}
	}
}