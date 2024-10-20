import React from 'react';

const OTTSubscriptionInfo = () => {
    return (
        <section className="text-gray-800 body-font bg-gradient-to-r from-black to-blue-600 py-12">
            <div className="container mx-auto px-5">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-6 tracking-wider">
                        Who We Are?
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        We are proud to be Nepal’s #1 digital subscription store, dedicated to providing discounted premium subscriptions to customers around the world with direct email delivery.
                    </p>
                </div>

                {/* Stats and Achievements */}
                <div className="text-center mb-12">
                    <p className="text-lg max-w-2xl mx-auto text-gray-300 leading-relaxed">
                        Over the past five years, we have successfully completed and delivered over <strong>10,000+</strong> orders, leaving more than <strong>9500+</strong> satisfied customers with an outstanding average rating of <strong>4.8/5</strong>.
                    </p>
                    <p className="mt-4 text-gray-300 text-lg">
                        You’ll never have to overpay for a subscription again with our unbeatable prices. Our top-quality services have been available since our establishment in <strong>July 2019</strong>.
                    </p>
                </div>

                {/* Call-to-action Section */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-10 bg-gradient-to-b from-black via-gray-800 to-blue-800 py-8 text-white rounded-lg py-8 px-6 shadow-lg">
                    <img src="https://cdn-icons-png.flaticon.com/256/4359/4359963.png" alt="OTT Platform" className="w-48 h-48" />
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Earn with Us!</h2>
                        <p className="text-lg leading-relaxed">
                            Are you tired of spending too much money on subscriptions? Look no further! <strong className="text-pink-600">SAVE MONEY WITH US, MAKE MONEY WITH US!</strong>
                        </p>
                        <p className="mt-4 text-lg">
                            Not only can you save with our affordable subscriptions, but you can also share your purchased subscription with us, allowing you to earn from any extra profiles you aren't using. It’s a win-win scenario, turning unused subscriptions into a smart way to make money!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OTTSubscriptionInfo;
