const OpenAI = require("openai");
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateChatGPTResponse(prompt) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "user", "content": prompt},
      ],
    });
    
    const story = chatCompletion.choices[0].message.content;
    // console.log(story);
    return story;
  } catch (error) {
    console.error('Error generating story:', error);
  }
}

module.exports = generateChatGPTResponse; // Export the function

// Example usage
// const userPrompt = "Write a 50 word story about a girl walking her dog!";
// generateChatGPTResponse(userPrompt);
