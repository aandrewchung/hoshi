import { generateImageFiles, generateImagesLinks } from "bimg";
import { convertAndSaveImage } from './convertimagedata.js';
import { extractPanels } from './storytopanels.js';
import { createVerticalPDF, createHorizontalPDF } from './imagetopdf.js';
import fs from 'fs';
import { convertPdfToImage } from './pdftocomic.js';


async function main(title, characters, story) {
    try {
        const temp = await extractPanels(story, characters);
        const panels = temp[0];
        const quotes = temp[1];
        let count = 0;
        let originalCount;

        // Loop through each panel and create a separate prompt for each
        for (let i = 0; i < panels.length; i++) {
            originalCount = count;
            const panelContent = panels[i]; // Assuming each panel's content is stored in an array
            const prompt = `Anime manga-style: ${panelContent}`;

            // Use 'prompt' for further processing (e.g., sending it to the AI model)
            console.log(prompt);

            // Remove special characters and replace with spaces
            const cleanPrompt = prompt.replace(/[^\w\s]/g, ' ');

            let imageFiles;

            while (!imageFiles) {
                try {
                    imageFiles = await generateImageFiles(cleanPrompt); // Try to generate image files
                } catch (error) {
                    console.error("Error generating image files:", error);
                    // Optionally, you can introduce a delay before trying again to avoid spamming the function
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
                }
            }
            // Loop through the image files and convert/save each one
            for (const imageFile of imageFiles) {
                convertAndSaveImage(imageFile, count);
                count++;
            }
            count = originalCount + 4;
        }

        const imagePaths = [];
        for (let group = 0; group < 8; group++) {
            const startIndex = group * 4;
            const randomIndex = Math.floor(Math.random() * 4); // Generate a random index from 0 to 3 within each group
            const randomImageIndex = startIndex + randomIndex;
            let imagePath = `images/panels/${randomImageIndex}.jpeg`;

            while (!fs.existsSync(imagePath)) {
                imagePath = `images/panels/${randomImageIndex-1}.jpeg`;
            }

            imagePaths.push(imagePath);
        }

        console.log(imagePaths);

        const verticalPath = 'pdfs/output0.pdf';
        const horizontalPath = 'pdfs/output1.pdf';

        await createVerticalPDF(imagePaths, verticalPath, quotes, title);
        console.log('Vertical PDF created successfully');

        await createHorizontalPDF(imagePaths, horizontalPath);
        console.log('Horizontal PDF created successfully');

    } catch (error) {
        console.error('An error occurred:', error);
    }
}


  


const story = `
In the final moments of the championship match, with the score tied and tension in the air, Andrew, a steadfast member of the soccer team, seized the opportunity of a lifetime. As the clock ticked down, he dribbled past defenders with unwavering determination, the ball seemingly an extension of his being. With a swift, precise strike, he sent the ball soaring into the net, igniting a deafening roar from the crowd. Andrew's last-minute goal secured victory, etching his name in soccer lore and crowning his team as tournament champions.

`;

const characters = "Andrew is a white haired male with blue eyes";

// main("test", characters, story);



  function readInputFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const dataArray = data.split(',');
  
      if (dataArray.length >= 3) {
        const title = dataArray[0].trim();
        const description = dataArray[1].trim();
        const story = dataArray.slice(2).map(item => item.trim()).join(',');
  
        return {
          title,
          description,
          story,
        };
      } else {
        throw new Error('Input file does not contain enough data.');
      }
    } catch (error) {
      console.error('Error reading input file:', error);
      return null;
    }
  }
  
  import path from 'path';
  import os from 'os';
  const downloadDirectory = path.join(os.homedir(), 'Downloads');
  let continueChecking = true; // Flag to control whether to continue checking or not


  async function checkForUpdates() {
    console.log("checking now");

    // Check if the file exists in the downloads directory
    const filePath = path.join(downloadDirectory, inputFile);

    try {


            await fs.promises.access(filePath, fs.constants.F_OK);
            // File exists, process it


            if (continueChecking) {
                continueChecking = false;
            console.log('File exists:', filePath);
    
            // Read and process the file
            const inputData = readInputFile(filePath);
            if (inputData) {
                console.log('Title:', inputData.title.length);
                console.log('Description:', inputData.description.length);
                console.log('Story:', inputData.story.length);
            }
    
            // File exists, print a message and stop checking
            console.log('Found it:', filePath);
    
            await main(inputData.title, inputData.description, inputData.story);
    
            const inputPdfPath = 'C:\\Users\\andro\\Documents\\hoshi\\pdfs\\output0.pdf'; // Correct input PDF file path
            const outputImagePath = 'images/comics/0.png'; // Specify your desired output image file path
    
            await convertPdfToImage(inputPdfPath, outputImagePath);
    
            console.log('PDF to Image conversion completed successfully');
            }


        // Stop checking for updates
    } catch (err) {
        // Handle errors here
        console.error('Error:', err);
    }
}

  
  const inputFile = '1.txt'; // Change this to the name of your file
  let lastModificationTime = null; // Initialize the last modification time
  
  // Call the checkForUpdates function every 2 seconds
  setInterval(checkForUpdates, 2000);
  
  
  // Check for updates every 2 seconds (adjust the interval as needed)
  const updateCheckInterval = setInterval(checkForUpdates, 7000);