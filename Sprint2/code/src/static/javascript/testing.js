function TestAll()
{
    var allPassed = true;
    allPassed &= TestCalculateBoardScale();

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

    var minXTiles = 1;
    var minYTiles = 1;
    for(var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; zoom--)
    {
        var newMaxXTiles = Math.floor((CANVAS_WIDTH / (IMG_RESOLUTION * zoom)) - (BORDER_WALLS * 2));
        for(var numTiles = minXTiles; numTiles <= newMaxXTiles; numTiles++)
        {
            if(CalculateBoardScale(numTiles, 1) != zoom)
            {
                console.log("Failed X Zoom [" + zoom + "] with Tiles [" + numTiles + "]");
                allPassed = false;
            }
        }
        minXTiles = newMaxXTiles + 1;

        var newMaxYTiles = Math.floor(((CANVAS_HEIGHT - GUI_Y_BUFFER) / (IMG_RESOLUTION * zoom)) - (BORDER_WALLS * 2));
        for(var numTiles = minYTiles; numTiles <= newMaxYTiles; numTiles++)
        {
            if(CalculateBoardScale(1, numTiles) != zoom)
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
