const numNodes = 16; // Equal to # of levels
const defaultBoard = [];
for (let i = 1; i <= numNodes; i++) {
    defaultBoard.push(i);
}

let nodeOrder = [];
let currentOrder = 0;
let level = 2;
let gameOver = false;
let firstNodeClicked = false;

$(document).ready(function() {
    let startButton = $("#start-button");
    let startButtonContainer = $("#start-button-container");

    // Hide "Start" button when pressed
    startButtonContainer.on("click", "#start-button", function() {
        startButton.hide();
        startGame();
    });

    /*
    Handle when a valid node is clicked. Delegate event to gameBoard div since
    templated elements don't have event handlers.
    */
    $('#game-board').on("click", ".node", function() {
        if (gameOver) return; // Ignore clicks when the game is over

        let id = $(this).attr("id");
        let node = document.getElementById(id);

        if (node.classList.contains("node-f")) {
            endGame(level);
            startButton.show();
            gameOver = true;
            return;
        }

        node.className = "node-clicked"; // Change class to indicate node has been clicked
        node.innerText = (0).toString();

        // Check if all nodes have been clicked
        if ($('.node-t').length === 0) {
            level++;
            firstNodeClicked = false;
            // End game if max score beat
            if (level > numNodes) {
                endGame(level);
                startButton.show();
                return;
            }
            playLevel(defaultBoard.slice());
        }
    });
});

function startGame() {
    resetAll();
    let roll = defaultBoard.slice();
    // Template the blank nodes before starting game loop
    emptyBoard(defaultBoard);
    playLevel(roll);
}

/* Main game loop */
function playLevel(nodeNums) {
    let rollCopy = nodeNums.slice();
    let nextNodeOrder = generateNextLevel(level, rollCopy);
    nodeOrder = nextNodeOrder;
    renderLevelBoard(nextNodeOrder);
}

/* Game helper functions */
function generateNextLevel(levelNum, nodeNums) {
    emptyBoard(defaultBoard);
    let nodesToRender = [];
    // Randomly determine which nodes will be part of the level
    for (let i = 0; i < levelNum; i++) {
        let index = Math.floor(Math.random() * nodeNums.length);
        nodesToRender.push(nodeNums[index]);
        // Remove already added nodes from being rolled again
        nodeNums.splice(index, 1);
    }
    return nodesToRender;
}




function renderLevelBoard(boardNodes) {
    for (let i = 0; i < boardNodes.length; i++) {
        let boardNode = document.getElementById(boardNodes[i].toString());
        let originalClass = boardNode.className; // Store the original class name

        // Set the initial class and text content
        boardNode.className = "node node-t-alternate";
        boardNode.innerText = (i + 1).toString();

        // Disable click events for the first second
        boardNode.style.pointerEvents = "none";

        // Switch colors after a delay
        setTimeout(function() {
            // Toggle between two classes to switch colors
            if (boardNode.classList.contains("node-t-alternate")) {
                boardNode.classList.remove("node-t-alternate");
                boardNode.classList.add("node-t");
            } else {
                boardNode.classList.remove("node-f");
                boardNode.classList.add("node-t");
            }

            // Re-enable click events after switching colors
            boardNode.style.pointerEvents = "auto";
        }, 1 * 1000); // Switch colors after 1 second       
    }
}


function emptyBoard(board) {
    let templateString = "";
    let gameBoard = document.getElementById("game-board");
    let gameMessage = document.getElementById("game-message");

    for (let i = 0; i < board.length; i++) {
        templateString += "<button class=\"node node-f\" id=" + (i + 1) + "> 0 </button>";
    }
    gameBoard.innerHTML = templateString;
    gameMessage.innerHTML = "";
}

function endGame(score) {
    let gameBoard = document.getElementById("game-board");
    let gameMessage = document.getElementById("game-message");

    gameBoard.innerHTML = "";
    if (score > 25) {
        gameMessage.innerHTML =
            "<h2> You have reached the maximum score of " + (score - 1).toString() + "</h2>";
    } else {
        gameMessage.innerHTML =
            "<h2> Your score is " + (score - 1).toString() + ". Try again to beat your score! </h2>";
    }
}

function resetAll() {
    nodeOrder = [];
    currentOrder = 0;
    level = 2;
    gameOver = false;
    firstNodeClicked = false;
}