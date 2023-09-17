function extractTextChunks(text) {
    const numberedSections = text.split(/\d+\./); // Split the text by numbered sections
    const chunks = [];
  
    for (let i = 0; i < numberedSections.length; i++) {
      const section = numberedSections[i].trim();
      if (section) {
        chunks.push(section);
      }
      if (chunks.length === 8) {
        break; // Stop when 9 chunks are collected
      }
    }
  
    // Ensure there are exactly 9 chunks
    if (chunks.length !== 8) {
      throw new Error('Text does not contain 9 chunks.');
    }

    // Remove the first chunk and discard it
    // chunks.shift();
  
    return chunks;
  }
  
  // Define the text here
  const text = `
  1. **Sunny Suburban Neighborhood:** In a picturesque suburban neighborhood, the scene is bathed in warm, golden sunlight. Colorful houses with charming architecture line the peaceful streets. Vibrant gardens burst with flowers of every hue, while tall, leafy trees provide pockets of shade. The sky is a brilliant blue canvas with fluffy white clouds.
  
  2. **Sarah Playing in Front Yard:** Sarah, a bright-eyed and rosy-cheeked young girl, stands in her neatly manicured front yard. She wears a playful summer dress and a wide-brimmed hat, casting a playful shadow. Her front yard is adorned with toys like a red ball, a skipping rope, and a teddy bear.
  
  3. **Realization of Missing Kitten:** A sense of worry creases Sarah's face as her eyes widen with realization. Her body language changes from carefree to alert. She clutches the handle of her toy wagon, her knuckles turning white, as she scans the yard for any sign of her beloved kitten, Whiskers.
  
  4. **Search for Whiskers:** Sarah takes her first steps towards the unknown, her determination evident. She calls out "Whiskers!" with a hint of desperation in her voice, standing at the gate of her yard, peering into the suburban landscape. Her path is lined with flowers and picket fences.
  
  5. **Discovery of Whiskers:** The scene shifts to a neighbor's garden, where the sun casts long shadows. Sarah's focused gaze lands on a vivid orange spot under a lush green bush. Whiskers, with wide, fearful eyes and fluffy fur, crouches in the dappled shade, blending with the foliage.
  
  6. **Reunion with Whiskers:** In a tender moment, Sarah bends down, extending her arms towards Whiskers, her eyes filled with relief and love. Whiskers, now relaxed and purring contentedly, nuzzles against Sarah's chest, their faces illuminated by the soft, filtered sunlight.
  
  7. **Comforting Whiskers:** Sarah's arms cradle Whiskers gently yet securely, her fingers running through his soft fur. Her face, with a gentle smile, leans close to his, murmuring comforting words. Whiskers closes his eyes, his tension melting away.
  
  8. **Return Home:** Sarah and Whiskers make their way back home. They stand at their front yard gate, with Whiskers perched on Sarah's shoulder. Their bond is palpable, and their playtime awaits as they share a peaceful moment in the sun-drenched suburban paradise.
  `;
  
  // Extract text chunks
  // const chunks = extractTextChunks(text);
  
  // // Print each chunk
  // chunks.forEach((chunk, index) => {
  //   console.log(`Chunk ${index }: ${chunk}`);
  // });
  
  module.exports = extractTextChunks; // Export the function
