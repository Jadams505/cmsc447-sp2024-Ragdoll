const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const IMG_RESOLUTION = 16;
const MAX_ZOOM = 4;
const MIN_ZOOM = 1;
const BORDER_WALLS = 1; //Width of walls in tiles surrounding game board
const GUI_Y_BUFFER = IMG_RESOLUTION * MAX_ZOOM; //Buffer for GUI above the game board
const MIN_X_TILES = 1;
const MIN_Y_TILES = 1;
const MAX_X_TILES = Math.floor((CANVAS_WIDTH / (IMG_RESOLUTION * MIN_ZOOM)) - (BORDER_WALLS * 2));
const MAX_Y_TILES = Math.floor(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (IMG_RESOLUTION * MAX_ZOOM)) - (BORDER_WALLS * 2));

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

var config = {
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

var game = new Phaser.Game(config);
var levelZoom = 4;

function preload ()
{
    this.load.image(PLAYER_NAME, 'static/images/Player.png');
    this.load.image(WALL_NAME, 'static/images/Wall.png');
    this.load.image(TARGET_NAME, 'static/images/Target.png');
    this.load.image(BOX_DEFAULT_NAME, 'static/images/Box.png');
    this.load.image(BOX_ACTIVE_NAME, 'static/images/BoxActive.png');
    this.load.image(BOX_INACTIVE_NAME, 'static/images/BoxInactive.png');
    this.load.image(FLOOR_NAME, 'static/images/Floor.png');
}

var gameBoardGroup;
var tlevel;
function create ()
{
    this.cameras.main.setBackgroundColor("#222222");

    gameBoardGroup = this.physics.add.staticGroup();

    var boardDataString = "4 2 0020303101210000";
    tlevel = new Level("test", boardDataString);
    tlevel.DrawBoard();
    //DrawBoard(boardData);
}

function update()
{

}
