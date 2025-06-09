import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const NepalFAQ = ({ service = "subscription" }) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Nepal-specific FAQs for different services
  const faqData = {
    netflix: [
      {
        question: "Does Netflix work in Nepal without VPN?",
        answer: "Yes! Our Netflix subscriptions work perfectly in Nepal without any VPN. You can stream directly from Kathmandu, Pokhara, or anywhere in Nepal."
      },
      {
        question: "What payment methods are accepted in Nepal?",
        answer: "We accept eSewa, Khalti, IME Pay, bank transfers, and cash payments. All prices are in Nepali Rupees (NPR) for your convenience."
      },
      {
        question: "How quickly will I receive my Netflix account in Nepal?",
        answer: "Instant delivery! Once payment is confirmed, you'll receive your Netflix account details within 5-10 minutes via email or WhatsApp."
      },
      {
        question: "Is customer support available in Nepal timezone?",
        answer: "Yes, our customer support team is available 24/7 in Nepal Standard Time (NPT). We provide support in both English and Nepali."
      },
      {
        question: "Can I use Netflix in multiple cities across Nepal?",
        answer: "Absolutely! You can use your Netflix account in Kathmandu, Pokhara, Chitwan, Butwal, or any city in Nepal without restrictions."
      }
    ],
    spotify: [
      {
        question: "Does Spotify Premium work in Nepal?",
        answer: "Yes! Our Spotify Premium subscriptions work seamlessly in Nepal. Enjoy ad-free music streaming in Kathmandu, Pokhara, and all over Nepal."
      },
      {
        question: "Can I download music for offline listening in Nepal?",
        answer: "Yes, with Spotify Premium you can download unlimited songs for offline listening anywhere in Nepal, even without internet connection."
      },
      {
        question: "What's the price of Spotify Premium in Nepal?",
        answer: "Our Spotify Premium starts from NPR 599 for 3 months. We offer the best prices in Nepal with instant activation."
      }
    ],
    general: [
      {
        question: "Are these subscriptions legal in Nepal?",
        answer: "Yes, all our subscriptions are completely legal and legitimate. We provide genuine accounts from official sources."
      },
      {
        question: "Do I need VPN to use these services in Nepal?",
        answer: "No VPN required! All our subscriptions work directly in Nepal without any additional software or VPN connections."
      },
      {
        question: "What if I face issues with my subscription in Nepal?",
        answer: "We provide 24/7 customer support in Nepal timezone. Contact us via WhatsApp, email, or phone for immediate assistance."
      },
      {
        question: "Can I pay in Nepali Rupees (NPR)?",
        answer: "Yes! All our prices are in NPR. We accept eSewa, Khalti, IME Pay, and other popular payment methods in Nepal."
      },
      {
        question: "Is delivery available across all cities in Nepal?",
        answer: "Yes, we provide instant digital delivery to all cities in Nepal including Kathmandu, Pokhara, Chitwan, Butwal, Biratnagar, and more."
      }
    ]
  };

  const currentFAQs = faqData[service] || faqData.general;

  // Structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": currentFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
    >
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions - Nepal
          </h2>
          <p className="text-gray-300 text-lg">
            Common questions about our services in Nepal
          </p>
        </motion.div>

        <div className="space-y-4">
          {currentFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/30 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  {openFAQ === index ? (
                    <FiChevronUp className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-cyan-400" />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 border-t border-gray-700/30">
                      <p className="text-gray-300 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-300 mb-4">
            Our Nepal-based support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+9779807677391"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              📞 Call: +977 980-767-7391
            </a>
            <a
              href="mailto:digitalshopnepalstore@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ✉️ Email: digitalshopnepalstore@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default NepalFAQ;
