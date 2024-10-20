import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";

const categoryList = [
    { name: 'smm panel' },
    { name: 'special offer' },
    { name: 'antivirus' },
    { name: 'gift card' },
    { name: 'ott' },
    { name: 'movies' },
    { name: 'music' },
    { name: 'netflix' },
    { name: 'streaming' },
    { name: 'useful-tools' },
    { name: 'bundle' },
    { name: 'education' },
    { name: 'vpn' },
    { name: 'games' }
];

const AddProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
    });

    const addProductFunction = async () => {
        if (product.title === "" || product.price === "" || product.productImageUrl === "" || product.category === "" || product.description === "") {
            return toast.error("All fields are required");
        }

        setLoading(true);
        try {
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, product);
            toast.success("Product added successfully");
            navigate('/admin-dashboard');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Failed to add product");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-black">
            {loading && <Loader />}
            <div className="login_Form bg-gradient-to-br from-green-400 to-blue-500 px-10 py-8 border border-gray-200 rounded-3xl shadow-2xl w-full max-w-lg">

                {/* Top Heading */}
                <div className="mb-6">
                    <h2 className='text-center text-3xl font-extrabold text-white tracking-wide'>
                        Add Product
                    </h2>
                </div>

                {/* Input One */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                        placeholder='Product Title'
                        className='bg-white border text-gray-700 border-gray-300 px-4 py-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105'
                    />
                </div>

                {/* Input Two */}
                <div className="mb-4">
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        placeholder='Product Price'
                        className='bg-white border text-gray-700 border-gray-300 px-4 py-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105'
                    />
                </div>

                {/* Input Three */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="productImageUrl"
                        value={product.productImageUrl}
                        onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
                        placeholder='Product Image URL'
                        className='bg-white border text-gray-700 border-gray-300 px-4 py-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105'
                    />
                </div>

                {/* Input Four */}
                <div className="mb-4">
                    <select
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <option disabled>Select Product Category</option>
                        {categoryList.map((value, index) => (
                            <option key={index} value={value.name} className="capitalize">
                                {value.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Input Five */}
                <div className="mb-6">
                    <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        name="description"
                        placeholder="Product Description"
                        rows="4"
                        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
                    />
                </div>

                {/* Add Product Button */}
                <div className="mb-3">
                    <button
                        onClick={addProductFunction}
                        type='button'
                        className='bg-blue-600 hover:bg-blue-700 w-full text-white py-3 font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105'
                    >
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;
