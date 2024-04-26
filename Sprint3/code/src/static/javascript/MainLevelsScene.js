class MainLevelsScene extends Phaser.Scene
{
	LEVEL_VERTICAL_SEPARATOR = 16;
	LEVEL_HORIZONTAL_SEPARATOR = 16;
	ALL_LEVELS_WIDTH = (5 * 64) + (4 * this.LEVEL_HORIZONTAL_SEPARATOR);

	constructor(name)
	{
		super({ key: MAIN_LEVELS_SCENE_NAME });
	}

	init()
	{

	}

	preload()
	{

	}

	create()
	{
		this.selectedLevel = 0;
		this.DrawFullMenu();
	}

	DrawFullMenu()
	{
		this.DrawMenuTitle();
		this.DrawLevelButtons();

		this.DrawBackButton();
		this.DrawBonusButtons();
	}

	DrawMenuTitle()
	{
		const text = this.add.text(CANVAS_WIDTH / 2, 75, "MAIN LEVELS", TITLE_TEXT_STYLE).setOrigin(0.5, 0.5);
	}

	DrawLevelButtons()
	{
		const leftEdge = (CANVAS_WIDTH - this.ALL_LEVELS_WIDTH) / 2;

		for(var i = 0; i <= Math.min(PLAYER.mainLevelsCompleted, 5 - 1); i++)
		{
			//Draw unlocked levels
			const lvlBtn = this.add.sprite(leftEdge + ((i) * 64) + (((i) * this.LEVEL_HORIZONTAL_SEPARATOR)), (CANVAS_HEIGHT / 2) - this.LEVEL_VERTICAL_SEPARATOR, MAIN_LEVEL_BTN).setOrigin(0, 1);

			lvlBtn.level = i;
			lvlBtn.setInteractive();
			lvlBtn.on('pointerdown', () => {this.OpenMainLevel(lvlBtn.level)}, this);
	        lvlBtn.on('pointerover', () => {lvlBtn.setTint(0xdddddd)});
	        lvlBtn.on('pointerout', () => {lvlBtn.clearTint()});

	        this.add.text(leftEdge + ((i) * 64) + (((i) * this.LEVEL_HORIZONTAL_SEPARATOR)) + 32, (CANVAS_HEIGHT / 2) - this.LEVEL_VERTICAL_SEPARATOR - 32, `${i+1}`, BUTTON_TEXT_STYLE).setOrigin(0.5, 0.5);
		}

		for(var i = PLAYER.mainLevelsCompleted + 1; i < 5; i++)
		{
			//Draw locked levels
			const lvlBtn = this.add.sprite(leftEdge + ((i) * 64) + (((i) * this.LEVEL_HORIZONTAL_SEPARATOR)), (CANVAS_HEIGHT / 2) - this.LEVEL_VERTICAL_SEPARATOR, LOCK_BTN).setOrigin(0, 1);
			
			lvlBtn.setInteractive();
			//lvlBtn.on('pointerdown', () => {this.selectedLevel = i; this.OpenMainMenu()}, this);
	        //lvlBtn.on('pointerover', () => {lvlBtn.setTint(0xdddddd)});
	        //lvlBtn.on('pointerout', () => {lvlBtn.clearTint()});
		}

		for(var i = 1; i <= Math.min(PLAYER.mainLevelsCompleted, 5); i++)
		{
			//Draw unlocked leaderboards
			const leaderBoardBtn = this.add.sprite(leftEdge + ((i - 1) * 64) + (((i - 1) * this.LEVEL_HORIZONTAL_SEPARATOR)), (CANVAS_HEIGHT / 2) + this.LEVEL_VERTICAL_SEPARATOR, LEADERBOARD_BTN).setOrigin(0, 0);
			
			leaderBoardBtn.level = i - 1;
			leaderBoardBtn.setInteractive();
			leaderBoardBtn.on('pointerdown', () => {this.OpenMainLeaderBoard(leaderBoardBtn.level)}, this);
	        leaderBoardBtn.on('pointerover', () => {leaderBoardBtn.setTint(0xdddddd)});
	        leaderBoardBtn.on('pointerout', () => {leaderBoardBtn.clearTint()});
		}
	}

	OpenMainLevel(selectedLevel)
	{
		var mainLevel = new Level(selectedLevel, MAIN_LEVEL_NAMES[selectedLevel], MAIN_LEVEL_STRINGS[selectedLevel]);
		this.scene.launch(LEVEL_PLAYER_SCENE_NAME, { level:mainLevel, inEditor:false, isMainLevel:true });
		this.scene.stop(MAIN_LEVELS_SCENE_NAME);
	}

	OpenMainLeaderBoard(selectedLevel)
	{
		//TODO: Open leaderboard
		//this.selectedLevel
	}

	DrawBackButton()
	{
		const button = this.add.sprite(CANVAS_WIDTH, 0, PLAY_BTN).setOrigin(1, 0).setScale(1);
        button.flipX = true;

        button.setInteractive();
        button.on('pointerdown', this.OpenMainMenu, this);
        button.on('pointerover', () => {button.setTint(0xdddddd)});
        button.on('pointerout', () => {button.clearTint()});
	}

	OpenMainMenu()
	{
		this.scene.launch(MAIN_MENU_SCENE_NAME);
		this.scene.stop(MAIN_LEVELS_SCENE_NAME);
	}

	DrawBonusButtons()
	{
		const globalLeaderBoardButton = this.add.sprite(0, CANVAS_HEIGHT, LEADERBOARD_BTN).setOrigin(0, 1).setScale(1);

        globalLeaderBoardButton.setInteractive();
        globalLeaderBoardButton.on('pointerdown', this.OpenGlobalLeaderBoard, this);
        globalLeaderBoardButton.on('pointerover', () => {globalLeaderBoardButton.setTint(0xdddddd)});
        globalLeaderBoardButton.on('pointerout', () => {globalLeaderBoardButton.clearTint()});

        const uploadUriButton = this.add.sprite(64, CANVAS_HEIGHT, UPLOAD_BTN).setOrigin(0, 1).setScale(1);

        uploadUriButton.setInteractive();
        uploadUriButton.on('pointerdown', this.UploadToUri, this);
        uploadUriButton.on('pointerover', () => {uploadUriButton.setTint(0xdddddd)});
        uploadUriButton.on('pointerout', () => {uploadUriButton.clearTint()});
	}

	OpenGlobalLeaderBoard()
	{
		//TODO: get and fill data

		this.scene.launch(LEADERBOARD_SCENE_NAME, { contextScene: this, leaderBoardName: "Test", backFunc: this.CloseLeaderBoard, topScoreNames: ["Never", "Gonna", "Give", "You"], topScores: [2, 5, 7, 10], playerName: "Up", playerScore: 35 });
	}

	CloseLeaderBoard()
	{
		this.scene.stop(LEADERBOARD_SCENE_NAME);
	}

	UploadToUri()
	{
		window.alert("Leaderboard data successfully uploaded to URI");
	}
}