class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: MAIN_MENU_SCENE_NAME });
    }

    preload()
    {

    }

    create()
    {
        musicManager.PlaySong(MAIN_MENU_MUSIC);
        this.Draw();
    }

    update()
    {

    }

    createButton(text, y, width, height, clickFunc) {
    
        const textStyle = { font: '24px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
        
        const button = this.add.sprite(this.cameras.main.width / 2, y, MENU_BUTTON_IMG).setOrigin(0.5, 0.5);

        const buttonText = this.add.text(this.cameras.main.width / 2, y, text, textStyle)
            .setOrigin(0.5);
            //.setInteractive()
            //.on('pointerdown', clickFunc, this) // Placeholder for  functionality
            //.on('pointerover', () => button.setStyle({ fill: '#ff0'}))
            //.on('pointerout', () => button.setStyle({ fill: '#fff'}));
        

        button.setInteractive();
        button.on('pointerdown', clickFunc, this);
        button.on('pointerover', () => {button.setTint(0xdddddd)});
        button.on('pointerout', () => {button.clearTint()});
   
        //button.setDepth(1);
        //buttonText.setDepth(2);
        //menuGroup.add(button);
    }

    DrawMainMenu()
    {
        // Adding the background image to fit the screen size
        const bgImg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'main_menu_background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        //menuGroup.add(bgImg);

        // Button titles and configurations
        const buttonTitles = ["Continue", "Main Levels", "Editor", "Custom Levels"];
        const buttonFuncs = [this.OpenPlayer, this.OpenMainLevels, this.OpenEditor, this.OpenCustomLevels];
        const buttonHeight = 60; // Height for each button
        const buttonPadding = 10; // Padding between buttons
        const totalHeight = (buttonTitles.length * buttonHeight) + ((buttonTitles.length - 1) * buttonPadding);
        //let startY = (this.cameras.main.height - totalHeight) / 2; // Starting Y position to center buttons vertically
        let startY = 290; //Sets menu under Title

        // Drawing a rectangle
        //const rect = this.add.rectangle(this.cameras.main.width / 2, startY + (totalHeight / 2), this.cameras.main.width * 0.8, totalHeight + 20, 0x666666, 0.2).setStrokeStyle(4, 0x00ff00); 

        // Creating each button within the rectangle
        for(var i = 0; i < buttonTitles.length; i++)
        {
            this.createButton(buttonTitles[i], startY + (i * (buttonHeight + buttonPadding)) + (buttonHeight / 2), this.cameras.main.width * 0.8, buttonHeight, buttonFuncs[i]);
        }
        /*
        buttonTitles.forEach((title, index) => {
            this.createButton(title, startY + (index * (buttonHeight + buttonPadding)) + (buttonHeight / 2), this.cameras.main.width * 0.8, buttonHeight);
        });
        */
        
        /*
        this.createButton("Play", startY + (0 * (buttonHeight + buttonPadding)) + (buttonHeight / 2), this.cameras.main.width * 0.8, buttonHeight, this.OpenPlayer);
        this.createButton("Editor", startY + (1 * (buttonHeight + buttonPadding)) + (buttonHeight / 2), this.cameras.main.width * 0.8, buttonHeight, this.OpenEditor);
        */

        //Start Main Music
        //TODO: stop sound another way
        //globalScene.sound.get("backgroundMusic").stop();
        //globalScene.sound.play('menuMusic');
        //musicManager.PlaySong(MAIN_MENU_MUSIC);
    }

    OpenPlayer()
    {
        
        //musicManager.PlaySong(GAME_MUSIC);

        const levelId = Math.min(PLAYER.mainLevelsCompleted, 4);
        var boardDataString = MAIN_LEVEL_STRINGS[levelId];
        var testLevel = new Level(levelId, MAIN_LEVEL_NAMES[levelId], boardDataString);

        //var testPlayer = new LevelPlayer(testLevel);
        //testPlayer.Draw();
        
        this.scene.launch(LEVEL_PLAYER_SCENE_NAME, {level:testLevel, inEditor:false, isMainLevel:true });
        this.scene.stop(MAIN_MENU_SCENE_NAME);
    }

    OpenEditor()
    {
        this.Clear();
        //musicManager.PlaySong(GAME_MUSIC);
        
        //var boardDataString = "11 9 002000000000000000303100003100000000012000000000000000000000003100000000000000310000000000000000000000000000000000000000000000101000000020202020202010000020202020200010000020202020202010000020202020";
        //var testLevel = new Level(3, "test", "");

        //var testEditor = new LevelEditor(testLevel);
        //testEditor.Draw();
        this.scene.launch(LEVEL_EDITOR_SCENE_NAME, {level:null});
        this.scene.stop(MAIN_MENU_SCENE_NAME);
    }

    OpenMainLevels()
    {
        this.scene.launch(MAIN_LEVELS_SCENE_NAME);
        this.scene.stop(MAIN_MENU_SCENE_NAME);
    }

    OpenCustomLevels()
    {
        this.scene.launch(CUSTOM_LVL_SCENE_NAME);
        this.scene.stop(MAIN_MENU_SCENE_NAME);
    }

    Draw()
    {
        //this.Clear();
        this.DrawMainMenu();
    }

    Clear()
    {
        //menuGroup.destroy(true, true);
        //menuGroup = globalScene.physics.add.staticGroup();
    }
}
