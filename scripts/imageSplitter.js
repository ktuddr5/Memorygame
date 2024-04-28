/*/ Define an array of image paths
var imagePaths = [
    'MMM_IMAGES/AnimalsC/Chicken_C_up.png',
    'MMM_IMAGES/AnimalsC/Panda_C_up.png',
    'MMM_IMAGES/AnimalsC/Pig_C_up.png',
    'MMM_IMAGES/AnimalsC/Squirrel_C_up.png',
    'MMM_IMAGES/AnimalsC/Woodpecker_C_up.png',
    'MMM_IMAGES/FoodC/Broccoli_C_up.png',
    'MMM_IMAGES/FoodC/Donut_C_up.png',
    'MMM_IMAGES/FoodC/Kiwi_C_up.png',
    'MMM_IMAGES/FoodC/Pear_C_up.png',
    'MMM_IMAGES/FoodC/Pizza_C_up.png',
    'MMM_IMAGES/ObjectsC/Magnet_C_up.png',
    'MMM_IMAGES/ObjectsC/Pencil_C_up.png',
    'MMM_IMAGES/ObjectsC/Ping_Pong_C_up.png',
    'MMM_IMAGES/ObjectsC/Screwdriver_C_up.png',
    'MMM_IMAGES/ObjectsC/Skull_C_up.png'
];

// Load and split each image
imagePaths.forEach(function(path, index) {
    var image = new Image();
    image.src = path;
	
    image.onload = function() {
        // Determine the dimensions of the image
        var imageWidth = image.width;
        var imageHeight = image.height;
        // Define the number of rows and columns for splitting the image
        var numRows = 4;
        var numCols = 4;
        // Calculate the dimensions of each part
        var partWidth = imageWidth / numCols;
        var partHeight = imageHeight / numRows;
        // Create HTML elements for each part and display them
        var imagePartsContainer = document.createElement('div');
        imagePartsContainer.id = 'imageParts_' + index;
        document.body.appendChild(imagePartsContainer);
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                var canvas = document.createElement('canvas');
                canvas.width = partWidth;
                canvas.height = partHeight;
                var context = canvas.getContext('2d');
                context.drawImage(image, col * partWidth, row * partHeight, partWidth, partHeight, 0, 0, partWidth, partHeight);
                var img = document.createElement('img');
                img.src = canvas.toDataURL();
                img.alt = 'Part ' + (row * numCols + col + 1);
                img.classList.add('part');
                imagePartsContainer.appendChild(img);
            }
        }
    };
	image.onload = function() {
    // Determine the dimensions of the image
    var imageWidth = image.width;
    var imageHeight = image.height;
    // Define the number of rows and columns for splitting the image
    var numRows = 4;
    var numCols = 4;
    // Calculate the dimensions of each part
    var partWidth = imageWidth / numCols;
    var partHeight = imageHeight / numRows;
    // Get the container element
    var container = document.getElementById('imagePartsContainer');
    // Loop through each row and column to generate image parts
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
            // Create a new canvas element for each part
            var canvas = document.createElement('canvas');
            canvas.width = partWidth;
            canvas.height = partHeight;
            var context = canvas.getContext('2d');
            // Draw the corresponding part of the image onto the canvas
            context.drawImage(image, col * partWidth, row * partHeight, partWidth, partHeight, 0, 0, partWidth, partHeight);
            // Create an img element to display the part
            var img = document.createElement('img');
            img.src = canvas.toDataURL();
            img.alt = 'Part ' + (row * numCols + col + 1);
            // Append the img element to the container
            container.appendChild(img);
        }
    }
};
});


// Function to generate pixel arrays for multiple 16x16 images
function getPixelArraysFor16x16Images(imagePaths16, callback) {
    var pixelArrays = [];

    // Counter to keep track of how many images have been processed
    var imagesProcessed = 0;

    // Function to process each image
    function processImage(imagePath, index) {
        var image = new Image();
        image.src = imagePath;

        image.onload = function() {
            // Create a canvas element
            var canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            var context = canvas.getContext('2d');

            // Draw the image onto the canvas at the smaller size
            context.drawImage(image, 0, 0, 16, 16);

            // Get the pixel data from the canvas
            var imageData = context.getImageData(0, 0, 16, 16);
            var pixelData = imageData.data;

            // Convert pixel data to a 2D array
            var pixelArray = [];
            for (var i = 0; i < 16; i++) {
                pixelArray[i] = [];
                for (var j = 0; j < 16; j++) {
                    var pixelIndex = (i * 16 + j) * 4;
                    // Assuming RGBA format, get the grayscale value of the pixel
                    var grayscale = (pixelData[pixelIndex] + pixelData[pixelIndex + 1] + pixelData[pixelIndex + 2]) / 3;
                    pixelArray[i][j] = grayscale;
                }
            }

            // Store the pixel array in the result array
            pixelArrays[index] = pixelArray;

            // Increment the counter of processed images
            imagesProcessed++;

            // Check if all images have been processed
            if (imagesProcessed === imagePaths16.length) {
                // Call the callback function with the array of pixel arrays
                callback(pixelArrays);
            }
        };
    }

    // Process each image in the array
    imagePaths16.forEach(function(imagePath, index) {
        processImage(imagePath, index);
    });
}

// Example usage:
var imagePaths16 = [
    'MMM_IMAGES/AnimalsC/Chicken_C.png',
    'MMM_IMAGES/AnimalsC/Panda_C.png',
    'MMM_IMAGES/AnimalsC/Pig_C.png',
    'MMM_IMAGES/AnimalsC/Squirrel_C.png',
    'MMM_IMAGES/AnimalsC/Woodpecker_C.png',
    'MMM_IMAGES/FoodC/Broccoli_C.png',
    'MMM_IMAGES/FoodC/Donut_C.png',
    'MMM_IMAGES/FoodC/Kiwi_C.png',
    'MMM_IMAGES/FoodC/Pear_C.png',
    'MMM_IMAGES/FoodC/Pizza_C.png',
    'MMM_IMAGES/ObjectsC/Magnet_C.png',
    'MMM_IMAGES/ObjectsC/Pencil_C.png',
    'MMM_IMAGES/ObjectsC/Ping_Pong_C.png',
    'MMM_IMAGES/ObjectsC/Screwdriver_C.png',
    'MMM_IMAGES/ObjectsC/Skull_C.png'
];

getPixelArraysFor16x16Images(imagePaths16, function(pixelArrays) {
    console.log(pixelArrays); // Output the array of pixel arrays to the console
    // You can do further processing with the array of pixel arrays here...
});

*/
