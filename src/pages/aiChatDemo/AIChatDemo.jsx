import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaLightbulb, FaCode, FaRocket, FaUsers, FaShieldAlt } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import AIChat from '../../components/aiChat/AIChat';

const AIChatDemo = () => {
  const features = [
    {
      icon: <FaRobot className="text-4xl text-purple-400" />,
      title: "AI-Powered Responses",
      description: "Get intelligent answers about latest movies, shows, and digital products using advanced language models."
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-400" />,
      title: "Smart Recommendations",
      description: "Receive personalized suggestions for streaming content, software deals, and security solutions."
    },
    {
      icon: <FaCode className="text-4xl text-blue-400" />,
      title: "Technical Support",
      description: "Get help with software installation, VPN setup, and troubleshooting digital products."
    },
    {
      icon: <FaRocket className="text-4xl text-green-400" />,
      title: "Instant Updates",
      description: "Stay informed about new releases, trending content, and exclusive deals in real-time."
    },
    {
      icon: <FaUsers className="text-4xl text-pink-400" />,
      title: "Local Expertise",
      description: "Access region-specific information about Nepali content and local digital services."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-red-400" />,
      title: "Privacy Focused",
      description: "Choose between cloud APIs or local models for complete data privacy and control."
    }
  ];

  const sampleQuestions = [
    "What's new on Netflix this month?",
    "Recommend some Spotify playlists for studying",
    "What are the latest Disney+ shows?",
    "Best VPN for streaming services?",
    "Latest Canva Pro features and deals",
    "How to set up antivirus software?"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <motion.div 
          className="text-center py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Chat
            </span>
            <br />
            <span className="text-white">Assistant</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of customer support with our intelligent AI assistant. 
            Get instant answers about latest movies, shows, software deals, and technical help.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="px-6 py-3 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300">
              🎬 Streaming Updates
            </div>
            <div className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300">
              🎵 Music Recommendations
            </div>
            <div className="px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-full text-green-300">
              💻 Software Support
            </div>
            <div className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-yellow-300">
              🔒 Security Advice
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="text-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sample Questions */}
        <motion.div 
          className="max-w-4xl mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Try These Questions
            </h2>
            <p className="text-gray-400 text-lg">
              Click on any question to see how our AI assistant can help you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleQuestions.map((question, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02, x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <p className="text-gray-200 text-sm leading-relaxed">
                  "{question}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="max-w-6xl mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Three simple steps to get AI-powered assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Click the AI Button</h3>
              <p className="text-gray-400">
                Look for the floating purple AI button in the bottom-right corner of any page
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ask Your Question</h3>
              <p className="text-gray-400">
                Type your question about movies, shows, software, or any digital product
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Instant Help</h3>
              <p className="text-gray-400">
                Receive intelligent, helpful responses powered by advanced AI models
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center py-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience AI-Powered Support?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            The AI Chat button is now available on this page and throughout the site. 
            Click it to start getting intelligent assistance for all your digital needs.
          </p>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <FaRobot className="text-6xl text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              AI Assistant is Active
            </h3>
            <p className="text-gray-300">
              Look for the floating purple button in the bottom-right corner to start chatting!
            </p>
          </div>
        </motion.div>
      </div>

      {/* AI Chat Component */}
      <AIChat />
    </Layout>
  );
};

export default AIChatDemo;
