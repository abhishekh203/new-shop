import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

// Icons for Netflix, Prime Video, Spotify, and YouTube Premium
const icons = {
    netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    prime: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    youtube: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
};

const Track = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true, // Center the current slide
        centerPadding: '0', // Remove padding to ensure a smooth transition
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className="bg-gradient-to-r from-black to-blue-600">
            <div className="container mx-auto px-5 py-10 md:py-14">
                {/* Slider */}
                <Slider {...settings}>
                    {/* Netflix */}
                    <div className="p-4">
                        <div className="border-2 border-gray-600 bg-gradient-to-r from-gray-800 via-black to-gray-800 shadow-lg hover:shadow-gray-500/50 hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out px-4 py-6 rounded-lg">
                            <img 
                                src={icons.netflix} 
                                alt="Netflix" 
                                className="w-24 h-24 object-contain mx-auto mb-4"
                            />
                            <h2 className="title-font font-bold text-xl text-gray-400">Netflix</h2>
                            <p className="leading-relaxed text-gray-700">
                                Get private 4K quality on 1 screen for a steal! 🖥<br />
                                <strong>Monthly:</strong> Rs. 399<br />
                                <strong>3 Months:</strong> Rs. 1169<br />
                                <strong>6 Months:</strong> Rs. 2300<br />
                                <strong>Yearly:</strong> Rs. 4499
                            </p>
                            <p className="text-sm text-gray-600 mt-4">
                                Remember to follow the rules:
                                <ul className="list-disc list-inside text-left mx-auto">
                                    <li>Use only the provided profile</li>
                                    <li>Don't change the account email or password</li>
                                    <li>Don't add a mobile number</li>
                                    <li>Limit login to 1 device</li>
                                </ul>
                            </p>
                        </div>
                    </div>

                    {/* Prime Video */}
                    <div className="p-4">
                        <div className="border-2 border-gray-600 bg-gradient-to-r from-gray-800 via-black to-gray-800 shadow-lg hover:shadow-gray-500/50 hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out px-4 py-6 rounded-lg">
                            <img 
                                src={icons.prime} 
                                alt="Prime Video" 
                                className="w-24 h-24 object-contain mx-auto mb-4"
                            />
                            <h2 className="title-font font-bold text-xl text-gray-400">Prime Video</h2>
                            <p className="leading-relaxed text-gray-700">
                                Get Prime Video in HD quality, including Amazon Originals!<br />
                                <strong>Monthly:</strong> Rs. 199<br />
                                <strong>3 Months:</strong> Rs. 449<br />
                                <strong>6 Months:</strong> Rs. 699<br />
                                <strong>Yearly:</strong> Rs. 1299
                            </p>
                            <p className="text-sm text-gray-600 mt-4">
                                Follow these rules:
                                <ul className="list-disc list-inside text-left mx-auto">
                                    <li>Use the assigned profile only</li>
                                    <li>No changes to email or password</li>
                                    <li>Don't link a mobile number</li>
                                    <li>Only 1 device login at a time</li>
                                </ul>
                            </p>
                        </div>
                    </div>

                    {/* Spotify */}
                    <div className="p-4">
                        <div className="border-2 border-gray-600 bg-gradient-to-r from-gray-800 via-black to-gray-800  shadow-lg hover:shadow-gray-500/50 hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out px-4 py-6 rounded-lg">
                            <img 
                                src={icons.spotify} 
                                alt="Spotify" 
                                className="w-24 h-24 object-contain mx-auto mb-4"
                            />
                            <h2 className="title-font font-bold text-xl text-gray-400">Spotify</h2>
                            <p className="leading-relaxed text-gray-700">
                                Enjoy ad-free music streaming on your personal account! 🎧<br />
                                <strong>Monthly:</strong> Rs. 199<br />
                                <strong>3 Months:</strong> Rs. 579<br />
                                <strong>6 Months:</strong> Rs. 1149<br />
                                <strong>Yearly:</strong> Rs. 1799
                            </p>
                            <p className="text-sm text-gray-600 mt-4">
                                Please follow these rules:
                                <ul className="list-disc list-inside text-left mx-auto">
                                    <li>Available in your personal email</li>
                                    <li>Don't change the email but password changeable</li>
                                    <li>Avoid linking a mobile number</li>
                                    <li>Limit usage to 1 device at a time</li>
                                </ul>
                            </p>
                        </div>
                    </div>

                    {/* YouTube Premium */}
                    <div className="p-4">
                        <div className="border-2 border-gray-600 bg-gradient-to-r from-gray-800 via-black to-gray-800 shadow-lg hover:shadow-gray-500/50 hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out px-4 py-6 rounded-lg">
                            <img 
                                src={icons.youtube} 
                                alt="YouTube Premium" 
                                className="w-24 h-24 object-contain mx-auto mb-4"
                            />
                            <h2 className="title-font font-bold text-xl text-gray-400">YouTube Premium</h2>
                            <p className="leading-relaxed text-gray-700">
                                Enjoy ad-free videos and music with YouTube Premium! 📹<br />
                                <strong>Monthly:</strong> Rs. 199<br />
                                <strong>3 Months:</strong> Rs. 549<br />
                                <strong>6 Months:</strong> Rs. 999<br />
                                <strong>Yearly:</strong> Rs. 1999
                            </p>
                            <p className="text-sm text-gray-600 mt-4">
                                Follow these guidelines:
                                <ul className="list-disc list-inside text-left mx-auto">
                                    <li>Use your assigned account only</li>
                                    <li>Don't alter the email or password</li>
                                    <li>Avoid linking a mobile number</li>
                                    <li>Limit to 1 device</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </Slider>
            </div>
        </section>
    );
}

export default Track;
