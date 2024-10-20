import React from 'react';
import { useNavigate } from 'react-router-dom';

const games = [
  {
    title: 'Taaza Khabar Season 2',
    videoUrl: 'https://www.youtube.com/embed/yYF6basS7mg',
    buttonText: 'Buy Now',
    price: '₹60',
  },
  {
    title: "Jigra",
    videoUrl: 'https://www.youtube.com/embed/3uE0RuQndZc',
    buttonText: 'Buy Now',
    price: '₹40',
  },
  {
    title: 'Vicky Vidya Ka Woh Wala Video',
    videoUrl: 'https://www.youtube.com/embed/0xXa9a2rHoQ',
    buttonText: 'Buy Now',
    price: '₹30',
  },
  {
    title: "Tumbbad",
    videoUrl: 'https://www.youtube.com/embed/O9CaB4J4VEI',
    buttonText: 'Buy Now',
    price: '₹50',
  },
  {
    title: 'Borderlands',
    videoUrl: 'https://www.youtube.com/embed/lU_NKNZljoQ?',
    buttonText: 'Buy Now',
    price: '₹50',
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    videoUrl: 'https://www.youtube.com/embed/KVnheXywIbY',
    buttonText: 'Buy Now',
    price: '₹30',
  },
  {
    title: "Thalapathy is the GOAT",
    videoUrl: 'https://www.youtube.com/embed/Uf8rt635LLo',
    buttonText: 'Buy Now',
    price: '₹40',
  },
  {
    title: 'Vedaa',
    videoUrl: 'https://www.youtube.com/embed/RcKR-1XvxMc',
    buttonText: 'Buy Now',
    price: '₹30',
  },
  {
    title: 'Devara Part-1',
    videoUrl: 'https://www.youtube.com/embed/uY89n81h02M',
    buttonText: 'Buy Now',
    price: '₹30',
  },
];

const FeaturedGames = () => {
  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    navigate('/ContactUs'); // Change '/ContactUs' to your actual route for the Contact Us component
  };

  return (
    <div className="bg-gradient-to-r from-black via-blue-900 to-black py-8">
      <h2 className="text-center text-gray-300 text-3xl font-semibold mb-8">Latest Movie Available to Purchase</h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <div 
            key={index} 
            className="bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-gray-700" // Added scaling effect for bounce
          >
            {/* Game Trailer */}
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="rounded-md"
                src={game.videoUrl.replace('watch?v=', 'embed/').split('?')[0]} // Replacing the URL format
                title={game.title}
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
            {/* Game Title */}
            <h3 className="text-white text-lg font-semibold mt-4 mb-2">{game.title}</h3>
            {/* Buttons Container */}
            <div className="flex justify-between mt-2">
              {/* Buy Now Button */}
              <button 
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
                onClick={handleBuyNowClick}
              >
                {game.buttonText}
              </button>
              {/* Price Button */}
              <button 
                className="bg-gray-700 text-white px-4 py-2 rounded-md ml-4 hover:bg-gray-600 transition duration-300" // Added margin-left for gap
                disabled
              >
                {game.price}
              </button>
            </div>
          </div>
          
        ))}
      </div>
       <h3 className="mt-6 text-center text-gray-500 :text-3xl font-semibold mb-8">Directly message us on WhatsApp to request your favorite movies and shows!

</h3>
    </div>
    
  );
};

export default FeaturedGames;
