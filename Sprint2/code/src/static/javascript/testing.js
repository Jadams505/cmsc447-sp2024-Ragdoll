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

function TestWorldToGridSpace()
{
    var allPassed = true;

    for(var z = MIN_ZOOM; z <= MAX_ZOOM; z++)
    {
        for(var x = 0; x < CANVAS_WIDTH; x++)
        {
            for(var y = 0; y < GUI_Y_BUFFER; y++)
            {
                const result = WorldToGridSpace(x, y, z);
                if(result[0] != -1 || result[1] != -1)
                {
                    console.log("Failed Y GUI buffer edge case.");
                    allPassed = false;
                }
            }
            for(var y = GUI_Y_BUFFER; y < CANVAS_HEIGHT; y++)
            {
                const expectedX = Math.floor(x / (SPRITE_RESOLUTION * z));
                const expectedY = Math.floor((y - GUI_Y_BUFFER) / (SPRITE_RESOLUTION * z));

                const result = WorldToGridSpace(x, y, z);
                if(result[0] != expectedX || result[1] != expectedY)
                {
                    console.log(`Failed World to Grid tile with (${x}, ${y}, ${z}); Expected: [${expectedX}, ${expectedY}]; Received: [${result}]`);
                    allPassed = false;
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
