import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaLightbulb, FaFilm, FaMusic, FaGamepad, FaBook, FaStar, FaBroom } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { generateAIResponse, clearChatHistory } from '../../services/llmService';

const AIChat = ({ productContext = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What are the hottest Netflix shows right now? 🔥",
    "I need a good VPN for streaming - what do you recommend? 🔒",
    "Show me the latest gaming deals and offers 🎮",
    "Which antivirus is best for my computer? 💻",
    "What's trending on Disney+ this month? 🎬",
    "Help me choose between Spotify and YouTube Music 🎵"
  ]);

  // Update suggestions based on product context
  useEffect(() => {
    if (productContext) {
      const productSuggestions = [
        `Tell me more about ${productContext.title} - is it worth buying? 💭`,
        `How does this ${productContext.category.toLowerCase()} compare to alternatives? 🔄`,
        `What are the latest updates or features for this product? 🔄`,
        `Show me similar products in the ${productContext.category} category 🔍`,
        `What's the current market price for this type of product? 💰`,
        `Any special deals or bundles available right now? 🎁`
      ];
      setSuggestions(productSuggestions);
    } else {
      setSuggestions([
        "What are the hottest Netflix shows right now? 🔥",
        "I need a good VPN for streaming - what do you recommend? 🔒",
        "Show me the latest gaming deals and offers 🎮",
        "Which antivirus is best for my computer? 💻",
        "What's trending on Disney+ this month? 🎬",
        "Help me choose between Spotify and YouTube Music 🎵"
      ]);
    }
  }, [productContext]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const baseMessage = `Hey there! 👋 I'm **Digi**, your friendly shopping assistant from Digital Shop Nepal!`;
      
      let contextMessage = "";
      if (productContext) {
        contextMessage = `

I see you're checking out **${productContext.title}** (रु${productContext.price}) - great choice! 🌟

I can help you with:
• ❓ **Questions** about this ${productContext.category.toLowerCase()}
• 🔍 **Similar products** you might like  
• 💡 **Tips** on getting the most out of it
• 📊 **Real-time info** about latest updates or reviews
• 💳 **Easy purchase** process`;
      } else {
        contextMessage = `

I'm here to help you discover amazing digital products and get the best deals. Whether you're looking for the latest Netflix shows, need a reliable VPN, want premium software, or just browsing for something cool - I've got you covered! 

🌟 **What makes me special?**
• I get **real-time info** about movies, shows, and prices
• I know all about **current trends** and what's popular
• I can suggest **personalized recommendations** just for you
• I'm connected to Nepal's **most trusted digital marketplace**

💫 **Popular right now:**
🎬 Netflix premium accounts
🎵 Spotify family plans  
💻 Windows & Office bundles
🎮 Steam gaming deals`;
      }

      const finalMessage = baseMessage + contextMessage + `

**What can I help you with today?** Just ask me anything - I love chatting about digital products! 😊`;

      setMessages([
        {
          id: 1,
          sender: 'ai',
          content: finalMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, productContext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content, productContext);
      const aiMessage = {
        id: Date.now() + 1,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      sender: 'ai',
      content: `Chat cleared! 🧹 Hi again! I'm **Digi** from Digital Shop Nepal. 

What would you like to explore today? I'm here to help you find the perfect digital products! 😊`,
      timestamp: new Date()
    }]);
    clearChatHistory();
    toast.success('Chat history cleared');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to make URLs clickable
  const makeLinksClickable = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${url}</a>`;
    });
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      <motion.div
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-2 border-purple-400/20 hover:border-purple-400/40"
        >
          <FaRobot className="text-xl sm:text-2xl mb-1" />
          <span className="text-xs font-bold">AI Help</span>
        </button>
      </motion.div>

      {/* AI Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full max-w-5xl h-[85vh] sm:h-[80vh] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
                <div className="flex items-center space-x-3 sm:space-x-4 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <FaRobot className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg sm:text-xl">Digi - AI Shopping Assistant</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Digital Shop Nepal • Powered by Gemini 2.0</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                  <button
                    onClick={handleClearChat}
                    className="p-2 sm:p-3 text-gray-400 hover:text-yellow-400 transition-colors rounded-xl hover:bg-yellow-500/10 hover:scale-105"
                    title="Clear Chat"
                  >
                    <FaBroom className="text-lg sm:text-xl" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 sm:p-3 text-gray-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10 hover:scale-105"
                    title="Close Chat"
                  >
                    <FaTimes className="text-lg sm:text-xl" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 h-[calc(100%-280px)] sm:h-[calc(100%-320px)]">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.sender === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-gray-100'} rounded-2xl p-5 shadow-xl border ${message.sender === 'user' ? 'border-purple-500/30' : 'border-gray-700/50'}`}>
                      <div className="flex items-start space-x-4">
                        {message.sender === 'ai' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FaRobot className="text-white text-lg" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {message.sender === 'ai' && (
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-purple-400 font-semibold text-sm">Digi</span>
                              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                              <span className="text-gray-500 text-xs">Shopping Assistant</span>
                            </div>
                          )}
                          <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed space-y-3">
                              {message.content.split('\n').map((line, index) => {
                                // Handle different types of content formatting
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return (
                                    <div key={index} className="text-purple-300 font-semibold text-base">
                                      {line.replace(/\*\*/g, '')}
                                    </div>
                                  );
                                }
                                if (line.startsWith('🎬') || line.startsWith('🎵') || line.startsWith('💻') || line.startsWith('🔒') || line.startsWith('🎮')) {
                                  return (
                                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                      <span className="text-2xl">{line.charAt(0)}</span>
                                      <span className="text-gray-200">{line.substring(2)}</span>
                                    </div>
                                  );
                                }
                                if (line.startsWith('•') || line.startsWith('-')) {
                                  return (
                                    <div key={index} className="flex items-start space-x-2">
                                      <span className="text-purple-400 mt-1">•</span>
                                      <span className="text-gray-200">{line.substring(1).trim()}</span>
                                    </div>
                                  );
                                }
                                if (line.trim() === '') {
                                  return <div key={index} className="h-2"></div>;
                                }
                // Handle clickable links
                if (line.includes('[Click here to chat]')) {
                  const productText = productContext 
                    ? `Hi Digi! I'm interested in ${productContext.title} (रु${productContext.price}) and would like to know more about digital products from Digital Shop Nepal`
                    : 'Hi! I\'m interested in digital products and services from Digital Shop Nepal';
                  const whatsappUrl = `https://wa.me/9779807677391?text=${encodeURIComponent(productText)}`;
                  return (
                    <div key={index} className="text-gray-200">
                      {line.replace('[Click here to chat]', '')}
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 ml-2"
                      >
                        📱 Click here to chat
                      </a>
                    </div>
                  );
                }
                                return (
                                  <div key={index} className="text-gray-200">
                                    <div dangerouslySetInnerHTML={{ __html: makeLinksClickable(line) }} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {message.sender === 'ai' && (
                            <div className="mt-4 pt-3 border-t border-gray-700/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-gray-500 text-xs">Powered by Gemini 2.0 Flash 001</span>
                                </div>
                                <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FaUser className="text-white text-lg" />
                          </div>
                        )}
                      </div>
                      {message.sender === 'user' && (
                        <div className="mt-3 pt-2 border-t border-white/20">
                          <span className="text-white/70 text-xs">{formatTime(message.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800/80 text-gray-100 rounded-2xl p-4 shadow-lg border border-gray-700/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <FaRobot className="text-white text-sm" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="p-4 sm:p-6 border-t border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaLightbulb className="text-white text-sm sm:text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base sm:text-lg">Quick Questions</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Popular questions from our customers</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 sm:p-4 text-left bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:from-gray-600/70 hover:to-gray-700/70 text-gray-200 rounded-xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-200 text-xs sm:text-sm shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-400 text-sm sm:text-lg">
                              {index === 0 ? '🎬' : index === 1 ? '🔒' : index === 2 ? '💻' : index === 3 ? '🎵' : index === 4 ? '💳' : '💡'}
                            </span>
                          </div>
                          <span className="leading-relaxed">{suggestion}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 sm:p-6 border-t border-gray-700/50 bg-gray-800/30">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Hi Digi! What's trending today? Ask me about movies, VPN, software, or anything digital..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    <FaPaperPlane className="text-base sm:text-lg" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
