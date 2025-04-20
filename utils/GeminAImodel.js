import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use environment variable in real apps
const apiKey = "AIzaSyACSy1ZY24c0hJ2dPyR8Jcyj8641e7ATno";

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Get the model instance
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// === SINGLE PROMPT EXAMPLE ===
export const generateSimpleResponse = async (textPrompt) => {
  try {
    const result = await model.generateContent(textPrompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Generation Error:", error);
    return "Something went wrong.";
  }
};

// === CHAT SESSION SETUP ===
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

// Start a chat session
export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
});

// Example function to send a message via chat
export const sendChatMessage = async (message) => {
  try {
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Chat failed.";
  }
};
