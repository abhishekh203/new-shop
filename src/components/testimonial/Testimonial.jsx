import React from "react";
import Slider from "react-slick";
import { FaUserCircle } from "react-icons/fa"; // Importing from react-icons

const Testimonial = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,                // Enables auto sliding
        autoplaySpeed: 1500,           // Slide every 1.5 seconds
        arrows: false,                 // Hide arrows for cleaner design
    };

    return (
        <section className="bg-gradient-to-b from-black via-gray-900 to-blue-900">
            {/* Main Section */}
            <div className="container px-5 py-10 mx-auto">
                {/* Subheading */}
                <h2 className="text-center text-white text-2xl font-semibold mb-8">
                    What our <span className="text-orange-500">customers</span> are saying
                </h2>

                {/* Testimonials Slider */}
                <Slider {...settings}>
                    {/* Testimonial 1 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "I’ve purchased a few premium accounts from this site. Excellent service."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Kamal Sharma
                            </h2>
                            <p className="text-gray-500">VIP Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "First-time purchase. It was a good experience, everything is working perfectly."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Sita Basnet
                            </h2>
                            <p className="text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "Got a premium account quickly and at a great price!"
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Prakash Thapa
                            </h2>
                            <p className="text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 4 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "I received my account on time. Highly recommend this website."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Bishal Rai
                            </h2>
                            <p className="text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 5 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "I am very satisfied. Top-notch service and fast delivery."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Aayush Khatri
                            </h2>
                            <p className="text-gray-500">VIP Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 6 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "I’ll definitely buy again. The prices are unbeatable!"
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Shreya Maharjan
                            </h2>
                            <p className="text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 7 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "Excellent customer support, and I’m really satisfied with the service I received."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Rina Shrestha
                            </h2>
                            <p className="text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 8 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "I’m impressed with the customer service, and I received my premium account instantly."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Dipesh Lama
                            </h2>
                            <p className="text-gray-500">VIP Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 9 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "This service is fast and reliable. I'm happy with my purchase."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Sarita KC
                            </h2>
                            <p className="text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Testimonial 10 */}
                    <div className="p-4">
                        <div className="h-full text-center shadow-lg rounded-lg p-6 bg-black transition-transform transform hover:scale-105 duration-300 ease-in-out">
                            <FaUserCircle className="text-6xl mx-auto mb-4 text-orange-500" />
                            <p className="leading-relaxed text-gray-200 mb-4">
                                "I've tried a few sites, but this one stands out for its fast delivery and helpful customer service."
                            </p>
                            <span className="inline-block h-1 w-10 rounded bg-orange-600 mt-4 mb-2"></span>
                            <h2 className="text-white font-medium text-lg uppercase">
                                Ramesh Tiwari
                            </h2>
                            <p className="text-gray-500">VIP Customer</p>
                        </div>
                    </div>
                </Slider>
            </div>
        </section>
    );
};

export default Testimonial;
