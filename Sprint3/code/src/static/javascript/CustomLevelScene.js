class CustomLevelScene extends Phaser.Scene
{
	TITLE_HEIGHT = 57; //Pixels
	SCORE_HEIGHT = 32; //Pixels
	BUFFER_HEIGHT = 10; //Pixels
	BUFFER_WIDTH = 10; //Pixels
	SEPARATOR_HEIGHT = 4; //Pixels

	BOX_HEIGHT = 400; //Pixels

	LVLS_PER_PAGE = 5;
	MIN_LVL_ID = 0;
	lowerLvlId = 0; //First ID grabbed
	curLevelList;

	idText; //Display for the ids of the currently displayed levels
	controller; //Cancels fill scene fetch request race condition

	constructor(name)
	{
		super({ key: CUSTOM_LVL_SCENE_NAME });
	}

	init()
	{

	}

	preload()
	{

	}

	create()
	{
		this.lowerLvlId = this.MIN_LVL_ID;
		this.controller = new AbortController();
		this.curLevelList = [];
		this.DrawFullMenu();
	}

	DrawFullMenu()
	{
		this.DrawMenuTitle();
		this.DrawMenuBackground();
		this.DrawBackButton();
		this.DrawNavButtons();
		this.DrawFillScene();

		this.idText = this.add.text(CANVAS_WIDTH / 2, 500, `LEVELS: ${this.lowerLvlId}-${this.lowerLvlId + this.LVLS_PER_PAGE - 1}`, BUTTON_TEXT_STYLE).setOrigin(0.5, 0);
	}

	DrawMenuTitle()
	{
		const text = this.add.text(CANVAS_WIDTH / 2, 75, "CUSTOM LEVELS", TITLE_TEXT_STYLE).setOrigin(0.5, 0.5);
	}

	DrawMenuBackground()
	{
		const bg = this.add.rectangle(CANVAS_WIDTH / 2, 100, CANVAS_WIDTH * 0.75, this.BOX_HEIGHT, 0xcccccc, 1.0).setOrigin(0.5, 0);
	}

	DrawNavButtons()
	{
		const rightArrow = this.add.sprite((CANVAS_WIDTH / 2) + (CANVAS_WIDTH * 0.75 / 2) + (CANVAS_WIDTH * 0.125 / 2), CANVAS_HEIGHT / 2, ARROW_BTN).setOrigin(0.5, 0.5);
		rightArrow.setInteractive();
		rightArrow.on('pointerdown', this.IncrementLvlView, this);
        rightArrow.on('pointerover', () => {rightArrow.setTint(0xdddddd)});
        rightArrow.on('pointerout', () => {rightArrow.clearTint()});

        const leftArrow = this.add.sprite((CANVAS_WIDTH / 2) - (CANVAS_WIDTH * 0.75 / 2) - (CANVAS_WIDTH * 0.125 / 2), CANVAS_HEIGHT / 2, ARROW_BTN).setOrigin(0.5, 0.5);
        leftArrow.flipX = true;
		leftArrow.setInteractive();
		leftArrow.on('pointerdown', this.DecrementLvlView, this);
        leftArrow.on('pointerover', () => {leftArrow.setTint(0xdddddd)});
        leftArrow.on('pointerout', () => {leftArrow.clearTint()});
	}

	IncrementLvlView()
	{
		this.lowerLvlId += this.LVLS_PER_PAGE;
		this.idText.setText(`LEVELS: ${this.lowerLvlId}-${this.lowerLvlId + this.LVLS_PER_PAGE - 1}`);

		this.DrawFillScene();
	}

	DecrementLvlView()
	{
		if(this.lowerLvlId == this.MIN_LVL_ID)
		{
			return;
		}

		this.lowerLvlId -= this.LVLS_PER_PAGE;
		this.idText.setText(`LEVELS: ${this.lowerLvlId}-${this.lowerLvlId + this.LVLS_PER_PAGE - 1}`);

		this.DrawFillScene();
	}

	DrawBackButton()
	{
        const button = this.add.sprite(CANVAS_WIDTH - this.BUFFER_WIDTH, this.BUFFER_HEIGHT, PLAY_BTN).setOrigin(1, 0).setScale(1);
        button.flipX = true;

        button.setInteractive();
        button.on('pointerdown', this.OpenMainMenu, this);
        button.on('pointerover', () => {button.setTint(0xdddddd)});
        button.on('pointerout', () => {button.clearTint()});
	}

	DrawFillScene()
	{
		this.ClearFillScene();

		fetch("read/customLevels", {
		    method: "POST",
		    signal: this.controller.signal,
		    headers: 
		    {
		        'Content-Type': "application/json"
		    },
		    body: JSON.stringify(
		    {
		    	'lowerId': this.lowerLvlId
		    })
		}).then(response => 
		{
		    if(!response.ok)
		    {
		        throw ":)";
		    }

		    return response.json();
		}).then(json => 
		{
			this.curLevelList = json.customLevelStrings;
			var levels = [];
			for(var l = 0; l < json.customLevelNames.length; l++)
			{
				levels.push({'levelName':json.customLevelNames[l], 'creatorName':json.customLevelCreators[l]});
			}
			//const levels = [{levelName:"Bingus 1", creatorName:"Jest"}, {levelName:"Bingus 2", creatorName:"Jest"}, {levelName:"Bingu", creatorName:"est"}, {levelName:"Bingu", creatorName:"est"}];
			this.scene.launch(CUSTOM_LVL_FILL_SCENE_NAME, {scene:this, playFunc:this.PlayLevel, leaderBoardFunc:this.OpenLeaderBoard, levels:levels});
		}).catch(error => 
	    {
	    	if(error.name == 'AbortError')
	    	{
	    		//Do nothing
	    	}
	    	else
	    	{
		    	console.log(error);
		    	window.alert("Failed to retrieve levels, going back to main menu!");
		    	this.OpenMainMenu();
	    	}
	    });
		
	}

	ClearFillScene()
	{
		this.scene.stop(CUSTOM_LVL_FILL_SCENE_NAME);
	}

	OpenMainMenu()
	{
		this.ClearFillScene();

		//Avoid race condition
		this.controller.abort();

		this.scene.launch(MAIN_MENU_SCENE_NAME);
		this.scene.stop(CUSTOM_LVL_SCENE_NAME);
	}

	PlayLevel(index)
	{
		var newLevel = new Level(9, "Custom Level", this.curLevelList[index]);
		this.ClearFillScene();
		this.scene.launch(LEVEL_PLAYER_SCENE_NAME, { level:newLevel, inEditor:false, isMainLevel:false });
		this.scene.stop(CUSTOM_LVL_SCENE_NAME);
	}

	OpenLeaderBoard(index)
	{
		console.log(`Leaderboard ${index}`);
	}
}