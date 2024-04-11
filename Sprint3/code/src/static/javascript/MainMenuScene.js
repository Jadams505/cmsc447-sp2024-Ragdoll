class MainMenuScene {
    constructor() {
        
    }

    createButton(text, y, width, height, clickFunc) {
    
        const textStyle = { font: '24px Arial', fill: '#fff' };
        
        const button = globalScene.add.text(globalScene.cameras.main.width / 2, y, text, textStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', clickFunc, this) // Placeholder for  functionality
            .on('pointerover', () => button.setStyle({ fill: '#ff0'}))
            .on('pointerout', () => button.setStyle({ fill: '#fff'}));
        
   
        button.setDepth(1);
        menuGroup.add(button);
    }

    DrawMainMenu()
    {
        // Adding the background image to fit the screen size
        const bgImg = globalScene.add.image(globalScene.cameras.main.width / 2, globalScene.cameras.main.height / 2, 'main_menu_background').setDisplaySize(globalScene.cameras.main.width, globalScene.cameras.main.height);
        menuGroup.add(bgImg);

        // Button titles and configurations
        const buttonTitles = ["Play", "Editor"];
        const buttonHeight = 60; // Height for each button
        const buttonPadding = 10; // Padding between buttons
        const totalHeight = (buttonTitles.length * buttonHeight) + ((buttonTitles.length - 1) * buttonPadding);
        let startY = (globalScene.cameras.main.height - totalHeight) / 2; // Starting Y position to center buttons vertically

        // Drawing a rectangle
        console.log(globalScene.add)
        const rect = globalScene.add.rectangle(globalScene.cameras.main.width / 2, startY + (totalHeight / 2), globalScene.cameras.main.width * 0.8, totalHeight + 20, 0x666666, 0.2).setStrokeStyle(4, 0x00ff00); 
        menuGroup.add(rect);

        // Creating each button within the rectangle
        /*
        buttonTitles.forEach((title, index) => {
            this.createButton(title, startY + (index * (buttonHeight + buttonPadding)) + (buttonHeight / 2), globalScene.cameras.main.width * 0.8, buttonHeight);
        });
        */

        this.createButton("Play", startY + (0 * (buttonHeight + buttonPadding)) + (buttonHeight / 2), globalScene.cameras.main.width * 0.8, buttonHeight, this.OpenPlayer);
        this.createButton("Editor", startY + (1 * (buttonHeight + buttonPadding)) + (buttonHeight / 2), globalScene.cameras.main.width * 0.8, buttonHeight, this.OpenEditor);

        //Start Main Music
        //TODO: stop sound another way
        //globalScene.sound.get("backgroundMusic").stop();
        globalScene.sound.play('menuMusic');
    }

    OpenPlayer()
    {
        this.Clear();
        globalScene.sound.get("menuMusic").stop();
        globalScene.sound.play("backgroundMusic");

        var boardDataString = "11 9 002000000000000000303100003100000000012000000000000000000000003100000000000000310000000000000000000000000000000000000000000000101000000020202020202010000020202020200010000020202020202010000020202020";
        var testLevel = new Level(3, "test", boardDataString);

        var testPlayer = new LevelPlayer(testLevel);
        testPlayer.Draw();
    }

    OpenEditor()
    {
        this.Clear();
        globalScene.sound.get("menuMusic").stop();
        globalScene.sound.play("backgroundMusic");
        
        var boardDataString = "11 9 002000000000000000303100003100000000012000000000000000000000003100000000000000310000000000000000000000000000000000000000000000101000000020202020202010000020202020200010000020202020202010000020202020";
        var testLevel = new Level(3, "test", boardDataString);

        var testEditor = new LevelEditor(testLevel);
        testEditor.Draw();
    }

    Draw()
    {
        this.Clear();
        this.DrawMainMenu();
    }

    Clear()
    {
        menuGroup.destroy(true, true);
        menuGroup = globalScene.physics.add.staticGroup();
    }
}