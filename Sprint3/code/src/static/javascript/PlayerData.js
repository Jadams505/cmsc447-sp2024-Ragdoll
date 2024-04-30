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

	UpdateDatabase()
	{
		fetch("update/updateUser", {
		    method: "POST",
		    headers: 
		    {
		        'Content-Type': "application/json"
		    },
		    body: JSON.stringify( 
		    {
		        'name': this.playerName,
		        'id': this.playerId,
		        'scores': this.mainLevelScores
		    })
		}).catch(error => 
	    {
	    	window.alert("Player data failed to save, please check your network connection!");
	    });
	}
}