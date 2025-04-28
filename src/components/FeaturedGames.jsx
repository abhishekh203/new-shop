import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const games = [
   {
    title: "Venom: The Last Dance",
    videoUrl: "https://www.youtube.com/embed/VotL4HNhhCU?si=tx98m7bsxDBGW47E",
    buttonText: "Buy Now",
    price: "₹40",
  },
  {
    title: "Daman",
    videoUrl: "https://www.youtube.com/embed/KalGl0wAX2c?si=UvWixi964LFREhoo",
    buttonText: "Buy Now",
    price: "₹40",
  },
  {
    title: "Vaazha: Biopic of a Billion Boys",
    videoUrl: "https://www.youtube.com/embed/Xhqc5q12r8w?si=l8Z2zgTSnV4dtlXK",
    buttonText: "Buy Now",
    price: "₹40",
  },
  {
    title: "Meiyazhagan",
    videoUrl: "https://www.youtube.com/embed/YGJOcMtnG1Q?si=1Ha97tpN8BEQhlR1",
    buttonText: "Buy Now",
    price: "₹40",
  },
  {
    title: "Taaza Khabar Season 2",
    videoUrl: "https://www.youtube.com/embed/yYF6basS7mg",
    buttonText: "Buy Now",
    price: "₹60",
  },
  {
    title: "Jigra",
    videoUrl: "https://www.youtube.com/embed/3uE0RuQndZc",
    buttonText: "Buy Now",
    price: "₹40",
  },
  { title: "Deadpool & Wolverine", videoUrl:"https://www.youtube.com/embed/0E1kVRRi6lk?si=hT-eLcZuupPKgkV2" , buttonText: "Buy Now", price: "₹50" },
  { title: "Godzilla x Kong: The New Empire", videoUrl: "https://www.youtube.com/embed/zzbX2_3ZM5k", buttonText: "Buy Now", price: "₹50" },
  { title: "Dune: Part Two", videoUrl: "https://www.youtube.com/embed/Way9Dexny3w", buttonText: "Buy Now", price: "₹60" },
  { title: "Spider-Man: Beyond the Spider-Verse", videoUrl: "https://www.youtube.com/embed/t06RUxPbp_c", buttonText: "Buy Now", price: "₹50" },


  { title: "Oppenheimer", videoUrl: "https://www.youtube.com/embed/bK6ldnjE3Y0", buttonText: "Buy Now", price: "₹60" },
  { title: "Fast X", videoUrl: "https://www.youtube.com/embed/32RAq6JzY-w", buttonText: "Buy Now", price: "₹50" },
  { title: "Avatar: The Way of Water", videoUrl: "https://www.youtube.com/embed/a8Gx8wiNbs8", buttonText: "Buy Now", price: "₹60" },
  { title: "RRR", videoUrl: "https://www.youtube.com/embed/f_vbAtFSEc0", buttonText: "Buy Now", price: "₹50" },
  { title: "KGF: Chapter 2", videoUrl: "https://www.youtube.com/embed/JKa05nyUmuQ", buttonText: "Buy Now", price: "₹50" },
  { title: "Pushpa: The Rise", videoUrl: "https://www.youtube.com/embed/Q1NKMPhP8PY", buttonText: "Buy Now", price: "₹50" },
  { title: "Leo", videoUrl: "https://www.youtube.com/embed/Po3jStA673E", buttonText: "Buy Now", price: "₹50" },
  { title: "Jawan", videoUrl: "https://www.youtube.com/embed/MWOlnZSnXJo?si=XesbFo27q3Xlv--F" , buttonText: "Buy Now", price: "₹50" },
  { title: "Pathaan", videoUrl: "https://www.youtube.com/embed/vqu4z34wENw", buttonText: "Buy Now", price: "₹50" },
  { title: "Tiger 3", videoUrl: "https://www.youtube.com/embed/vEjTUDjjU6A?si=IJyLRinAxKH9Qrze" , buttonText: "Buy Now", price: "₹50" },
  

  { title: "Salaar", videoUrl: "https://www.youtube.com/embed/HihakYi5M2I?si=FAw68-L3nB6UIZQ1", buttonText: "Buy Now", price: "₹50" },
 

  { title: "Black Adam", videoUrl: "https://www.youtube.com/embed/X0tOpBuYasI", buttonText: "Buy Now", price: "₹40" },
  { title: "Vikram", videoUrl: "https://www.youtube.com/embed/OKBMCL-frPU", buttonText: "Buy Now", price: "₹50" },
  { title: "Jailer", videoUrl:"https://www.youtube.com/embed/aaNq2NL6D4A?si=s37OU1NM6wfl3_wV" , buttonText: "Buy Now", price: "₹50" },
 
  { title: "Beast", videoUrl: "https://www.youtube.com/embed/0E1kVRRi6lk?si=hT-eLcZuupPKgkV2" , buttonText: "Buy Now", price: "₹50" },
  { title: "The Equalizer 3", videoUrl: "https://www.youtube.com/embed/19ikl8vy4zs", buttonText: "Buy Now", price: "₹50" },
  
  { title: "Transformers: Rise of the Beasts", videoUrl: "https://www.youtube.com/embed/itnqEauWQZM", buttonText: "Buy Now", price: "₹50" },
  
];

const FeaturedGames = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(5);

  const handleBuyNowClick = (game) => {
    navigate("/ContactUs", { state: { selectedMovie: game.title } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-800 to-black py-1 px-4">

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-center text-gray-100 text-4xl font-bold mb-10"
        >
          "Looking for a movie? Request your favorite now!"
        </motion.h2>

        {/* Swiper Carousel */}
        <motion.div variants={itemVariants}>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            }}
            loop={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="px-2 pb-12"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {games.map((game, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={`bg-gray-800 p-4 rounded-xl shadow-lg transition-all duration-300 ${
                    activeIndex === index ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {/* Video with shimmer effect */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 animate-shimmer" />
                    <iframe
                      className="w-full h-full"
                      src={game.videoUrl}
                      title={game.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-xl font-bold mb-3 truncate">
                    {game.title}
                  </h3>

                  {/* Buttons */}
                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md"
                      onClick={() => handleBuyNowClick(game)}
                    >
                      {game.buttonText}
                    </motion.button>
                    <span className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium">
                      {game.price}
                    </span>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* CTA */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <p className="text-gray-300 text-lg mb-2">
            Can't find what you're looking for?
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/9779807677391"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Request on WhatsApp
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default FeaturedGames;