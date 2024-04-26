class LeaderBoardScene extends Phaser.Scene
{
	TITLE_HEIGHT = 57; //Pixels
	SCORE_HEIGHT = 32; //Pixels
	BUFFER_HEIGHT = 10; //Pixels
	BUFFER_WIDTH = 10; //Pixels
	SEPARATOR_HEIGHT = 4; //Pixels

	contextScene;

	backFunc;
	leaderBoardName; //String
	topScoreNames; //List<String>
	topScores; //List<Int>
	playerName; //String
	playerScore; //Int

	constructor(name)
	{
		super({ key: LEADERBOARD_SCENE_NAME });
	}

	init(data)
	{
		this.contextScene = data.contextScene;
		this.leaderBoardName = data.leaderBoardName;
		this.backFunc = data.backFunc;
		this.topScoreNames = data.topScoreNames;
		this.topScores = data.topScores;
		this.playerName = data.playerName;
		this.playerScore = data.playerScore;
	}

	preload()
	{

	}

	create()
	{
		this.DrawFullMenu(this.leaderBoardName, this.backFunc, this.topScoreNames, this.topScores, this.playerName, this.playerScore);
	}

	DrawFullMenu(leaderBoardName, backFunc, topScoreNames, topScores, playerName, playerScore)
	{
		this.DrawFullBackground();

		const boxHeight = (this.BUFFER_HEIGHT * (1 + 2 + 5 + 4)) + this.TITLE_HEIGHT + ((5 + 1) * this.SCORE_HEIGHT)
		//						Title + Scores + buffer + PlayerScore + 1
		this.DrawMenuBackground(boxHeight);


		const boxTop = (CANVAS_HEIGHT - boxHeight) / 2;
		this.DrawMenuTitle(boxTop + this.BUFFER_HEIGHT + (this.TITLE_HEIGHT / 2), leaderBoardName);
		const titleBuffer = this.BUFFER_HEIGHT + this.TITLE_HEIGHT + (this.BUFFER_HEIGHT * 2);

		//Guarantee this is drawn after the title to avoid being unable to click it w/ insanely long titles :P
		this.DrawBackButton(boxTop + this.BUFFER_HEIGHT + (this.TITLE_HEIGHT / 2), backFunc);

		for(var i = 0; i < Math.min(topScores.length, 5); i++)
		{
			//this.DrawMenuButton(boxTop + titleBuffer + dataBuffer + (BUFFER_HEIGHT * (i + 1)) + (BUTTON_HEIGHT * i) + (BUTTON_HEIGHT / 2), buttonTexts[i], buttonFuncs[i]);
			this.DrawTopScore(boxTop + titleBuffer + (this.BUFFER_HEIGHT * (i + 1)) + (this.SCORE_HEIGHT * i), (i + 1) + ".", topScoreNames[i], topScores[i]);
		}

		for(var i = topScores.length; i < 5; i++)
		{
			//Fill in missing scores
			this.DrawTopScore(boxTop + titleBuffer + (this.BUFFER_HEIGHT * (i + 1)) + (this.SCORE_HEIGHT * i), "-", "----", "--");
		}

		const scoresBuffer = (this.BUFFER_HEIGHT + this.SCORE_HEIGHT) * 5;

		this.DrawSeparator((this.BUFFER_HEIGHT / 2) + boxTop + titleBuffer + scoresBuffer);

		this.DrawPlayerScore((this.BUFFER_HEIGHT * 4) + boxTop + titleBuffer + scoresBuffer, playerName, (playerScore < 0) ? "--" : playerScore);
	}

	DrawFullBackground()
	{
		const bg = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x666666, 0.4).setOrigin(0, 0);
		bg.setInteractive();
	}

	DrawMenuBackground(height)
	{
		const bg = this.add.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2, height, 0xcccccc, 1.0).setOrigin(0.5, 0.5);
	}

	DrawMenuTitle(y, text)
	{
		const title = this.add.text(CANVAS_WIDTH / 2, y, text, TITLE_TEXT_STYLE).setOrigin(0.5, 0.5);
	}

	DrawTopScore(y, number, name, score)
	{
		const label = this.add.text((CANVAS_WIDTH / 4) + this.BUFFER_WIDTH, y, number + "\t" + name, SCORE_TEXT_STYLE).setOrigin(0, 0.5);
		const scoreText = this.add.text(((3 * CANVAS_WIDTH) / 4) - this.BUFFER_WIDTH, y, score, SCORE_NUMBER_TEXT_STYLE).setOrigin(1, 0.5);
	}

	DrawPlayerScore(y, name, score)
	{
		const label = this.add.text((CANVAS_WIDTH / 4) + this.BUFFER_WIDTH, y, name + ":", SCORE_TEXT_STYLE).setOrigin(0, 0.5);
		const scoreText = this.add.text(((3 * CANVAS_WIDTH) / 4) - this.BUFFER_WIDTH, y, score, SCORE_NUMBER_TEXT_STYLE).setOrigin(1, 0.5);
	}

	DrawSeparator(y)
	{
		const separator = this.add.rectangle(CANVAS_WIDTH / 2, y, ((4 * CANVAS_WIDTH) / 10), this.SEPARATOR_HEIGHT, 0x000000, 1.0).setOrigin(0.5, 0.5);
	}

	DrawBackButton(y, clickFunc)
	{
        const button = this.add.sprite(((3 * CANVAS_WIDTH) / 4) - this.BUFFER_WIDTH, y, PLAY_BTN).setOrigin(1, 0.5).setScale(0.75);
        button.flipX = true;

        button.setInteractive();
        button.on('pointerdown', clickFunc, this.contextScene);
        button.on('pointerover', () => {button.setTint(0xdddddd)});
        button.on('pointerout', () => {button.clearTint()});
	}
}