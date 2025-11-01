// LLM Service for AI Chat Integration
// This service provides AI responses via Google Gemini API (primary) and Hugging Face (fallback)

import { generateGeminiResponse, testGeminiConnection, getGeminiStatus, clearConversationHistory, getConversationHistory } from './geminiService';

// LLM Configuration
const LLM_CONFIG = {
  GEMINI: {
    enabled: true,
    apiKey: 'AIzaSyAsXt5jZLMfNieoFPla3cwAu_-kq-vi0ag'
  }
};

// Main AI Response Generator - Gemini Only
export const generateAIResponse = async (userInput, productContext = null) => {
  try {
    const response = await generateGeminiResponse(userInput, productContext);
    return response;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};

// Test Gemini Connection
export const testLLMConnection = async () => {
  try {
    const result = await testGeminiConnection();
    return { gemini: result };
  } catch (error) {
    console.error('❌ Gemini connection test failed:', error);
    return { gemini: 'Failed: ' + error.message };
  }
};

// Get Available Providers Status
export const getAvailableProviders = () => {
  return {
    gemini: getGeminiStatus()
  };
};

// Conversation Management
export const clearChatHistory = clearConversationHistory;
export const getChatHistory = getConversationHistory;
