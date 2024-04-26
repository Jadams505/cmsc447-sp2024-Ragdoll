class CustomLevelFillScene extends Phaser.Scene
{
	TITLE_HEIGHT = 57; //Pixels
	BUFFER_HEIGHT = 10; //Pixels
	BUFFER_WIDTH = 10; //Pixels
	SEPARATOR_HEIGHT = 4; //Pixels

	MENU_TOP = 100;
	BOX_HEIGHT = 400 / 5; //Pixels
	LEVEL_BOX_COLORS = [0xdddddd, 0xeeeeee];

	contextScene;
	levels;

	constructor(name)
	{
		super({ key: CUSTOM_LVL_FILL_SCENE_NAME });
	}

	init(data)
	{
		this.contextScene = data.scene;
		this.playFunc = data.playFunc;
		this.leaderBoardFunc = data.leaderBoardFunc;
		this.levels = data.levels;
	}

	preload()
	{

	}

	create()
	{
		this.DrawLevels();
	}

	DrawLevels()
	{
		for(var i = 0; i < Math.min(this.levels.length, 5); i++)
		{
			this.DrawLevelBox(i, this.MENU_TOP + (i * this.BOX_HEIGHT), this.LEVEL_BOX_COLORS[i % 2], this.levels[i]);
		}
	}

	DrawLevelBox(i, y, color, levelData)
	{
		const bg = this.add.rectangle(CANVAS_WIDTH * 0.125, y, CANVAS_WIDTH * 0.75, this.BOX_HEIGHT, color).setOrigin(0, 0);
		const lvlTitle = this.add.text(CANVAS_WIDTH * 0.125, y, levelData.levelName, LVL_TITLE_TEXT_STYLE).setOrigin(0, 0);
		const lvlCreator = this.add.text(CANVAS_WIDTH * 0.125, y + this.BOX_HEIGHT, levelData.creatorName, LVL_CREATOR_TEXT_STYLE).setOrigin(0, 1);

		const playButton = this.add.sprite(CANVAS_WIDTH * 0.875, y + (this.BOX_HEIGHT / 2), PLAY_BTN).setOrigin(1, 0.5);
		playButton.level = i;
		playButton.setInteractive();
        playButton.on('pointerdown', () => {this.contextScene.PlayLevel(playButton.level);}, this.contextScene);
        playButton.on('pointerover', () => {playButton.setTint(0xdddddd)});
        playButton.on('pointerout', () => {playButton.clearTint()});


		const leaderBoardButton = this.add.sprite(CANVAS_WIDTH * 0.875 - 64 - 8, y + (this.BOX_HEIGHT / 2), LEADERBOARD_BTN).setOrigin(1, 0.5);
		leaderBoardButton.level = i;
		leaderBoardButton.setInteractive();
        leaderBoardButton.on('pointerdown', () => {this.contextScene.OpenLeaderBoard(playButton.level);}, this.contextScene);
        leaderBoardButton.on('pointerover', () => {leaderBoardButton.setTint(0xdddddd)});
        leaderBoardButton.on('pointerout', () => {leaderBoardButton.clearTint()});
	}
}