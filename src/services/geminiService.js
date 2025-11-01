// Google Gemini API Service for AI Chat
// This service provides AI responses via Google's Gemini API

// Configuration for Google Gemini API
const GEMINI_CONFIG = {
  enabled: true,
  apiUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent',
  apiKey: 'AIzaSyAsXt5jZLMfNieoFPla3cwAu_-kq-vi0ag',
  model: 'gemini-2.0-flash-001'
};

// Enhanced conversational context for Digital Shop Nepal AI Assistant
const DIGITAL_SHOP_CONTEXT = `
You are Digi, the friendly AI shopping assistant for Digital Shop Nepal 🇳🇵 - Nepal's most trusted digital marketplace.

**Your Personality:**
- Warm, helpful, and genuinely enthusiastic about helping customers
- Like a knowledgeable friend who's always up-to-date with the latest trends
- Patient and understanding, especially with customers who need guidance
- Proactive in suggesting relevant products and alternatives
- Cultural awareness of Nepali preferences and local context

**About Digital Shop Nepal:**
- 🏆 Nepal's #1 trusted digital products marketplace
- 💳 Secure local payments: Esewa, Khalti, Imepay, Bank Transfer
- ⚡ Instant delivery (2-5 minutes after payment)
- 🕒 Customer support: 8 AM - 11 PM (GMT +5:30)
- 📱 WhatsApp: +9779807677391
- 🛡️ 100% authentic products with replacement guarantee
- 💎 Over 10,000+ satisfied customers

**Product Categories We Excel In:**
- 🎬 Netflix, Disney+, Prime Video, Apple TV+ subscriptions
- 🎵 Spotify, YouTube Music, Apple Music premium accounts
- 💻 Windows, Office, Adobe, Antivirus software
- 🎮 Gaming platforms: Steam, Epic Games, Xbox Game Pass
- 🔒 Premium VPN services for secure browsing
- 📚 Educational platforms and online courses
- 🖥️ Professional software and productivity tools

**Conversation Guidelines:**
1. **Start conversations warmly** - greet like a helpful friend
2. **Ask clarifying questions** to understand exactly what they need
3. **Provide current, real-time information** with latest prices and availability
4. **Make personalized recommendations** based on their preferences
5. **Explain benefits clearly** - why our products are worth it
6. **Address concerns proactively** - delivery time, authenticity, support
7. **Use conversational Nepali context** when appropriate
8. **Create urgency when relevant** - limited offers, trending products
9. **Always guide toward purchase** but never be pushy

**Response Format:**
- Use natural, conversational language
- Include relevant emojis for visual appeal
- Structure with clear sections when providing detailed info
- Always end with a helpful next step or question
- Include pricing in Nepali Rupees (रु)
- Mention current offers or trending products when relevant
`;

// Conversation memory to maintain context
let conversationHistory = [];

// Main function to generate AI responses using Gemini
export const generateGeminiResponse = async (userInput, productContext = null) => {
  try {
    // Add user input to conversation history
    conversationHistory.push({ role: 'user', content: userInput });
    
    // Keep only last 10 messages to prevent token limit issues
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    // Build context-aware prompt
    let contextPrompt = DIGITAL_SHOP_CONTEXT;
    
    // Add product context if viewing a specific product
    if (productContext) {
      contextPrompt += `\n\n**Current Product Context:**
      - Product: ${productContext.title}
      - Price: रु${productContext.price}
      - Category: ${productContext.category}
      - Description: ${productContext.description}
      - In Stock: ${productContext.quantity > 0 ? 'Yes' : 'No'}`;
    }
    
    // Add conversation history for context
    if (conversationHistory.length > 1) {
      contextPrompt += `\n\n**Recent Conversation:**`;
      conversationHistory.slice(-4).forEach((msg, index) => {
        if (msg.role === 'user') {
          contextPrompt += `\nCustomer: ${msg.content}`;
        }
      });
    }

    const enhancedPrompt = `${contextPrompt}

**Current Customer Message:** ${userInput}

**Instructions for Response:**
1. Be conversational and friendly, like chatting with a helpful friend
2. If they're asking about products, get real-time pricing and availability
3. If they mention movies/shows, include current IMDB ratings and streaming availability
4. Make personalized recommendations based on their interests
5. Address any concerns about authenticity, delivery, or payment
6. Use emojis naturally in conversation
7. Always end with a helpful question or call-to-action
8. Keep the tone warm but professional

**Your Response as Digi:**`;

    // Check if API key is configured
    if (!GEMINI_CONFIG.apiKey) {
      console.log('Gemini API key not configured, using fallback');
      return null;
    }

    console.log('Calling Google Gemini API...');
    
    const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let responseText = data.candidates[0].content.parts[0].text;
      
      // Add AI response to conversation history
      conversationHistory.push({ role: 'assistant', content: responseText });
      
      // Add a more natural signature for purchases
      responseText += `\n\n---\n\n**Ready to get started?** 😊\n\n📱 Let's chat on WhatsApp: [Click here to chat](https://wa.me/9779807677391?text=Hi Digi! I'm interested in ${userInput.length > 50 ? 'digital products' : userInput})\n\n💳 **Payment options**: Esewa • Khalti • Imepay • Bank Transfer\n⚡ **Delivery**: Instant (2-5 minutes)\n🕒 **Support**: 8 AM - 11 PM`;
      
      return responseText;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};

// Clear conversation history (useful for new sessions)
export const clearConversationHistory = () => {
  conversationHistory = [];
  console.log('Conversation history cleared');
};

// Get conversation history
export const getConversationHistory = () => {
  return conversationHistory;
};

// Test Gemini API connectivity
export const testGeminiConnection = async () => {
  try {
    if (!GEMINI_CONFIG.apiKey) {
      return { status: 'No API Key', message: 'Gemini API key not configured' };
    }

    console.log('Testing Gemini API connection...');
    
    const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, this is a test message. Please respond with "Hello! I am working correctly."'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.candidates && data.candidates[0]) {
        return { 
          status: 'Connected', 
          message: 'Gemini API is working correctly',
          response: data.candidates[0].content.parts[0].text
        };
      } else {
        return { status: 'Error', message: 'Unexpected response format' };
      }
    } else {
      const errorText = await response.text();
      return { 
        status: 'Failed', 
        message: `API Error: ${response.status} - ${errorText}` 
      };
    }
  } catch (error) {
    return { 
      status: 'Error', 
      message: `Connection error: ${error.message}` 
    };
  }
};

// Get Gemini API status
export const getGeminiStatus = () => {
  return {
    name: 'Google Gemini',
    status: GEMINI_CONFIG.apiKey ? 'Available' : 'API Key Required',
    type: 'Cloud API',
    model: GEMINI_CONFIG.model
  };
};
