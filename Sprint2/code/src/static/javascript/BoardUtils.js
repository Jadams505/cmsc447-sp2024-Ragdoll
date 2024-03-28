//Precondition: board width and height will fit within the screen
//Precondition: board width and height are size of playable board, excluding border
//Board Ranges (for an 800x600 canvas):
//Zoom 4: X [1-10] | Y [1-6]
//Zoom 3: X [11-14] | Y[7-9]
//Zoom 2: X [15-23] | Y[10-14]
//Zoom 1: X [24-48] | Y[15-31]
function CalculateBoardScale(boardData)
{
    var maxXScale = MAX_ZOOM;
    var maxYScale = MAX_ZOOM;

    for(var i = MAX_ZOOM; i > MIN_ZOOM; i--)
    {
        if((CANVAS_WIDTH / (maxXScale * IMG_RESOLUTION)) - (BORDER_WALLS * 2) < boardData.boardWidth)
        {
            maxXScale--;
        }

        if(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (maxYScale * IMG_RESOLUTION)) - (BORDER_WALLS * 2) < boardData.boardHeight)
        {
            maxYScale--;
        }
    }

    return Math.min(maxXScale, maxYScale);
}

function GridToWorldSpace(posX, posY, levelZoom)
{
    return [(posX + BORDER_WALLS) * IMG_RESOLUTION * levelZoom, ((posY + BORDER_WALLS) * IMG_RESOLUTION * levelZoom) + GUI_Y_BUFFER];
}

//Primarily used for mouse input
function WorldToGridSpace(posX, posY, levelZoom)
{

}
