const fs = require('fs').promises;
const { PDFDocument , rgb} = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit')

// Function to load an image from a file
async function loadImage(imagePath) {
  const imageBytes = await fs.readFile(imagePath);
  return imageBytes;
}

// Function to create a PDF with images in a grid layout on a single page
async function createVerticalPDF(imagePaths, outputPath, dialogues, title) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit)
  const fontBytes = await fs.readFile('../spaceme/images/CC Wild Words Roman.ttf');
  const mangaFont = await pdfDoc.embedFont(fontBytes);
  const pageWidth = 250; // Square page dimensions
  const pageHeight = 500;
  const imageWidth = (pageHeight / 5) * 1.05; // Scale down to 90%
  const imageHeight = (pageHeight / 5) * 1.05; // Scale down to 90%
  const borderSize = 1.2 // Size of the black border
  const horizontalGap = (pageWidth - (2 * imageWidth)) / 3; // Horizontal gap between images
  const verticalGap = (pageHeight - (4 * imageHeight)) / 5 * 0.5; // Vertical gap between images
  // const verticalTopTitle = 30;
  const verticalTopTitle = pageHeight - (4 * (imageHeight + 2 *borderSize) + 3*verticalGap) - horizontalGap;
  const textSize = 4.5;


  // const captionPath = '';
  // const captionBytes = await loadImage(captionPath);
  // const caption = await pdfDoc.embedPng(captionBytes);
  // console.log(verticalTopTitle);
  // console.log(horizontalGap, verticalGap);
  // console.log(imageWidth)

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const imageBytes = await loadImage(imagePath);
    const image = await pdfDoc.embedJpg(imageBytes);

    //Grab corresponding dialogue for image i
    var dialogue;
    //Largest string:
    var largest;
    [dialogue, largest]= dialogues[i];
    const diaLength = dialogue.length;
    //Convert string into multiline string, dialogue is the string, n is numlines
    const dInfo = await prepString(dialogue, largest);
    dialogue = dInfo[0];
    const n = dInfo[1];

    var textType = 0;
    //No text
    if (largest == 0){
      textType = 0
    }
    //Short string
    else if(diaLength <= 10){
      //Length 1 gets 1 or 2
      textType = 1;
      textType += Math.floor(Math.random()*2);
    }
    //Bubbles 5, 6 (smaller medium)
    else if(largest < 5){
      textType = 5;
      textType += Math.floor(Math.random()*2);
    }
    //Bubbles 3, 4 (bigger medium)
    else if(largest <= 7){
      textType = 3;
      textType += Math.floor(Math.random()*2);
    }
    //Bubbles 
    else if(largest <= 9){
      textType = 7;
      textType += Math.floor(Math.random()*4);
    }
    else{
      textType = 11;
      textType += Math.floor(Math.random()*2);
    }

    const bubblePath = `../spaceme/images/bubbles/textBubble${textType}.png`;
    const bubbleBytes = await loadImage(bubblePath);
    const bubble = await pdfDoc.embedPng(bubbleBytes);
    // Calculate x and y coordinates based on the grid layout with gaps
    const row = Math.floor(i /2); // Two images per row
    const col = i % 2; // Two columns

    const x = col * (imageWidth + verticalGap) + horizontalGap + 1.5*borderSize; // Add horizontal gap between images
    const y = pageHeight - verticalTopTitle - (row + 1) * (imageHeight + verticalGap); // Start from the top, add vertical gap between rows

    page.drawRectangle({
      x: x - 0.5 * borderSize,
      y: y - 0.5 * borderSize,
      width: imageWidth + 1 * borderSize,
      height: imageHeight + 1 * borderSize,
      borderWidth: borderSize, // Border width
      borderColor: rgb(0, 0, 0), // Black border color
      color: rgb(1, 1, 1), // Fill color (white)
      opacity: 1, // Opacity of the fill color
      borderOpacity: 1, // Opacity of the border
    });

    // Draw the image inside the border
    page.drawImage(image, {
      x: x,
      y: y,
      width: imageWidth,
      height: imageHeight,
    });

    //Draw text bubbles or captions on every image
    //Caption
    // if (textType == 0){
    //   page.drawImage(bubble, {
    //     x: x,
    //     y: y - 30,
    //     width: 110,
    //     height: 110,
    //   });
    //   textX = x;
    //   textY = y - 10;
    //   textWidth = 90;
    //   textHeight = 90;
    // }
    //Floating Small
    if (textType == 1){
      page.drawImage(bubble, {
        x: x + 36,
        y: y,
        width: 120,
        height: 120,
      });    
      textX = x + 82;
      textY = await findStartVal(y + 90, y, textSize, n);
    }
    else if (textType == 2){
      page.drawImage(bubble, {
        x: x - 40.5,
        y: y,
        width: 120,
        height: 120,
      });    
      textX = x + 1;
      textY = await findStartVal(y + 90, y, textSize, n);
    }
    //Medium
    else if (textType == 3){
      page.drawImage(bubble, {
        x: x + 24,
        y: y - 40,
        width: 120,
        height: 120,
      });    
      textX = x + 75;
      textY = await findStartVal(y + 35, y, textSize, n);
    }
    else if (textType == 4){
      page.drawImage(bubble, {
        x: x - 40.5,
        y: y - 40,
        width: 120,
        height: 120,
      });    
      textX = x + 1;
      textY = await findStartVal(y + 35, y, textSize, n);
    }
    //Large
    else if(textType == 5){
      page.drawImage(bubble, {
        x: x + 36,
        y: y - 37,
        width: 120,
        height: 120,
      });    
      textX = x + 82;
      textY = await findStartVal(y + 30, y, textSize, n);
    }
    else if(textType == 6){
      page.drawImage(bubble, {
        x: x - 40,
        y: y - 37,
        width: 120,
        height: 120,
      });    
      textX = x + 1;
      textY = await findStartVal(y + 30, y, textSize, n);
    }
    else if(textType == 7){
      page.drawImage(bubble, {
        x: x + 31,
        y: y - 37,
        width: 120,
        height: 120,
      });    
      textX = x + 78;
      textY = await findStartVal(y + 50, y, textSize, n);
    }
    else if(textType == 8){
      page.drawImage(bubble, {
        x: x - 40,
        y: y - 37,
        width: 120,
        height: 120,
      });    
      textX = x + 1;
      textY = await findStartVal(y + 50, y, textSize, n);
    }
    else if(textType == 9){
      page.drawImage(bubble, {
        x: x + 31,
        y: y - 38,
        width: 120,
        height: 120,
      });    
      textX = x + 80;
      textY = await findStartVal(y + 55, y, textSize, n);
    }
    else if(textType == 10){
      page.drawImage(bubble, {
        x: x - 43,
        y: y - 38,
        width: 120,
        height: 120,
      });    
      textX = x + 1;
      textY = await findStartVal(y + 55, y, textSize, n);
    }
    else if(textType == 11){
      page.drawImage(bubble, {
        x: x + 11,
        y: y - 30,
        width: 120,
        height: 120,
      });    
      textX = x + 45;
      textY = await findStartVal(y + 50, y, textSize, n);
    }
    else if(textType == 12){
      page.drawImage(bubble, {
        x: x - 25,
        y: y - 30,
        width: 120,
        height: 120,
      });    
      textX = x + 3;
      textY = await findStartVal(y + 50, y, textSize, n);
    }
    if(textType != 0){
      page.drawText(dialogue, {
        x: textX,
        y: textY,
        size: textSize,
        lineHeight: 8,
        opacity: 1,
        font: mangaFont
      })
    }
  }
  //Insert Logo Top left
  const logoPath = '../spaceme/images/logos/blacklogo.png';
  const pathBytes = await loadImage(logoPath);
  const logo = await pdfDoc.embedPng(pathBytes);

  page.drawImage(logo, {
    x: pageWidth/2 - 8,
    y: 0,
    height : 15,
    width : 15,
    opacity : 1
  })

  //Text Size calculation
  // var titleSize = 20;
  // while (mangaFont.widthOfTextAtSize(title, titleSize) > pageWidth - 80){
  //   titleSize -= 1;
  // }
  var titleSize = 15
  titleWidth = mangaFont.widthOfTextAtSize(title, titleSize);
  // titleX = (pageWidth - titleWidth - horizontalGap);
  titleX = horizontalGap
  //Insert Title
  page.drawText(title, {
    y: pageHeight - 30,
    x: titleX,
    size : titleSize,
    font : mangaFont
  })

  const pdfBytes = await pdfDoc.save();


  // Write the PDF to a file
  await fs.writeFile(outputPath, pdfBytes);
}




async function createHorizontalPDF(imagePaths, outputPath) {
  const pdfDoc = await PDFDocument.create();
  const pageWidth = 500; // Square page dimensions
  const pageHeight = 250;
  const imageWidth = (pageWidth / 5) * 1.05; // Scale down to 90%
  const imageHeight = (pageWidth / 5) * 1.05; // Scale down to 90%
  const borderSize = 2; // Size of the black border
  const horizontalGap = (pageWidth - (4 * imageWidth)) / 5 * 0.5; // Horizontal gap between images
  const verticalGap = (pageHeight - (2 * imageHeight)) / 3; // Vertical gap between images
  const horizontalLeftTitle = pageWidth - (4 * (imageWidth + 2 * borderSize) + 3 * horizontalGap) - verticalGap;

  const textSize = 20;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const imageBytes = await loadImage(imagePath);
    const image = await pdfDoc.embedJpg(imageBytes);
    let row = 0;
    let col = 0;
    // Calculate x and y coordinates based on the grid layout with gaps
    if (i < 4) {
      row = 1;
      col = i;
    } else {
      row = 0;
      col = i - 4;
    }
    // const row = ~(i % 2) + 2; // Two images per row
    // const col = Math.floor(i / 2); // Two columns
    // console.log(row, col);

    const calc = pageWidth - (3*(imageWidth + 4*borderSize) + horizontalLeftTitle + 2*borderSize + imageWidth) - verticalGap
    const x = col * (imageWidth + horizontalGap) + horizontalLeftTitle + borderSize +  calc; // Add horizontal gap between images
    const y = row * (imageHeight + horizontalGap) + verticalGap - (horizontalGap - verticalGap) / 2; // Start from the top, add vertical gap between rows
    // console.log(x, y);

    
    // Draw a black border around the image
    page.drawRectangle({
      x: x - 0.5 * borderSize,
      y: y - 0.5 * borderSize,
      width: imageWidth + 1 * borderSize,
      height: imageHeight + 1 * borderSize,
      borderWidth: borderSize, // Border width
      borderColor: rgb(0, 0, 0), // Black border color
      color: rgb(1, 1, 1), // Fill color (white)
      opacity: 1, // Opacity of the fill color
      borderOpacity: 1, // Opacity of the border
    });

    // Draw the image inside the border
    page.drawImage(image, {
      x: x,
      y: y,
      width: imageWidth,
      height: imageHeight,
    });

  }

  const pdfBytes = await pdfDoc.save();

  // Write the PDF to a file
  await fs.writeFile(outputPath, pdfBytes);
}

async function findStartVal(y1, y2, size, n) {
  const height = y1 - y2 + 15;
  const midpoint = height/2;
  const offset = size/2
  const start = y2 + midpoint + offset*n


  return start;
}


async function prepString(words, largest){
  var charCount = 0;
  var result = '';
  var n = 0;
  var returnList = []
  const wordsList = words.split(' ');
  for (const word of wordsList){
    // console.log(word);
    if (charCount + word.length <= largest + 1){
      result += (word + ' ');
      charCount += (word.length + 1)
    }
    else{
      result += '\n';
      result += (word + ' ');
      charCount = (word.length + 1);
      n += 1;
    }
  }
  returnList.push(result);
  returnList.push(n);
  return returnList
}



module.exports = { createVerticalPDF , createHorizontalPDF};

const imagePaths = [];
for (let i = 0; i < 32; i+=4) {
  imagePaths.push(`../spaceme/images/panels/${i}.jpeg`);
}
const dialogues = [
  [ 'NULL', 0 ],
  [ 'Oh no Whiskers!', 9 ],
  [ 'Whiskers, where are you?', 8 ],
  [ 'Ah, there you are!', 5 ],
  [ "Come on, Whiskers, it's okay", 8 ],
  [ 'Safe and sound, Whiskers.', 9 ],
  [ "It's alright, Whiskers.", 8 ],
  [ 'Happiness in our yard!', 9 ]
];
const verticalPath = 'pdfs/output0.pdf';
const horizontalPath = 'pdfs/output1.pdf';

// createVerticalPDF(imagePaths, verticalPath, dialogues, 's Sample Title')
//   .then(() => console.log('Vertical PDF created successfully'))
//   .catch((err) => console.error('Error creating PDF:', err));
// createHorizontalPDF(imagePaths, horizontalPath)
//   .then(() => console.log('Horizontal PDF created successfully'))
//   .catch((err) => console.error('Error creating PDF:', err));