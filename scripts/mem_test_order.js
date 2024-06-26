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
let leveltemp = 0;
let imagecoloring = 0;
var video = document.getElementById("videoPlayer");

//SOUND EFFECT
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }


// Given image
let image = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
];
// Split the image into 4x4 sections
const sections = splitImageIntoSections(image);
const unsorted = sections.slice();
    // Sort sections ascending
    sections.sort((a, b) => countOnes(a.data) - countOnes(b.data));


function splitGameField() {
    // Here you can write logic to split the game field into two sections
    // For example, you can create another <div> and append it to the main container
    // or you can modify the existing game field div to occupy only half of the width
}

$(document).ready(function() {
    let startButton = $("#start-button");
    let startButtonContainer = $("#start-button-container");
	
	
	
    // Hide "Start" button when pressed
    startButtonContainer.on("click", "#start-button", function() {
        startButton.hide();
        startGame();
    });
	
    // Handle clicks on the game board
    $('#game-board').on("click", function() {
        if (!gameOver) {
            startNextLevel(); // Start generating next level if game is not over
        }
    });

    /*
    Handle when a valid node is clicked. Delegate event to gameBoard div since
    templated elements don't have event handlers.
    */
   let orderMatters = true;


    $('#game-board').on("click", ".node", function() {
        if (gameOver) return; // Ignore clicks when the game is over
    
        let id = $(this).attr("id");
        let node = document.getElementById(id);
    

        //play sound effect
		var mySound = new sound("Media/Click.mp3");
		mySound.play();
        
        if (node.classList.contains("node-f")) {
            endGame(level);
            startButton.show();
            gameOver = true;
            return;
        }
    
        if (orderMatters) {
            // Check if the clicked node is the expected one in the correct order
            if (parseInt(id) === nodeOrder[currentOrder]) {
                node.className = "node-clicked"; // Change class to indicate node has been clicked
                node.innerText = (0).toString();
                currentOrder++; // Move to the next expected node
    
                // Check if all nodes have been clicked
                if (currentOrder === nodeOrder.length) {
                    video.play();
                    level++;
                    firstNodeClicked = false;
                    // End game if max score beat
                    if (level > numNodes) {
                        endGame(level);
                        startButton.show();
                        gameOver = true;
                        return;
                    }
                    playLevel(defaultBoard.slice());
                }
            } else {
                // End the game if the clicked node is not the expected one
                endGame(level);
                startButton.show();
                gameOver = true;
                return;
            }
        } else {
            // In the mode where order doesn't matter, simply check if the clicked node exists in the expected nodes
            if (nodeOrder.includes(parseInt(id))) {
                node.className = "node-clicked"; // Change class to indicate node has been clicked
                node.innerText = (0).toString();
    
                // Remove the clicked node from the list of expected nodes
                let index = nodeOrder.indexOf(parseInt(id));
                if (index !== -1) {
                    nodeOrder.splice(index, 1);
                }
    
                // Check if all nodes have been clicked
                if (nodeOrder.length === 0) {
                    level++;
                    firstNodeClicked = false;
                    // End game if max score beat
                    if (level > numNodes) {
                        endGame(level);
                        startButton.show();
                        gameOver = true;
                        return;
                    }
                    playLevel(defaultBoard.slice());
                }
            } else {
                // End the game if the clicked node is not in the expected nodes
                endGame(level);
                startButton.show();
                gameOver = true;
                return;
            }
        }
    });

    function startGame() {
        resetAll();
        let roll = defaultBoard.slice();
        // Template the blank nodes before starting game loop
        emptyBoard(defaultBoard);
        playLevel(roll);
    }
});

/* Main game loop */

function playLevel(nodeNums) {
    let rollCopy = nodeNums.slice();
    let nextNodeOrder = generateNextLevel(level, rollCopy);
    setTimeout(function() {     
        nodeOrder = nextNodeOrder;
        renderLevelBoard(nextNodeOrder);
    }, 2 * 1000);
}



function generateNextLevel(levelNum, nodeNums) {
    emptyBoard(defaultBoard);
    let nodesToRender = [];


    // Skip empty sections
    while (leveltemp < sections.length && countOnes(sections[leveltemp].data) === 0) {
        leveltemp++;
		imagecoloring++;
		adjustOpacityForCurrentPart(unsorted); // Pass the sections array as an argument
    }
	adjustOpacityForCurrentPart(unsorted); // Pass the sections array as an argument
    if (leveltemp < sections.length) {
        for (let y = 0; y < sections[leveltemp].data.length; y++) {
            for (let x = 0; x < sections[leveltemp].data[y].length; x++) {
                if (sections[leveltemp].data[y][x] === 1) {
                    nodesToRender.push(nodeNums[x + y * sections[leveltemp].data[y].length]);
                    levelNum--;
                }
            }
        }
        leveltemp++;
    }
	
	imagecoloring++;
    currentOrder = 0; // Reset currentOrder
	
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
            "<h2> Your current score is " + (score - 1).toString() + ". Continue? </h2>";
    }
}

function resetAll() {
    nodeOrder = [];
    currentOrder = 0;
    level = 2;
    gameOver = false;
    firstNodeClicked = false;
}


function splitImageIntoSections(image) {
    const sections = [];
    let partNumber = 1;

    // Iterate over the image in steps of 4 pixels both horizontally and vertically
    for (let y = 0; y < image.length; y += 4) {
        for (let x = 0; x < image[y].length; x += 4) {
            const section = [];

            // Extract a 4x4 section from the image
            for (let offsetY = 0; offsetY < 4; offsetY++) {
                const row = [];
                for (let offsetX = 0; offsetX < 4; offsetX++) {
                    // Handle edge case where the image dimensions might not be divisible by 4
                    const pixelValue = (image[y + offsetY] && image[y + offsetY][x + offsetX]) || 0;
                    row.push(pixelValue);
                }
                section.push(row);
            }
            
            // Push section along with part number to sections array
            sections.push({ part: "part" + partNumber, data: section });
            partNumber++;
        }
    }
    return sections;
}

function isEmptySection(section) {
    return section.every(row => row.every(pixel => pixel === 0));
}

function countOnes(section) {
    let count = 0;
    for (let row of section) {
        for (let pixel of row) {
            if (pixel === 1) {
                count++;
            }
        }
    }
    return count;
}

function adjustOpacityForCurrentPart(sections) {
    // Set the opacity of the current part being played to 0.1
    var currentPart = "part" + findCurrentNumber(); // Assuming nodeOrder holds the index of the current part being played
    var currentDiv = document.querySelector("." + currentPart);
    if (currentDiv) {
        // Find the section corresponding to the current part
        var section = sections.find(sec => sec.part === currentPart);
        if (section) {
            // If the section is found, set the opacity of the corresponding div
            currentDiv.style.opacity = 0.9;
        }
    }
}

function findCurrentNumber() {
	let CurrentNumber = 0;

	for(let i = 0; i < sections.length; i++)
	{
		if(sections[imagecoloring-1].part === unsorted[i].part)
		{
			return i+1;
		}
	}
	return CurrentNumber;
}