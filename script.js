const popup = document.querySelector('.popup')
const popup_time = document.querySelector('.pop-timing')

const popup_close_timing = document.getElementById('popup-close-timing')
popup_close_timing.addEventListener('click', () => {
    popup_time.classList.remove('pop')
})

const gameOver = document.querySelector('.gameOver-alert')
const gameOverCloseBtn = document.querySelector('#popup-close-gameOver')
gameOverCloseBtn.addEventListener('click', () => {
    gameOver.classList.remove('pop')  
})

const options = document.getElementById('options')

let public_index = null

let grid_elements = []
let grid_9x9 = []

// The puzzle
const puzzleBoard = document.getElementById('puzzle');

const popup_close = document.getElementById('popup-close')
popup_close.addEventListener('click', () => {
    popup.classList.remove('pop')
    window.location.reload()
})

const timer = document.getElementById('set-time')
timer.addEventListener('click', () => { 
    popup_time.classList.add('pop')
})

const beginner = document.getElementById('beginner')
const intermediate = document.getElementById('intermediate')
const hard = document.getElementById('hard')
const nightmare = document.getElementById('nightmare')
const generatePuzzle = document.getElementById('call_API')
generatePuzzle.addEventListener('click', () => {
    popup.classList.add('pop')

    beginner.addEventListener('click', ()=>{      
        geneate_puzzle(grid_9x9, GAME_DIFFICULTY.BEGINNER)
        popup.classList.remove('pop')
    })

    intermediate.addEventListener('click', ()=>{
        geneate_puzzle(grid_9x9, GAME_DIFFICULTY.INTERMEDIATE)
        popup.classList.remove('pop')
    })

    hard.addEventListener('click', ()=>{
        geneate_puzzle(grid_9x9, GAME_DIFFICULTY.HARD)
        popup.classList.remove('pop')
    })

    nightmare.addEventListener('click', ()=>{
        geneate_puzzle(grid_9x9, GAME_DIFFICULTY.NIGHTMARE)
        popup.classList.remove('pop')
    })
})

const loading_btn = document.querySelector(".button");
loading_btn.addEventListener("click", () => {
    loading_btn.classList.add("button--loading");
});

let selected_option = null

let level = 79
// Method to create API URL, fetch it and return the result which is a sudoku puzzle
const geneate_puzzle = (grid_param, level) => {
    
    generate_board(grid_param)
    generate_solution(grid_param)
    remove_board_numbers(grid_param, level)

    populate_grid(grid_param)
    generatePuzzle.disabled = true;
    generatePuzzle.style.backgroundColor = "rgba(104, 102, 102, 0.5)";
    generatePuzzle.style.cursor = "auto"
    enableButtons()
    options.classList.remove("disable_options")
}

let solution = false;
const solveButton = document.getElementById('solve-button');
solveButton.addEventListener('click', () => {
    solution = true
    generate_solution(grid_9x9)
    populate_grid(grid_9x9)
    timer.disabled = true;
    if(msLeft > 1){
        generateTime(0, 0)
    }
})


// Method to check values: validate column - row - 3X3
const validate_input = (index, row, col, grid) => {
    
    if(isColSafe(grid, col, index) &&
    isRowSafe(grid, row, index) &&
    isBoxSafe(grid, row - row%3, col - col%3, index)) {
        grid_elements[row][col].value = index
        grid_elements[row][col].innerText = grid_elements[row][col].value

        if(selected_option !== null){
            selected_option.classList.remove("number-selected");
        }
        selected_option = null;
    }
    else{
        console.log(index + " is wrong")
        grid[row][col].classList.add('animate')
        setTimeout(()=> {
            grid[row][col].classList.remove('animate');},3000);
    }
    if(selected_option !== null) {
        selected_option.classList.remove("number-selected");
    }
    
    selected_option = null;
    return true
}

// maybe using grid would be better?
const isRowSafe = (grid, row, index)=> {
    for (let col = 0; col < 9; col++) {
        if (grid[row][col].value === index) {
            return false;
        }
    }
    return true;
}

// check duplicate number in col
const isColSafe = (grid, col, index) => {
    for (let row = 0; row < 9; row++) {
        if (grid[row][col].value === index) {
            return false;
        }
    }
    return true;
}

const isBoxSafe = (grid, box_row, box_col, index) => {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (grid[row + box_row][col + box_col].value === index){
                return false;
            } 
        }
    }
    return true;
}

const resetButton = document.querySelector('.reset')
resetButton.addEventListener('click', clearCells)
//Reset cells to blank
function clearCells(){
    window.location.reload()
}

const availableOptions = document.querySelectorAll('.single_option');

availableOptions.forEach(option => {
    option.addEventListener('click', () => {
        select_option(option)
    })
})

const create_grid_9x9 = () => {
    for(let i = 0; i < 9; i++){
        grid_elements.push([]);
        for(let j = 0; j < 9; j++){
            grid_elements[i][j] = document.createElement('div')
            // cells[i][j].classList.add('style')
            grid_elements[i][j].classList.add('input-style')
            grid_elements[i][j].addEventListener('click', () => {
                if(public_index === null && mins === undefined){
                    alert("Please select an option")
                    return
                }else if(public_index === null && mins === 0){ 
                    return
                }
                console.log("Index: "+ public_index)
                console.log("Row: "+i)
                console.log("Column : "+j)
                if(solution === false){
                    validate_input(public_index, i, j, grid_elements)
                }
                else{
                    return
                }
                
            })
            if( (i <= 2 && j <= 2)||
                (i <=2  && j > 5 && j <= 8)||
                (i > 2 && i < 6  && j > 2 && j < 6)||
                (i > 5 && i <= 8  && j >= 0 && j < 3)||
                (i > 5 && i <= 8  && j > 5 && j <= 8)
            
            ){
                grid_elements[i][j].classList.add('odd-section')
            }
            puzzleBoard.appendChild(grid_elements[i][j])
        }
    }
    zeroise_grid_elements(grid_elements)
}

let box_row = 0
let box_col = 0

const select_option = (param_option) => {
    let parsed_option = null
    if (selected_option != null) {
        selected_option.classList.remove("number-selected");
    }
    selected_option = param_option;
    param_option.classList.add("number-selected");
    parsed_option = parseInt(selected_option.innerHTML)
    public_index = parsed_option
}

const input_cells = puzzleBoard.querySelectorAll('div')


const zeroise_grid_elements = (grid_param) => {
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            grid_param[i][j].value = 0
            grid_param[i][j].innerText = ''
        }
    }
}

const zeroise_grid_9x9 = (grid_param) => {
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            grid_param[i][j] = 0
        }
    }
}

const populate_grid = (puzzle_param) => {
    let counter = 0
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            grid_elements[i][j].value = puzzle_param[i][j]
            if(puzzle_param[i][j] !== 0){               
                grid_elements[i][j].innerText = grid_elements[i][j].value
            }
            counter +=1
        }
    }
}




const wait=ms=>new Promise(resolve => setTimeout(resolve, ms));
let seconds = 60
let millSec = 1000
let min;

const submitTime = document.querySelector('#setTime')

submitTime.addEventListener('click', () => {
    if(document.querySelector('#time-btn-5').checked){
        min = 5
    }else if(document.querySelector('#time-btn-7').checked){
        min = 7
    }else if(document.querySelector('#time-btn-10').checked){
        min = 10
    }
    if(min === undefined){
        alert("Time frame has not been selected")
        return
    }
    generateTime(min, 0)
    timeUpAlert(min)
    popup_time.classList.remove('pop')
})

 const timeUpAlert = async (minParam) => {
    let minutes = minParam * seconds * millSec
    
    wait(minutes).then(() => {
        gameOver.classList.add('pop')
     })
}

var element, endTime, hours, mins, msLeft, time;
element = document.getElementById('counter');
const generateTime = async (minutes, seconds ) => {
    const twoDigits = (n) => {
        return (n <= 9 ? "0" + n : n);
    }
    const updateTimer = () => {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "Time up!";
            options.style.display = "none"
            timer.disabled = true
            
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500

    updateTimer();
    return;
}

const nextEmptySpot = (board) => {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] === 0)
                return [i, j];
        }
    }
    return [-1, -1];
}


let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const difficulty = 30;

const generate_board = (board) => {
    if(board.length === 0){
        for(let row = 0; row < 9; row++) {
            board.push([])
            for(let col = 0; col < 9; col++){
                board[row][col] = 0
            }
        }
    } 
}


const checkRow = (board, row, value) => {
    for(var i = 0; i < board[row].length; i++) {
        if(board[row][i] === value) {
            return false;
        }
    }
    return true;
}

const checkColumn = (board, column, value) => {
    for(var i = 0; i < board.length; i++) {
        if(board[i][column] === value) {
            return false;
        }
    }
    return true;
};

const checkSquare = (board, row, column, value) => {
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(column / 3) * 3;
    
    for (var r = 0; r < 3; r++){
        for (var c = 0; c < 3; c++){
            if (board[boxRow + r][boxCol + c] === value)
                return false;
        }
    }
    return true;
};

const checkValue = (board, row, column, value) => {
    if(checkRow(board, row, value) &&
      checkColumn(board, column, value) &&
      checkSquare(board, row, column, value)) {
        return true;
    }
    return false; 
};


const generate_solution = (board)  =>{  
    let emptySpot = nextEmptySpot(board);
    let row = emptySpot[0];
    let col = emptySpot[1];
    // there is no more empty spots
    if (row === -1) {
        return board;
    }

    for(let i = 0; i < shuffledNumbers.length; i++){
        let option = shuffledNumbers[i]

        if (checkValue(board, row, col, option)){
            board[row][col] = option;
            generate_solution(board);
        }
    }

    if (nextEmptySpot(board)[0] !== -1)
        board[row][col] = 0;
    return board;
}

const remove_board_numbers = (board, level)  =>{
    let non_empty_squares = []
    non_empty_squares = get_nonEmpty_cells(board)

    let rounds = 81
    let index1 = 0;
    let index2 = 1;

    non_empty_squares.sort(() => {
        return Math.random() - 0.5;
    });
    while(rounds >= level) {
        
        let row = non_empty_squares[index1]
        let col = non_empty_squares[index2]
        index1 +=1
        index2 +=1

        board[row][col] = 0
        rounds -=1
    }
}

const get_nonEmpty_cells = (board) => {
    let non_empty_squares_row = []
    let non_empty_squares_col = []
    for(let row = 0; row < 9; row++) {
        for(let col = 0; col < 9; col++){
            if(board[row][col] !== 0){
                // return [row, col]
                non_empty_squares_row.push(row)
                non_empty_squares_col.push(col)
            }
        }
    }
    non_empty_squares_row.sort(() => {
        return Math.random() - 0.5;
    });
    non_empty_squares_col.sort(()=> {
        return Math.random() - 0.5;
    });
    return non_empty_squares_row, non_empty_squares_col
}


let shuffledNumbers = numbers.sort(() => {
  return Math.random() - 0.5;
});


const disableButtons = () => {
    resetButton.disabled = true
    solveButton.disabled = true
    timer.disabled = true
}

const timer_5 = document.querySelector('#time-btn-5')
const timer_7 = document.querySelector('#time-btn-7')
const timer_10 = document.querySelector('#time-btn-10')
const enableButtons = ()=>{
    resetButton.disabled = false
    solveButton.disabled = false
    timer_5.disabled = false
    timer_7.disabled = false
    timer_10.disabled = false
    timer.disabled = false
}

const GAME_DIFFICULTY = {
    BEGINNER: 70,
    INTERMEDIATE: 55,
    HARD: 40,
    NIGHTMARE: 20
}

init = ()=>{
    create_grid_9x9()
    disableButtons()
}
init()