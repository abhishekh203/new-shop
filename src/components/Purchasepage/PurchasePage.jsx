import { useState } from 'react';
import { Link } from 'react-router-dom';

const PurchasePage = () => {
  const [selectedPayment, setSelectedPayment] = useState('esewa');

  const qrCodes = {
    esewa: '../img/esewa.jpg',
    khalti: '../img/khalti.jpg',
    ime: '../img/imepay.jpg',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-blue-600 p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Payment Options</h1>
      
      {/* Payment selection buttons */}
      <div className="mb-6 space-x-4">
        <button 
          onClick={() => setSelectedPayment('esewa')} 
          className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out ${selectedPayment === 'esewa' ? 'bg-pink-600 text-white scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          eSewa
        </button>
        <button 
          onClick={() => setSelectedPayment('khalti')} 
          className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out ${selectedPayment === 'khalti' ? 'bg-pink-600 text-white scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Khalti
        </button>
        <button 
          onClick={() => setSelectedPayment('ime')} 
          className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out ${selectedPayment === 'ime' ? 'bg-pink-600 text-white scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          IME Pay
        </button>
      </div>

      {/* Display QR Code based on selection */}
      <div className="flex flex-col items-center mb-8 space-y-6">
        <div className="flex flex-col items-center">
          <img 
            src={qrCodes[selectedPayment]} 
            alt={`QR Code for ${selectedPayment} Payment`} 
            className="w-64 h-74 mb-4 transition duration-300 ease-in-out transform hover:scale-105"  // Added hover effect
          />
          <p className="text-white text-lg capitalize">{selectedPayment}</p>
        </div>
      </div>

      {/* Payment instructions */}
      <p className="text-white text-lg mb-8">
        Please scan the QR code with your payment app to complete the payment.
      </p>

      {/* Navigation links */}
      <div className="flex space-x-4">
        <Link 
          to="/" 
          className="bg-pink-600 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:bg-pink-700 hover:scale-105"
        >
          Back to Home
        </Link>
        <Link 
          to="/Contactus" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
        >
          Contact Us
        </Link>
      </div>

      {/* Contact Instructions */}
      <div className="mt-6 text-center text-white">
        <p>If you need to get your user ID and password, click on "Contact Us" to get support via WhatsApp or Telegram.</p>
      </div>
    </div>
  );
}

export default PurchasePage;
