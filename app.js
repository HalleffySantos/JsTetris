document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'));
    
    const scoreDisplay = document.querySelector('#score');
    let score = 0;
    scoreDisplay.innerHTML = score;

    const startBtn = document.querySelector('#start-button');
    let timerId;

    const width = 10;

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [width, width*2, width*2+1, width*2+2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    //randonly select a tetromino and its rotation
    let currentPosition = 4;
    let currentRotation = 0;
    let randomTetromino = Math.floor(Math.random()*theTetrominoes.length);
    let nextRandomTetromino = 0;

    let currentTetromino = theTetrominoes[randomTetromino][currentRotation];
    

    //draw the tetromino
    function draw()
    {
        currentTetromino.forEach(index => {
            squares[currentPosition+index].classList.add('tetromino');
        });
    }
    
    //undraw the tetromino
    function undraw() {
        currentTetromino.forEach(index => {
            squares[currentPosition+index].classList.remove('tetromino');
        });
    }

    //make the tetromino move down every second
    //timerId = setInterval(moveDown, 1000);

    //mode down fuinction
    function moveDown()
    {
        freeze();
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze function, check if a row was completed and if a tetromino is in a taken space
    function freeze() {
        if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken')))
        {
            currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'));

            //start a new tetromino falling
            randomTetromino = nextRandomTetromino;
            nextRandomTetromino = Math.floor(Math.random()*theTetrominoes.length);
            currentTetromino = theTetrominoes[randomTetromino][currentRotation];
            currentPosition = 4;

            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //move the tetromino left, unless is at the edge is at the edge or there is a blockage
    function moveLeft() 
    {
        undraw();
        const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)
        
        if (!isAtLeftEdge)
            currentPosition -= 1;

        //push back if the player decides to go to a taken space
        if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition += 1;
        }

        draw();
    }

    //move the tetromino right, unless is at the edge is at the edge or there is a blockage
    function moveRight()
    {
        undraw();
        const isAtRightEdge = currentTetromino.some(index => (currentPosition+index)%width === width-1);

        if (!isAtRightEdge)
            currentPosition += 1;
        
        //push back if the player decides to go to a taken space
        if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition -= 1;
        }

        draw();
    }

    //rotate the tetromino
    function rotate()
    {
        undraw();
        currentRotation = (currentRotation+1)%theTetrominoes[randomTetromino].length;
        currentTetromino = theTetrominoes[randomTetromino][currentRotation];
        draw();
    }

    //check keyboard input
    function control(e)
    {
        switch(e.keyCode)
        {
            case 37:
                moveLeft();
                break;

            case 38:
                rotate();
                break;

            case 39:
                moveRight();
                break;
            
            case 40:
                moveDown();
                break;
        }
    }

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ];

    //display the shape in the mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });

        upNextTetrominoes[nextRandomTetromino].forEach(index =>
        {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    //add Score
    function addScore()
    {
        for (let j = 0; j < 199; j += width)
        {
            const row = [j, j+1, j+2, j+3, j+4, j+5, j+6, j+7, j+8, j+9];
            
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });

                const squaresRemoved = squares.splice(j, width);
                console.log(squaresRemoved);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over function
    function gameOver()
    {
        if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            scoreDisplay.innerHTML = score + ' game over';
            clearInterval(timerId); 
        }
    }

    //downwards it the game instantiation
    //get input for keyboard
    document.addEventListener('keyup', control);

    //start the game
    startBtn.addEventListener('click', () => {
        if (timerId)
        {
            clearInterval(timerId);
            timerId = null;
        }
        else
        {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandomTetromino = Math.floor(Math.random()*theTetrominoes);
            displayShape();
        }
    });

});