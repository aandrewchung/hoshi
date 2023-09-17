const pdf2img = require('pdf-img-convert');
const fs = require('fs');

async function convertPdfToImage(inputPdfPath, outputImagePath) {
    // Define conversion options
    const conversionOptions = {
        width: 1042, // Set the desired width in pixels
        height: 2084,
        base64: false, // Set to true if you want base64-encoded output
        scale: 1.0, // Set the viewport scale ratio
    };


    try {
        const pdfArray = await pdf2img.convert(inputPdfPath, conversionOptions);
        fs.writeFile(outputImagePath, pdfArray[0], function (error) {
            if (error) {
                console.error("Error: " + error);
            } else {
                console.log(`PDF converted to image and saved to ${outputImagePath}`);
            }
        });
    } catch (error) {
        console.error("Error: " + error);
    }
}

// Usage example:
// const inputPdfPath = 'C:\\Users\\andro\\Documents\\spaceme\\pdfs\\output0.pdf'; // Correct input PDF file path
// const outputImagePath = 'images/comics/0.png'; // Specify your desired output image file path

// convertPdfToImage(inputPdfPath, outputImagePath);

module.exports = { convertPdfToImage };
