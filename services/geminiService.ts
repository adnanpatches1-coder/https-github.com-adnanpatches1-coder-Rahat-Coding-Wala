import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the AI assistant for "Rahat Coding Wala", a platform dedicated to education, coding, and technology.
Your core mission is to assist users with information about AI, technology, coding questions, and the educational resources provided by Rehan Allahwala.

Key Information about this App:
1. **Name**: Rahat Coding Wala
2. **Contact Number**: 03703210014 (Available for Phone calls & WhatsApp).
3. **Key Figure**: Rehan Allahwala (Technology Educator & Digital Innovator).

Available Books by Rehan Allahwala (users can find them in the "Rehanallah Books" section):
1. **AI Computer Communication Literacy - Book One**: A comprehensive guide to modern literacy.
2. **Coding with AI - Book One**: For ages 9+, learning to code with AI assistance.
3. **Coding with AI - Book Two**: Advanced concepts for young learners (Ages 9+).
4. **Rehan School Level One - Work Book B**: Official workbook for Rehan School curriculum.

Behavior Guidelines:
- Be polite, encouraging, and educational.
- If asked about the books, provide the descriptions above and encourage them to check the "Rehanallah Books" section.
- If asked for contact info or WhatsApp, provide the number 03703210014.
- Answer general questions about AI, coding, and technology.
- If the user provides an image (like a homework question or code snippet), analyze it and solve it step-by-step.
- Keep responses concise and easy to understand.
`;

export const sendMessageToGemini = async (prompt: string, imageBase64?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let contents: any = prompt;

    // Handle Multimodal input (Text + Image)
    if (imageBase64) {
      // Extract the base64 data if it includes the data URL prefix
      const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;

      contents = {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          { text: prompt || "Analyze this image and answer any questions found within it." }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Sorry, I am having trouble connecting to the server right now. Please try again later.";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const editImageWithPrompt = async (imageBase64: string, prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extract base64 data
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    // We use gemini-2.5-flash-image which supports image editing via prompting
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          { text: `Change the person's hairstyle to: ${prompt}. Keep the face features, skin tone, and background exactly the same as the original image. Ensure the hair looks realistic and fits the head naturally.` },
        ],
      },
    });

    // Check for image in response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           // Default to png if mimeType is missing, though usually provided
           const mimeType = part.inlineData.mimeType || 'image/png';
           return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    return null;
  }
};

export const generateVideo = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Enhance prompt for 3D results
  const enhancedPrompt = `Cinematic 3D render, high quality animation: ${prompt}`;

  let operation;

  try {
    // Using Veo fast model for quicker previews
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: enhancedPrompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
  } catch (error: any) {
    // Check for Veo 404 error specifically to handle it gracefully without spamming error logs
    const isVeo404 = error?.error?.code === 404 || 
                     error?.status === 404 || 
                     (typeof error?.message === 'string' && error.message.includes("404")) ||
                     (typeof error?.message === 'string' && error.message.includes("NOT_FOUND"));

    if (isVeo404) {
         console.warn("Veo API 404: Authorization/Model access issue detected. Triggering re-auth flow.");
    } else {
         console.error("Veo API request failed:", error);
    }
    
    let errorMsg = "Video generation failed";
    
    // Handle the specific object structure: {"error":{"code":404,"message":"...","status":"NOT_FOUND"}}
    if (error?.error?.message) {
        errorMsg = error.error.message;
    } else if (error?.message) {
        // Sometimes the SDK wraps the JSON in an Error object's message
        errorMsg = error.message;
        try {
            const parsed = JSON.parse(errorMsg);
            if (parsed.error?.message) {
                errorMsg = parsed.error.message;
            }
        } catch (e) {
            // Not JSON, keep original message
        }
    } else {
        // Fallback for unknown objects
        try {
            errorMsg = JSON.stringify(error);
        } catch (e) {
            errorMsg = "Unknown error occurred";
        }
    }
    
    // Explicitly identify the 404 error that requires Key Selection
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("NOT_FOUND")) {
        throw new Error("VeoModelError: Authorization failed. Please select a valid API Key from a paid project.");
    }
    
    throw new Error(errorMsg);
  }

  // Polling loop to wait for video generation
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    try {
      operation = await ai.operations.getVideosOperation({operation: operation});
    } catch (pollError: any) {
      console.error("Polling error:", pollError);
      let msg = pollError?.message || "Unknown polling error";
      try {
         const parsed = JSON.parse(msg);
         if (parsed.error?.message) msg = parsed.error.message;
      } catch {}
      
      throw new Error(`Error while checking video status: ${msg}`);
    }
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    throw new Error("Video generation completed but no video URI was returned.");
  }

  // Fetch the actual video content securely using the API Key
  // Ensure we append the key correctly whether query params exist or not
  const separator = downloadLink.includes('?') ? '&' : '?';
  const response = await fetch(`${downloadLink}${separator}key=${process.env.API_KEY}`);
  
  if (!response.ok) {
    // If response is 404/403, it might be an API key issue which the UI can handle
    throw new Error(`Failed to download video: ${response.status} ${response.statusText} - Requested entity was not found.`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const searchMapLocations = async (prompt: string): Promise<{ text: string, locations: any[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // We can add location hint if needed, but for general "Karachi" query, the prompt is enough.
      },
    });

    const text = response.text || "Found some locations for you.";
    
    // Extract map chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const locations = chunks
      .filter((chunk: any) => chunk.web?.uri || chunk.web?.title) // Some chunks might be web, but Maps tool usually returns map-compatible data
      .map((chunk: any) => ({
        title: chunk.web?.title || "Location",
        uri: chunk.web?.uri || "#"
      }));
      
    // Note: The SDK returns `web` objects in groundingChunks even for Maps grounding in some versions, 
    // or specific `maps` objects. Let's handle both.
    
    const mapLocations: any[] = [];
    
    chunks.forEach((chunk: any) => {
        if (chunk.maps) {
             mapLocations.push({
                 title: chunk.maps.title || "Map Location",
                 uri: chunk.maps.uri,
                 source: "maps"
             });
        } else if (chunk.web && (chunk.web.uri.includes("google.com/maps") || chunk.web.uri.includes("maps.google.com"))) {
             mapLocations.push({
                 title: chunk.web.title || "Location",
                 uri: chunk.web.uri,
                 source: "web"
             });
        }
    });

    return { text, locations: mapLocations };
  } catch (error) {
    console.error("Error searching maps:", error);
    throw new Error("Failed to search locations.");
  }
};

export const generateBusinessIdeas = async (topic: string): Promise<any[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional branding consultant. Generate 8 creative, memorable, and available-sounding business names for the following business idea/description: "${topic}".
      
      For each name, provide a short, catchy slogan (max 5 words).
      
      Return ONLY a JSON array with objects containing "name" and "slogan". 
      Example: [{"name": "TechFlow", "slogan": "Innovation in Motion"}, {"name": "GreenLeaf", "slogan": "Nature's Best"}]
      Do not add markdown code blocks.`,
    });

    let text = response.text || "[]";
    // Sanitize in case model adds markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON", e);
      return [];
    }
  } catch (error) {
    console.error("Error generating business names:", error);
    throw error;
  }
};