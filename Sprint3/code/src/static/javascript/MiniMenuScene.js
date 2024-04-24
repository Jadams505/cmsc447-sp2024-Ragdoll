const BUTTON_TEXT_STYLE = { font: '24px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const TITLE_TEXT_STYLE = { font: '48px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const DATA_TEXT_STYLE = { font: '36px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const TITLE_HEIGHT = 57; //Pixels
const DATA_HEIGHT = 48; //Pixels
const BUFFER_HEIGHT = 10; //Pixels
const BUTTON_HEIGHT = 39; //Pixels

class MiniMenuScene extends Phaser.Scene
{
	menuButtons;
	menuFuncs;
	menuTitle;
	dataTitle;

	contextScene;

	constructor(name)
	{
		super({ key: MINI_MENU_SCENE_NAME });
	}

	init(data)
	{
		this.contextScene = data.contextScene;
		this.menuButtons = data.menuButtons;
		this.menuFuncs = data.menuFuncs;
		this.menuTitle = data.menuTitle;
		this.dataTitle = data.dataTitle;
	}

	preload()
	{

	}

	create()
	{
		this.DrawFullMenu(this.menuTitle, this.menuButtons, this.menuFuncs, this.dataTitle);
	}

	DrawFullMenu(titleText, buttonTexts, buttonFuncs, dataText)
	{
		this.DrawFullBackground();

		var hasTitle = titleText != "" ? 1 : 0;
		var hasData = dataText != "" ? 1 : 0;
		this.DrawMenuBackground(BUFFER_HEIGHT * (hasTitle + hasData + buttonTexts.length + 1) + (hasTitle * TITLE_HEIGHT) + (hasData * DATA_HEIGHT) + (buttonTexts.length * BUTTON_HEIGHT));


		const boxTop = (CANVAS_HEIGHT - (BUFFER_HEIGHT * (hasTitle + hasData + buttonTexts.length + 1) + (hasTitle * TITLE_HEIGHT) + (hasData * DATA_HEIGHT) + (buttonTexts.length * BUTTON_HEIGHT))) / 2;
		var titleBuffer = 0;
		if(hasTitle)
		{
			this.DrawMenuTitle(boxTop + BUFFER_HEIGHT + (TITLE_HEIGHT / 2), titleText);
			titleBuffer = BUFFER_HEIGHT + TITLE_HEIGHT;
		}

		var dataBuffer = 0;
		if(hasData)
		{
			this.DrawDataTitle(boxTop + titleBuffer + BUFFER_HEIGHT + (DATA_HEIGHT / 2), dataText);
			dataBuffer = BUFFER_HEIGHT + DATA_HEIGHT;
		}

		for(var i = 0; i < buttonTexts.length; i++)
		{
			this.DrawMenuButton(boxTop + titleBuffer + dataBuffer + (BUFFER_HEIGHT * (i + 1)) + (BUTTON_HEIGHT * i) + (BUTTON_HEIGHT / 2), buttonTexts[i], buttonFuncs[i]);
		}
	}

	DrawFullBackground()
	{
		const bg = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x666666, 0.4).setOrigin(0, 0);
		bg.setInteractive();
	}

	DrawMenuBackground(height)
	{
		const bg = this.add.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 350, height, 0x222222, 0.8).setOrigin(0.5, 0.5);
	}

	DrawMenuTitle(y, text)
	{
		const title = this.add.text(this.cameras.main.width / 2, y, text, TITLE_TEXT_STYLE).setOrigin(0.5, 0.5);
	}

	DrawDataTitle(y, text)
	{
		const title = this.add.text(this.cameras.main.width / 2, y, text, DATA_TEXT_STYLE).setOrigin(0.5, 0.5);
	}

	DrawMenuButton(y, text, clickFunc)
	{
        const button = this.add.sprite(this.cameras.main.width / 2, y, MENU_BUTTON_IMG).setOrigin(0.5, 0.5);

        const buttonText = this.add.text(this.cameras.main.width / 2, y, text, BUTTON_TEXT_STYLE)
            .setOrigin(0.5);
            //.setInteractive()
            //.on('pointerdown', clickFunc, this) // Placeholder for  functionality
            //.on('pointerover', () => button.setStyle({ fill: '#ff0'}))
            //.on('pointerout', () => button.setStyle({ fill: '#fff'}));
        

        button.setInteractive();
        button.on('pointerdown', clickFunc, this.contextScene);
        button.on('pointerover', () => {button.setTint(0xdddddd)});
        button.on('pointerout', () => {button.clearTint()});
	}
}