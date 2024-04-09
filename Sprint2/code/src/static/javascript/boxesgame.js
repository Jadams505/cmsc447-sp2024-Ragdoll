const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const IMG_RESOLUTION = 16;
const BOARD_SPRITE_SCALE = 1.0; //1.0 for 16x16 sprites. Lower for higher resolution sprites
const SPRITE_RESOLUTION = IMG_RESOLUTION * BOARD_SPRITE_SCALE; //How big sprites will be. Should always = 16
const MAX_ZOOM = 4;
const MIN_ZOOM = 1;
const BORDER_WALLS = 1; //Width of walls in tiles surrounding game board
const GUI_Y_BUFFER = SPRITE_RESOLUTION * MAX_ZOOM; //Buffer for GUI above the game board
const MIN_X_TILES = 1;
const MIN_Y_TILES = 1;
const MAX_X_TILES = Math.floor((CANVAS_WIDTH / (SPRITE_RESOLUTION * MIN_ZOOM)) - (BORDER_WALLS * 2));
const MAX_Y_TILES = Math.floor(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (SPRITE_RESOLUTION * MIN_ZOOM)) - (BORDER_WALLS * 2));

const FLOOR_ID = 0;
const WALL_ID = 1;
const PLAYER_ID = 2;
const BOX_DEFAULT_ID = 3;
const BOX_INACTIVE_ID = 4;
const BOX_ACTIVE_ID = 5;
const TARGET_ID = 6;

const FLOOR_NAME = 'floor_sprite';
const WALL_NAME = 'wall_sprite';
const PLAYER_NAME = 'player_sprite';
const BOX_DEFAULT_NAME = 'box_default_sprite';
const BOX_INACTIVE_NAME = 'box_inactive_sprite';
const BOX_ACTIVE_NAME = 'box_active_sprite';
const TARGET_NAME = 'target_sprite';

const EDITOR_TILE_SELECTOR_NAME = "editor_tile_selector_sprite";
const UP_ARROW_BUTTON_NAME = "up_arrow_button_sprite";
const DOWN_ARROW_BUTTON_NAME = "down_arrow_button_sprite";

const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    pixelArt: true,
    parent: 'phaserCanvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload ()
{
    this.load.image(PLAYER_NAME, 'static/images/Player.png');
    this.load.image(WALL_NAME, 'static/images/Wall.png');
    this.load.image(TARGET_NAME, 'static/images/Target.png');
    this.load.image(BOX_DEFAULT_NAME, 'static/images/Box.png');
    this.load.image(BOX_ACTIVE_NAME, 'static/images/BoxActive.png');
    this.load.image(BOX_INACTIVE_NAME, 'static/images/BoxInactive.png');
    this.load.image(FLOOR_NAME, 'static/images/Floor.png');

    this.load.image(EDITOR_TILE_SELECTOR_NAME, 'static/images/EditorTileSelector.png');
    this.load.image(UP_ARROW_BUTTON_NAME, 'static/images/UpArrowButton.png');
    this.load.image(DOWN_ARROW_BUTTON_NAME, 'static/images/DownArrowButton.png');

    this.load.audio('backgroundMusic', 'static/audio/Aidans_Uni_project_loop.mp3');
    this.load.audio('menuMusic', 'Aidans_menu_theme.mp3');
}

var globalScene;
var gameBoardGroup;
var editorGuiGroup;
var menuGroup;

function create ()
{
    globalScene = this; //May need reworked. Used in LevelEditor for input events

    this.cameras.main.setBackgroundColor("#222222");

    //Allow Phaser to play sound
    this.sound.unlock();

    //Sprite groups
    gameBoardGroup = this.physics.add.staticGroup();
    editorGuiGroup = this.physics.add.staticGroup();
    menuGroup = this.physics.add.staticGroup();

    //var boardDataString = "7 7 00200000000000303100003100000120000000000000000000310000000000310000000000000000000000000000000000";
    //var boardDataString = "11 9 002000000000000000303100003100000000012000000000000000000000003100000000000000310000000000000000000000000000000000000000000000101000000020202020202010000020202020200010000020202020202010000020202020";
    //var testLevel = new Level(3, "test", boardDataString);
    
    //EDITOR TEST
    //var testEditor = new LevelEditor(testLevel);
    //testEditor.Draw();

    //PLAYER TEST
    //var testPlayer = new LevelPlayer(testLevel);
    //testPlayer.Draw();

    //Start Main Music
    //this.sound.play('menuMusic');

    //MAIN MENU TEST
    var mainScene = new MainMenuScene();
    mainScene.Draw();
}

function update()
{

}
