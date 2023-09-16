const generateChatGPTResponse = require('./gptprompt.js');
const extractTextChunks = require('./extracttext.js');


async function extractPanels(story, rawCharacters) {
  
  // PARSE CHARACTERS INTO STRING DATA
  const charactersPrompt = 
    `You are a helpful bot that takes a paragraph describing characters and outputs organized data about each character. 
     Identify the name of each character in the paragraph and their description.
     Return the data in the form below
     "Character Name: Description"
     For example: Andrew is a college student.
     "Andrew: college student"

    The character paragraph is: ` + rawCharacters;

  const parsedCharacters = await generateChatGPTResponse(charactersPrompt);
  // console.log(parsedCharacters);
  // console.log("\n");

  // PARSE CHARACTERS STRING DATA INTO DICTIONARY
  var charactersDict = {};
  var lengthOfDescs = 0;

  console.log(story);
  console.log(rawCharacters);
  var lines = parsedCharacters.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var name_data = lines[i].split(": ");
    charactersDict[name_data[0]] = name_data[1];
    lengthOfDescs += parseInt(name_data[1].length);
  }
  console.log(charactersDict);
  console.log("\n");
  

  // GENERATE 8 STORY BULLET POINTS
  const max_chars = 256 - lengthOfDescs - 75;
  
  const storyPrompt = 
    `You are a helpful bot that takes a story and generates 8 key points. 
    Choose 8 points that would make a good story and be easily drawn for a comic book written for children.
    When writing the points, write them as a description of a comic book image. 
    When referring to a character, refer to them by their name every single time. Do NOT use pronouns."
    Don't say anything else but 8 numbered pts and use simple language. 
    Only include information given in the story.
    DO NOT USE MORE THAN: ` + max_chars + ` NUMBER OF CHARACTERS PER BULLET POINT.

    Format example: 
    "1. The girl ran down the street
     2. The boy ran up the street"

    The story is as follows: ` + story;
  

  const rawDescription = await generateChatGPTResponse(storyPrompt);
  // console.log(rawDescription);
  // console.log("\n");

  // PARSE STORY INTO A STRING WITH CHARACTER DESCRIPTIONS

  var descriptionString = "";

  var words = rawDescription.split(" ");
  for (var i = 0; i < words.length; i += 1) {
    descriptionString += words[i];
    var wordModified = words[i].replace(/[^A-Za-z0-9]/g, '');

    if (wordModified in charactersDict) {
      descriptionString += " " + charactersDict[wordModified];
    } 
    descriptionString += " "
  }
  
  console.log("descriptionString");
  console.log(descriptionString);
  console.log("\n");

  // PARSE STORY INTO A ARRAY WITH CHARACTER DESCRIPTIONS
  
  var descriptionArray = []
  
  var lines = descriptionString.split("\n");
  for (var i = 0; i < lines.length; i++) {
    descriptionArray.push(lines[i]);
  }

  console.log("descriptionArray");
  console.log(descriptionArray);
  console.log("\n");

  // RUN THE DIALOGUE PROMPT

  const dialoguePrompt = 
  `You are a helpful robot that takes 8 bullet points telling a story and creates comic book style bullet points.
   Each bullet point is a description of an image.
   Write MAXIMUM five words to pair with each bullet point as if it was a comic book.
   If the image is easily understood without words write "Dialogue: NULL".
   Pretend to be speaking from the point of view of a character OR make a sound effect OR exclamation.
   For example: "I found you!" or "Wow!" or "BANG!" or "CRASH" or "Where is he?"
   Return the data in the following form:
   "Image: value
    Dialogue: value".
    Do not include any "" in the return value.

   The bullet points are as follows` + descriptionString;

  const rawDialogue = await generateChatGPTResponse(dialoguePrompt);

  // console.log("rawDialogue:")
  // console.log(rawDialogue);
  // console.log("\n")

  // PARSE THE DIALOGUE INTO AN ARRAY

  var dialogueArray = [];
  
  lines = rawDialogue.split("\n");
  var i = 0;
  for (var i = 0; i < lines.length; i++) {
    const words = lines[i].split(" ");
    var longestLength = 0;
    if (words[0] == "Dialogue:") {
      dialogue = "";
      for (var j = 1; j < words.length; j++) {
        if (words[j] != "") {
         dialogue += words[j] + " ";
         if (words[j].length > longestLength) {
          longestLength = words[j].length;
         }
        }

        if (words[j] == "NULL") {
          longestLength = 0;
        }
      }
      dialogueArray.push([dialogue, longestLength]);
    }
  }

  console.log("DIALOGUE");
  console.log(dialogueArray);
  console.log("\n");

  // You can also extract text chunks here if needed
  // const chunks = extractTextChunks(originalPoints);
  //console.log(chunks);

  // return chunks;
  return [descriptionArray, dialogueArray];
}

module.exports = { extractPanels };


const story1 = `
In a sunny, peaceful suburban neighborhood filled with colorful houses and lush gardens, 
Sarah, a kind-hearted young girl, was playing in her front yard when she suddenly realized 
her fluffy orange kitten, Whiskers, was missing. Her heart filled with worry, she embarked 
on a search throughout the neighborhood, calling out Whiskers' name. Her determined quest 
led her to discover Whiskers hiding under a bush in a neighbor's garden, frightened by a loud noise. 
With gentle coaxing, Sarah reunited with her beloved pet, and Whiskers purred happily 
in recognition. Cradling Whiskers in her arms, Sarah comforted him with soft words 
as they made their way back home. Together, they returned to their front yard, 
continuing their playtime, their bond stronger than ever.
`;

const superRaw = "Sarah is a kind hearted young girl. Whiskers is a fluffy orange cat.";


//extractPanels(story1, superRaw);