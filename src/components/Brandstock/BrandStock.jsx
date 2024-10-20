import React from 'react';

const BrandsStock = () => {
  return (
    <div className="bg-gradient-to-r from-black to-blue-500 py-8 px-4"> {/* Gradient background */}
      <div className="container mx-auto text-center">
        {/* Title Section */}
        <h2 className="text-2xl md:text-3xl font-bold text-white">Brands we stock</h2> {/* Changed to white */}
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto"> {/* Changed to a lighter gray */}
          Our rigorous selection process ensures that only the highest quality options are presented to you. 
          We understand that Security and Stability are non-negotiable.
        </p>
        
        {/* Brands Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
          {/* Add brand logos with Tailwind classes */}
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="h-16" />
          </div>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg" alt="Disney+ Hotstar" className="h-16" />
          </div>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-16" />
          </div>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" className="h-16" />
          </div>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-16" />
          </div>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png" alt="Prime Video" className="h-16" />
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col md:flex-row justify-around mt-8 space-y-6 md:space-y-0">
          {/* Free Worldwide Delivery */}
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2 text-white">🌍</span> {/* Changed to white */}
            <p className="text-lg font-semibold text-white">Free Worldwide Delivery</p> {/* Changed to white */}
            <p className="text-sm text-gray-300">Get Subscription via Email</p> {/* Changed to a lighter gray */}
          </div>

          {/* 24/7 Support */}
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2 text-white">💬</span> {/* Changed to white */}
            <p className="text-lg font-semibold text-white">Get 24×7×365 Support</p> {/* Changed to white */}
            <p className="text-sm text-gray-300">Free Human Chat Support</p> {/* Changed to a lighter gray */}
          </div>

          {/* Safe and Stable */}
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2 text-white">🔒</span> {/* Changed to white */}
            <p className="text-lg font-semibold text-white">Surely Safe and Stable</p> {/* Changed to white */}
            <p className="text-sm text-gray-300">Hassle-free Replacements</p> {/* Changed to a lighter gray */}
          </div>

          {/* Secure Checkout */}
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2 text-white">💳</span> {/* Changed to white */}
            <p className="text-lg font-semibold text-white">100% Secure Checkout</p> {/* Changed to white */}
            <p className="text-sm text-gray-300">Esewa / Khalti / ImePay / Bank Transfer</p> {/* Changed to a lighter gray */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsStock;
