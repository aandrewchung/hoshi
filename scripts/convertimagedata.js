const fs = require('fs');
const path = require('path');

// Define a function to convert and save an image file
function convertAndSaveImage(imageFile, fileNumber) {
  const imageDataBuffer = Buffer.from(imageFile.data, 'base64');
  const outputDirectory = './images/panels'; // Define the output directory where you want to save the image
  const outputFileName = path.join(outputDirectory, `${fileNumber}.jpeg`); // Use the fileNumber parameter in the output file name

  fs.mkdirSync(outputDirectory, { recursive: true }); // Create the output directory if it doesn't exist

  fs.writeFile(outputFileName, imageDataBuffer, (err) => {
    if (err) {
      console.error(`Error writing ${outputFileName}:`, err);
    } else {
      console.log(`Image file saved as ${outputFileName}`);
    }
  });
}

module.exports = { convertAndSaveImage };
