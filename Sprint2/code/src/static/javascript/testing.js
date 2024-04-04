function TestAll()
{
    var allPassed = true;
    allPassed &= TestCalculateBoardScale();
    allPassed &= TestWorldToGridSpace();

    if(allPassed)
    {
        //The &= operator converts bools to ints, so this makes them bools again
        allPassed = true;
        console.info("All Tests Passed!");
    }
    else
    {
        //The &= operator converts bools to ints, so this makes them bools again
        allPassed = false;
        console.error("Test(s) Failed!");
    }
    return allPassed;
}

function TestCalculateBoardScale()
{
    var allPassed = true;

    var testBoard = new BoardData(0, 0, [], []); //Invalid board, but required for CalculateBoardScale

    var minXTiles = 1;
    var minYTiles = 1;
    for(var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; zoom--)
    {
        var newMaxXTiles = Math.floor((CANVAS_WIDTH / (SPRITE_RESOLUTION * zoom)) - (BORDER_WALLS * 2));
        for(var numTiles = minXTiles; numTiles <= newMaxXTiles; numTiles++)
        {
            testBoard.boardWidth = numTiles;
            testBoard.boardHeight = 1;
            if(CalculateBoardScale(testBoard) != zoom)
            {
                console.log("Failed X Zoom [" + zoom + "] with Tiles [" + numTiles + "]");
                allPassed = false;
            }
        }
        minXTiles = newMaxXTiles + 1;

        var newMaxYTiles = Math.floor(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (SPRITE_RESOLUTION * zoom)) - (BORDER_WALLS * 2));
        for(var numTiles = minYTiles; numTiles <= newMaxYTiles; numTiles++)
        {
            testBoard.boardWidth = zoom;
            testBoard.boardHeight = numTiles;
            if(CalculateBoardScale(testBoard) != zoom)
            {
                console.log("Failed Y Zoom [" + zoom + "] with Tiles [" + numTiles + "]");
                allPassed = false;
            }
        }
        minYTiles = newMaxYTiles + 1;
    }

    if(allPassed)
    {
        console.info("Test Passed: CalculateBoardScale");
    }
    else
    {
        console.error("Test Failed: CalculateBoardScale");
    }
    return allPassed;
}

//Generates a board full of random garbage for testing drawing and functions that require boards
function GenerateRandomLevel(boardWidth, boardHeight)
{
    var levelData = [];
    var targetData = [];
    for(var i = 0; i < boardWidth; i++)
    {
        levelData.push([]);
        targetData.push([]);
        for(var j = 0; j < boardHeight; j++)
        {
            levelData[i].push(Math.floor(Math.random() * 4));
            targetData[i].push(Math.floor(Math.random() * 2));
        }
    }

    var boardData = new BoardData(boardWidth, boardHeight, levelData, targetData);
    var levelString = BoardData.SerializeBoardData(boardData);

    return new Level(-1, "random", levelString);
}

function TestWorldToGridSpace()
{
    var allPassed = true;

    for(var w = MIN_X_TILES; w <= MAX_X_TILES; w++)
    {
        for(var h = MIN_Y_TILES; h <= MAX_Y_TILES; h++)
        {
            const curLevel = GenerateRandomLevel(w, h);
            for(var x = 0; x < CANVAS_WIDTH; x++)
            {
                for(var y = 0; y < CANVAS_HEIGHT; y++)
                {
                    const result = WorldToGridSpace(x, y, curLevel);

                    if(y < GUI_Y_BUFFER + (SPRITE_RESOLUTION * BORDER_WALLS * curLevel.levelZoom) ||
                        y >= GUI_Y_BUFFER + (SPRITE_RESOLUTION * BORDER_WALLS * curLevel.levelZoom) + (SPRITE_RESOLUTION * h * curLevel.levelZoom) ||
                        x < (SPRITE_RESOLUTION * BORDER_WALLS * curLevel.levelZoom) ||
                        x >= (SPRITE_RESOLUTION * BORDER_WALLS * curLevel.levelZoom) + (SPRITE_RESOLUTION * w * curLevel.levelZoom))
                    {
                        if(result[0] != -1 || result[1] != -1)
                        {
                            console.log(`World to Grid Space Out of Bounds Failed (${w}, ${h}, ${x}, ${y}). Expected: [-1, -1]; Received: [${result}]`);
                            allPassed = false;
                        }
                    }
                    else
                    {
                        const expectedX = Math.floor((x - (SPRITE_RESOLUTION * BORDER_WALLS * curLevel.levelZoom)) / (SPRITE_RESOLUTION * curLevel.levelZoom));
                        const expectedY = Math.floor((y - GUI_Y_BUFFER - (SPRITE_RESOLUTION * BORDER_WALLS * curLevel.levelZoom)) / (SPRITE_RESOLUTION * curLevel.levelZoom));

                        if(result[0] != expectedX || result[1] != expectedY)
                        {
                            console.log(`World to Grid Space Nominal Failed (${w}, ${h}, ${x}, ${y}); Expected: [${expectedX}, ${expectedY}]; Received: [${result}]`);
                            allPassed = false;
                        }
                    }
                }
            }
        }
    }

    if(allPassed)
    {
        console.info("Test Passed: WorldToGridSpace");
    }
    else
    {
        console.error("Test Failed: WorldToGridSpace");
    }
    return allPassed;
}
