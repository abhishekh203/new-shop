const reviews = [
    {
        id: 1,
        username: "chaitanya.ch007",
        status: "VIP Customer",
        avatar: "https://cdn-icons-png.flaticon.com/256/147/147144.png",
        review: "The best site ever to buy premium accounts of all website. I have purchased several premium accounts, past one year from the admin. The best user experience, he reacts immediately and resolves any problems if account is deactivated or any issues. Immediately replaces with new account free of cost."
    },
    {
        id: 2,
        username: "chiragtaparia",
        status: "Customer",
        avatar: "https://cdn-icons-png.flaticon.com/256/219/219983.png",
        review: "This was my first purchase and it was a good experience got the account within promised time. Account details working absolutely fine. Will definitely do business again. Very very satisfied with this site Thank you for giving the premium accounts this rates Thank you."
    },
    {
        id: 3,
        username: "akshayvankariant",
        status: "Customer",
        avatar: "https://cdn-icons-png.flaticon.com/256/2922/2922506.png",
        review: "I ordered Netflix and Hotstar for 1 month from my24hrshop.com. And I was surprised by prompt response."
    },
    {
        id: 4,
        username: "salsabilanor",
        status: "Customer",
        avatar: "https://cdn-icons-png.flaticon.com/256/145/145867.png",
        review: "Absolutely legit and super fast. Got netflix 4 screen for <200rs. Delivery was super quick."
    }
];

const CustomerReviews = () => {
    return (
        <div className="bg-gradient-to-b from-gray-900 to-blue-600 py-8"> {/* Updated gradient */}
            <div className="container mx-auto px-5">
                <h2 className="text-center text-3xl font-bold text-gray-200 mb-6">Top Reviews</h2>
                <div className="flex flex-wrap justify-center items-start gap-6">
                    {reviews.map(review => (
                        <div key={review.id} className="w-full md:w-1/2 lg:w-1/4 p-4">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-green-200 hover:bg-gray-100 text-center">
                                <img className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-300" src={review.avatar} alt={review.username} />
                                <h3 className="text-lg font-semibold text-gray-700">{review.username}</h3>
                                <p className="text-sm font-semibold text-gray-500 mb-4">{review.status}</p>
                                <p className="text-gray-600">{review.review}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerReviews;
