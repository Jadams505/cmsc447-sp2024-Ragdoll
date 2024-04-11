//Precondition: board width and height will fit within the screen
//Precondition: board width and height are size of playable board, excluding border
//Board Ranges (for an 800x600 canvas; BORDER_WALLS=1):
//Zoom 4: X [1-10] | Y [1-6]
//Zoom 3: X [11-14] | Y[7-9]
//Zoom 2: X [15-23] | Y[10-14]
//Zoom 1: X [24-48] | Y[15-31]
function CalculateBoardScale(boardData)
{
    var maxXScale = MAX_ZOOM;
    var maxYScale = MAX_ZOOM;

    for(var i = MAX_ZOOM; i >= MIN_ZOOM; i--)
    {
        if((CANVAS_WIDTH / (maxXScale * SPRITE_RESOLUTION)) - (BORDER_WALLS * 2) < boardData.boardWidth)
        {
            maxXScale--;
        }

        if(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (maxYScale * SPRITE_RESOLUTION)) - (BORDER_WALLS * 2) < boardData.boardHeight)
        {
            maxYScale--;
        }
    }

    return Math.min(maxXScale, maxYScale);
}

function GridToWorldSpace(posX, posY, levelZoom)
{
    return [(posX + BORDER_WALLS) * SPRITE_RESOLUTION * levelZoom, ((posY + BORDER_WALLS) * SPRITE_RESOLUTION * levelZoom) + GUI_Y_BUFFER];
}

//Primarily used for mouse input
//Returns a list of x and y in grid space, with [-1, -1] if outside the board
function WorldToGridSpace(posX, posY, level)
{
    if(posY < GUI_Y_BUFFER + (BORDER_WALLS * SPRITE_RESOLUTION * level.levelZoom) || posY >= GUI_Y_BUFFER + (SPRITE_RESOLUTION * level.boardData.boardHeight * level.levelZoom) + (BORDER_WALLS * SPRITE_RESOLUTION * level.levelZoom))
    {
        return [-1, -1];
    }

    if(posX < (BORDER_WALLS * SPRITE_RESOLUTION * level.levelZoom) || posX >= (SPRITE_RESOLUTION * level.boardData.boardWidth * level.levelZoom) + (BORDER_WALLS * SPRITE_RESOLUTION * level.levelZoom))
    {
        return [-1, -1];
    }

    const xTile = Math.floor(posX / (SPRITE_RESOLUTION * level.levelZoom)) - BORDER_WALLS;
    const yTile = Math.floor((posY - GUI_Y_BUFFER) / (SPRITE_RESOLUTION * level.levelZoom)) - BORDER_WALLS;

    if(xTile < 0 || xTile >= level.boardData.boardWidth || yTile < 0 || yTile >= level.boardData.boardHeight)
    {
        return [-1, -1];
    }

    return [xTile, yTile];
}

function DrawGameSprite(spriteGroup, worldPosX, worldPosY, spriteID, levelZoom)
{
    var spriteName;
    var validSprite = true;

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
                validSprite = false;
            }
            break;
    }

    if(validSprite)
    {
        spriteGroup.create(worldPosX, worldPosY, spriteName).setScale(levelZoom * BOARD_SPRITE_SCALE).setOrigin(0, 0);
    }
}