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

function create ()
{
    this.cameras.main.setBackgroundColor("#222222");

    gameBoardGroup = this.physics.add.staticGroup();
    /*
    for(var i = 0; i < 4; i++)
    {
        for(var j = 0; j < 3; j++)
        {
            DrawBoardSprite(i * 64, j * 64, FLOOR_ID);
        }
    }
    var playerSprite = DrawBoardSprite(0, 0, PLAYER_ID);
    var wallSprite = DrawBoardSprite(64, 0, WALL_ID);
    var targetSprite = DrawBoardSprite(128, 0, TARGET_ID);
    var boxDefaultSprite = DrawBoardSprite(0, 64, BOX_DEFAULT_ID);
    var boxActiveSprite = DrawBoardSprite(64, 64, BOX_ACTIVE_ID);
    var boxInactiveSprite = DrawBoardSprite(128, 64, BOX_INACTIVE_ID);
    */

    var levelData = [];
    var targetData = [];
    for(var i = 0; i < 48; i++)
    {
        levelData.push([]);
        targetData.push([]);
        for(var j = 0; j < 31; j++)
        {
            levelData[i].push(Math.floor(Math.random() * 6));
            targetData[i].push(Math.floor(Math.random() * 2));
        }
    }
    DrawBoard(10, 6, levelData, targetData);
}

function update ()
{

}

//Precondition: board width and height will fit within the screen
//Precondition: board width and height are size of playable board, excluding border
//Board Ranges (for an 800x600 canvas):
//Zoom 4: X [1-10] | Y [1-6]
//Zoom 3: X [11-14] | Y[7-9]
//Zoom 2: X [15-23] | Y[10-14]
//Zoom 1: X [24-48] | Y[15-31]
function CalculateBoardScale(boardWidth, boardHeight)
{
    var maxXScale = MAX_ZOOM;
    var maxYScale = MAX_ZOOM;

    for(var i = MAX_ZOOM; i > MIN_ZOOM; i--)
    {
        if((CANVAS_WIDTH / (maxXScale * IMG_RESOLUTION)) - (BORDER_WALLS * 2) < boardWidth)
        {
            maxXScale--;
        }

        if(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (maxYScale * IMG_RESOLUTION)) - (BORDER_WALLS * 2) < boardHeight)
        {
            maxYScale--;
        }
    }

    return Math.min(maxXScale, maxYScale);
}

function GridToWorldSpace(posX, posY)
{
    return [(posX + BORDER_WALLS) * IMG_RESOLUTION * levelZoom, ((posY + BORDER_WALLS) * IMG_RESOLUTION * levelZoom) + GUI_Y_BUFFER];
}

//Primarily used for mouse input
function WorldToGridSpace(posX, posY)
{

}

function DrawBoardBorderWalls(boardWidth, boardHeight)
{
    //Draw Top and Bottom Borders
    for(var i = 0; i < boardWidth + (BORDER_WALLS * 2); i++)
    {
        for(var j = 0; j < BORDER_WALLS; j++)
        {
            DrawBoardSprite(i * IMG_RESOLUTION * levelZoom, (j * IMG_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID);
            DrawBoardSprite(i * IMG_RESOLUTION * levelZoom, ((((BORDER_WALLS * 2) + boardHeight - 1) * IMG_RESOLUTION * levelZoom) + GUI_Y_BUFFER) - (j * IMG_RESOLUTION * levelZoom), WALL_ID);
        }
    }

    //Draw Left and Right Borders
    for(var j = BORDER_WALLS; j < boardHeight + BORDER_WALLS; j++)
    {
        for(var i = 0; i < BORDER_WALLS; i++)
        {
            DrawBoardSprite(i * IMG_RESOLUTION * levelZoom, (j * IMG_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID);
            DrawBoardSprite((i + BORDER_WALLS + boardWidth) * IMG_RESOLUTION * levelZoom, (j * IMG_RESOLUTION * levelZoom) + GUI_Y_BUFFER, WALL_ID);
        }
    }
}

function DrawBoard(boardWidth, boardHeight, levelData, targetData)
{
    levelZoom = CalculateBoardScale(boardWidth, boardHeight);

    //Draw outer level bounds
    DrawBoardBorderWalls(boardWidth, boardHeight);

    //Draw board sprites
    for(var i = 0; i < boardWidth; i++)
    {
        for(var j = 0; j < boardHeight; j++)
        {
            var tilePos = GridToWorldSpace(i, j);

            //Always draw the floor, since some tiles are semi-transparent
            DrawBoardSprite(tilePos[0], tilePos[1], FLOOR_ID);

            //Check if tile being drawn is a box. If so, we need to check for targets to properly light them
            if(levelData[i][j] == BOX_DEFAULT_ID || levelData[i][j] == BOX_INACTIVE_ID || levelData[i][j] == BOX_ACTIVE_ID)
            {
                //Target data is truthy, so this works
                if(targetData[i][j])
                {
                    DrawBoardSprite(tilePos[0], tilePos[1], BOX_ACTIVE_ID);
                }
                else
                {
                    DrawBoardSprite(tilePos[0], tilePos[1], BOX_INACTIVE_ID);
                }
            }
            else
            {
                DrawBoardSprite(tilePos[0], tilePos[1], levelData[i][j]);
            }

            //Draw Targets
            if(targetData[i][j])
            {
                DrawBoardSprite(tilePos[0], tilePos[1], TARGET_ID);
            }
        }
    }
}

function DrawBoardSprite(worldPosX, worldPosY, spriteID)
{
    var spriteName;

    switch(spriteID)
    {
        case(FLOOR_ID):
            spriteName = FLOOR_NAME;
            break;
        case(WALL_ID):
            spriteName = WALL_NAME;
            break;
        case(PLAYER_ID):
            spriteName = PLAYER_NAME;
            break;
        case(BOX_DEFAULT_ID):
            spriteName = BOX_DEFAULT_NAME;
            break;
        case(BOX_INACTIVE_ID):
            spriteName = BOX_INACTIVE_NAME;
            break;
        case(BOX_ACTIVE_ID):
            spriteName = BOX_ACTIVE_NAME;
            break;
        case(TARGET_ID):
            spriteName = TARGET_NAME;
            break;
        default:
            if(typeof(spriteID) === 'string')
            {
                //Loose assumption that if the ID is a string then
                //  the name of the sprite was passed in accidentally
                spriteName = spriteKey;
            }
            else
            {
                //Draw nothing
                console.warn("Invalid sprite ID! [" + spriteID + "]");
                return;
            }
            break;
    }
    gameBoardGroup.create(worldPosX, worldPosY, spriteName).setScale(levelZoom).setOrigin(0, 0);
}

function ClearBoard()
{
    gameBoardGroup.clear(true, true);
}