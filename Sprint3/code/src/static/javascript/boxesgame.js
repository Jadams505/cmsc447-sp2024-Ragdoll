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

const MAIN_MENU_BG_IMG = "main_menu_background";
const MENU_BUTTON_IMG = "button_base";
const MINI_MENU_BTN = "mini_btn";
const MAIN_LEVEL_BTN = "main_level_btn";
const PLAY_BTN = "play_btn";
const LEADERBOARD_BTN = "leaderboard_btn";
const UPLOAD_BTN = "upload_btn";
const LOCK_BTN = "lock_btn";
const ARROW_BTN = "arrow_btn";

const MAIN_MENU_MUSIC = "main_menu_music";
const GAME_MUSIC = "game_music"

const MAIN_MENU_SCENE_NAME = "MainMenuScene";
const LEVEL_PLAYER_SCENE_NAME = "LevelPlayer";
const LEVEL_EDITOR_SCENE_NAME = "LevelEditor";
const MINI_MENU_SCENE_NAME = "MiniMenuScene";
const LEADERBOARD_SCENE_NAME = "LeaderBoardScene";
const MAIN_LVLS_SCENE_NAME = "MainLevelsScene";
const CUSTOM_LVL_SCENE_NAME = "CustomLevelScene";
const CUSTOM_LVL_FILL_SCENE_NAME = "CustomLevelFillScene";
const MAIN_LEVELS_SCENE_NAME = "MainLevelsScene";

const BUTTON_TEXT_STYLE = { font: '24px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const TITLE_TEXT_STYLE = { font: '48px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const SUBTITLE_TEXT_STYLE = { font: '36px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const SCORE_TEXT_STYLE = { font: '30px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const SCORE_NUMBER_TEXT_STYLE = { font: '30px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4, boundsAlign: "right" };
const LVL_TITLE_TEXT_STYLE = { font: '48px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };
const LVL_CREATOR_TEXT_STYLE = { font: '24px Arial', fill: '#fff', stroke: '#000', strokeThickness: 4 };

const MAIN_LEVEL_NAMES = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
const MAIN_LEVEL_CREATORS = ["Ragdoll", "Ragdoll", "Ragdoll", "Ragdoll", "Ragdoll"];
const MAIN_LEVEL_IDS = [-1, -2, -3, -4, -5];
const MAIN_LEVEL_STRINGS = ["14 9 000000000000000000000100003000000100000000000000000000000000000100003000000000000000000000101000000000101010101000000000000000101000003000000000101000000000000000101010000000000000101000002000000000101000000000000000101000000000000000101000000000000000",
                            "14 9 300000000000000020000000301010101010000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000101000000001000000000100000030000000000000301010101010000000000000000000",
                            "14 9 201001000000000000001010101010001000003000000000000000000000000000001000000000000000000010000000000000000000100000000000000000001000000000300000000010000000101010003000100000010101000010000000000000000000001000003000001000000000000000101000100010000000",
                            "9 5 000000000000200020000000000000000000000000300000003030003000000000300000000000000101010101",
                            "23 14 00000000000000000000000000001000000000000000000000000000001000301000000000001010101000001000000000000000300000012000001000000000001000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000101000000000000000000000001000000000000000000000000100000000000000000000000000101010101010101010101010101000001000001000000000001000010000100010001000000010000000000010000000000000000000000000001000000000001000000000100000100000000000001010000000010010003000000000001000102000100000000000000000000000000000000000000000000000000000000000000000003010101000000000000000000000000000000000000000000000000000100000000000"];


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

//Initialize player data
const PLAYER_NAME_BOX = "playerName";
//const PLAYER_ID_BOX = "playerId";
//const PLAYER_SCORES_BOX = "playerScores";
const playerName = sessionStorage.getItem("JetName");//document.getElementById(PLAYER_NAME_BOX).value;
//const playerId = document.getElementById(PLAYER_ID_BOX).value;
//var playerScores = document.getElementById(PLAYER_SCORES_BOX).value;

if(!playerName)
{
    window.alert("Please log in before playing");
    window.location.href = "/login";
}

var PLAYER; //Player data
var game;
var playerId;
var playerScores;
fetch("login/result", {
    method: "POST",
    headers: 
    {
        'Content-Type': "application/json"
    },
    body: JSON.stringify( 
    {
        'name': playerName
    })
}).then(response => 
{
    if(!response.ok)
    {
        console.log(response)
        window.alert("Error logging in, please try again");
        window.location.href = "/login";
    }

    return response.json();
}).then(json => 
{
    //console.log(json);
    playerId = json.playerId;
    playerScores = json.playerScores;

    PLAYER = new PlayerData(playerName, playerId, playerScores);
    game = new Phaser.Game(config);
}).catch(error => 
{
    //console.log(error)
    window.alert("Error logging in, please try again");
    window.location.href = "/login";
});

/*
playerScores = playerScores.substring(1, playerScores.length - 1).split(',');
for(var i = 0; i < playerScores.length; i++)
{
    playerScores[i] = parseInt(playerScores[i].trim().substring(1, playerScores[i].length - 1));
}
*/

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

    this.load.image(MAIN_MENU_BG_IMG, 'static/images/Title_Menu_Bg.png');
    this.load.image(MENU_BUTTON_IMG, 'static/images/Button_Base.png');
    this.load.image(MINI_MENU_BTN, 'static/images/Menu_Button.png');
    this.load.image(MAIN_LEVEL_BTN, 'static/images/Main_Level_Button.png');
    this.load.image(PLAY_BTN, 'static/images/Play_Button.png');
    this.load.image(LEADERBOARD_BTN, 'static/images/Trophy_Button.png');
    this.load.image(UPLOAD_BTN, 'static/images/Upload_Button.png');
    this.load.image(LOCK_BTN, 'static/images/Lock_Button.png');
    this.load.image(ARROW_BTN, 'static/images/Arrow.png');

    this.load.audio(GAME_MUSIC, 'static/audio/Aidans_Uni_project_loop.mp3');
    this.load.audio(MAIN_MENU_MUSIC, 'static/audio/Aidans_menu_theme.mp3');
}

var globalScene;
var musicManager;

function create ()
{
    globalScene = this; //May need reworked. Used in MusicManager as a global holder for sound

    musicManager = new MusicManager();

    this.cameras.main.setBackgroundColor("#222222");

    //Allow Phaser to play sound
    this.sound.unlock();

    //Sprite groups
    /*
    gameBoardGroup = this.physics.add.staticGroup();
    editorGuiGroup = this.physics.add.staticGroup();
    menuGroup = this.physics.add.staticGroup();
    */

    //var boardDataString = "7 7 00200000000000303100003100000120000000000000000000310000000000310000000000000000000000000000000000";
    //var boardDataString = "11 9 002000000000000000303100003100000000012000000000000000000000003100000000000000310000000000000000000000000000000000000000000000101000000020202020202010000020202020200010000020202020202010000020202020";
    //var testLevel = new Level(3, "test", boardDataString);
    
    //EDITOR TEST
    //var testEditor = new LevelEditor(testLevel);
    //testEditor.Draw();

    //PLAYER TEST
    //var testPlayer = new LevelPlayer(testLevel);
    //testPlayer.Draw();

    //MAIN MENU TEST
    //Order matters! Lower scenes render on top
    this.scene.add(MAIN_MENU_SCENE_NAME, MainMenuScene, true);
    this.scene.add(LEVEL_PLAYER_SCENE_NAME, LevelPlayer, false);
    this.scene.add(LEVEL_EDITOR_SCENE_NAME, LevelEditor, false);
    this.scene.add(MAIN_LEVELS_SCENE_NAME, MainLevelsScene, false);
    this.scene.add(CUSTOM_LVL_SCENE_NAME, CustomLevelScene, false);
    this.scene.add(CUSTOM_LVL_FILL_SCENE_NAME, CustomLevelFillScene, false);
    this.scene.add(MINI_MENU_SCENE_NAME, MiniMenuScene, false);
    this.scene.add(LEADERBOARD_SCENE_NAME, LeaderBoardScene, false);
}

function update()
{

}
