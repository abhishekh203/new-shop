import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send as SendIcon } from "@mui/icons-material"; // Import Material UI icons
import { useNavigate } from "react-router-dom"; // For navigation

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const navigate = useNavigate(); // To navigate back to Home

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://getform.io/f/bnlermrb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        toast.error("Failed to send message. Please try again.");
      });
  };

  // Navigate back to home
  const handleHomeClick = () => {
    navigate("/"); // Adjust this if your home route is different
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-600 p-8 md:p-12 lg:p-16 rounded-lg text-center shadow-lg w-full mx-auto">
      <h2 className="text-3xl font-extrabold text-white mb-6">Contact Us</h2>
      <p className="text-lg text-gray-200 mb-8">Questions, Concerns, Comments? You tell us. We listen.</p>

      <div className="flex flex-col lg:flex-row lg:space-x-10">
        {/* Left Section: Contact Info */}
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <Button
            variant="contained"
            href="https://t.me/netflixnepalseller"
            sx={{
              mb: 3,
              backgroundColor: "#1976d2",
              width: "16rem",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 0",
              "&:hover": { backgroundColor: "#135ba1" },
            }}
          >
            Message on Telegram
          </Button>
          <p className="text-sm text-gray-300 mb-4">For Technical Support</p>

          <Button
            variant="contained"
            href="https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP"
            sx={{
              backgroundColor: "#388e3c",
              width: "16rem",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 0",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
          >
            Join WhatsApp Group
          </Button>
          <p className="text-sm text-gray-300">For Checkout Assistance</p>

          {/* Need Us Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">Need Us?</h3>
            <Button
              variant="contained"
              href="https://wa.me/9779807677391"
              sx={{
                backgroundColor: "#1976d2",
                width: "20rem",
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: "bold",
                padding: "12px 0",
                "&:hover": { backgroundColor: "#135ba1" },
              }}
            >
              Queries/Replacement - Reach us on WhatsApp
            </Button>
          </div>

          <div className="text-left md:text-center mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Info</h3>
            <ul className="text-lg text-gray-300 space-y-2">
              <li>
                <strong>Email us:</strong>{" "}
                <a href="mailto:abhikapar10@gmail.com" className="text-blue-300 underline">
                  abhikapar10@gmail.com
                </a>
              </li>
              <li>
                <strong>Telegram us:</strong>{" "}
                <a href="https://t.me/netflixnepalseller" className="text-blue-300 underline">
                  @abhi203111
                </a>
              </li>
              <li>
                <strong>Instagram us:</strong>{" "}
                <a href="https://www.instagram.com/premiumshopnepal_" className="text-pink-300 underline">
                  @premium_Shop_Nepal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="lg:w-1/2 bg-[#ADD8E6] p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Send us a message</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </div>

            <Button
              variant="contained"
              type="submit"
              startIcon={<SendIcon />} // Send Icon
              sx={{
                backgroundColor: "#1976d2",
                width: "100%",
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px 0",
                "&:hover": { backgroundColor: "#135ba1" },
              }}
            >
              Send Message
            </Button>
          </form>

          {/* Back to Home Button */}
          <button
            onClick={handleHomeClick}
            className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 hover:scale-105 mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ContactUs;
