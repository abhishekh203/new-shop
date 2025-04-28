import React from "react";

const DigitalServicesNepal = () => {
  const services = [
    // Streaming Services
    "Netflix Nepal", "Prime Video Nepal", "Disney Plus Hotstar Nepal", 
    "YouTube Premium Nepal", "HBO MAX Nepal", "ZEE-5 Premium Nepal",
    "JIO Cinema Nepal", "Crunchyroll MegaFan Nepal", "ALTBalaji Nepal", "ULLU Nepal",
    
    // Music & Audio
    "Spotify Nepal", "JioSaavn Nepal", "Gaana Plus Nepal", 
    "KUKU FM Nepal", "Audible Audiobooks Nepal",
    
    // VPN Services
    "Nord VPN Nepal", "Express VPN Nepal", "Surfshark VPN Nepal", 
    "IP Vanish Nepal", "Windscribe VPN Nepal", "Cloudflare 1.1.1.1 WARP+ VPN Nepal",
    
    // Education & Productivity
    "Udemy Nepal", "Chat GPT Nepal", "Google Gemini Advanced Nepal",
    "Office 365 Nepal", "Office 2021 Professional Plus Nepal", "Windows 11 Professional Nepal",
    "Grammarly Nepal", "Codecademy PRO Nepal", "Coursera Premium Nepal",
    "SkillShare Premium Nepal", "Course Hero Nepal", "TestBook Pass Nepal",
    "Scribd Premium Nepal", "Duolingo Plus Nepal",
    
    // Security & Software
    "McAfee Total Protection Nepal", "Quick Heal Total Security Nepal", "360 TOTAL SECURITY Nepal",
    "IDM Nepal", "Internet Download Manager Nepal", "Adobe Premiere Pro Nepal",
    "Filmora X/12 Nepal", "Filmora 14 Nepal", "Envato Elements Premium Nepal",
    "CANVA PRO Nepal", "Capcut Pro Nepal", "Invideo Nepal", "Acrobat Pro Nepal",
    
    // Other Services
    "Tinder Plus Nepal", "The Economic Times PRIME Nepal", "Indian Express Nepal", "GIGL Subscription Nepal"
  ];

  return (
    <div className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Premium Digital Services Available in Nepal
        </h1>
        
        {/* Visible Services List */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <p className="text-gray-400 mb-4 text-center">
            Get instant access to premium digital subscriptions in Nepal:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {services.map((service, index) => (
              <span 
                key={index} 
                className="bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-yellow-500 hover:text-black transition-colors"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* SEO Optimized Hidden Content */}
        <div className="hidden" aria-hidden="true">
          <h2>Best Digital Subscriptions in Nepal 2024</h2>
          <p>
            Buy authentic Netflix Nepal, Spotify Nepal, VPN Nepal, and other premium digital 
            service accounts instantly. We provide the cheapest OTT platform subscriptions 
            in Nepal including Prime Video, Disney+ Hotstar, YouTube Premium, NordVPN, 
            Udemy courses, and professional software licenses with 24/7 customer support.
          </p>
          <h3>Popular Digital Services in Nepal:</h3>
          <ul>
            {services.map((service, index) => (
              <li key={index}>{service.replace("Nepal", "")} subscription in Nepal</li>
            ))}
          </ul>
          <p>
            Affordable premium accounts for Nepali users. Instant delivery via email. 
            Trusted by thousands of customers across Kathmandu, Pokhara, and all Nepal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalServicesNepal;