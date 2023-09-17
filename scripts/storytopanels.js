const generateChatGPTResponse = require('./gpt.js');

async function parseCharacters(rawCharacters) {
  const charactersPrompt = `You are a helpful bot that takes a paragraph describing characters and outputs organized data about each character. 
    Identify the name of each character in the paragraph and their description.
    Return the data in the form below "Character Name: Description"
    For example: Andrew is a college student. "Andrew: college student"
    
    The character paragraph is: ${rawCharacters}`;
    
  const parsedCharacters = await generateChatGPTResponse(charactersPrompt);

  const charactersDict = {};
  let lengthOfDescs = 0;
  
  const lines = parsedCharacters.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const name_data = lines[i].split(": ");
    charactersDict[name_data[0]] = name_data[1];
    lengthOfDescs += parseInt(name_data[1].length);
  }
  
  return { charactersDict, lengthOfDescs };
}

async function parseStory(story, charactersDict, lengthOfDescs) {
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

  console.log("The descrpt string: ");
  console.log(descriptionString);
  console.log("\n");


  // PARSE STORY INTO A ARRAY WITH CHARACTER DESCRIPTIONS
  var descriptionArray = []
  
  var lines = descriptionString.split("\n");
  for (var i = 0; i < lines.length; i++) {
    descriptionArray.push(lines[i]);
  }

  return {descriptionString, descriptionArray}
}

async function parseDialogue(descriptionString) {
  // RUN THE DIALOGUE PROMPT

  const dialoguePrompt = 
  `You are a helpful robot that takes 8 bullet points telling a story and creates comic book style bullet points.
  Each bullet point is a description of an image.
  Write MAXIMUM four words to pair with each bullet point as if it was a comic book.
  If the image is easily understood without words write "Dialogue: NULL".
  Pretend to be speaking from the point of view of a character OR make a sound effect OR exclamation.
  For example: "I found you!" or "Wow!" or "BANG!" or "CRASH" or "Where is he?"
  Return the data in the following form:
  "Image: value
    Dialogue: value".
    Do not include any "" in the return value.

  The bullet points are as follows` + descriptionString;

  const rawDialogue = await generateChatGPTResponse(dialoguePrompt);
  console.log(rawDialogue);

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
    return dialogueArray;
}

async function extractPanels(story, rawCharacters) {
  const { charactersDict, lengthOfDescs } = await parseCharacters(rawCharacters);
  console.log(charactersDict);
  console.log("\n");
  
  const {descriptionString, descriptionArray} = await parseStory(story, charactersDict, lengthOfDescs);
  console.log("The descrp arr: ");
  console.log(descriptionArray);
  console.log("\n");
  
  const dialogueArray = await parseDialogue(descriptionString);
  console.log("DIALOGUE");
  console.log(dialogueArray);
  console.log("\n");

  return [descriptionArray, dialogueArray];
}

module.exports = { extractPanels };


const story = "At a Pittsburgh Hackathon, Judge John walks around a gymnasium full of computers and people. He sees a group of four college students: Aleks, Andrew, Hugo, and Eric. They created incredible manga comic book project. Hugo and Aleks tell John a story about their project. John looks at the computer and smiles at the amazing comic book. He gives Eric a big high five. Andrew, Hugo, Aleks, and Eric win the hackathon and celebrate.";

const chara = "John is a friendly man with gray hair and glasses. Aleks is a girl with short brown hair, Hugo is a tall boy with black curly hair, and Andrew is boy with short black hair, Eric is a boy in green hoodie.";

extractPanels(story, chara);