import { useNavigate, useParams } from "react-router";
import myContext from "../../context/myContext";
import { useContext, useEffect, useState } from "react";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const categoryList = [
    'smm panel', 'special offer', 'antivirus', 'gift card', 'ott', 'movies', 'music', 
    'netflix', 'streaming', 'useful-tools', 'bundle', 'education', 'vpn', 'games'
];

const UpdateProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProductFunction } = context;

    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });

    const getSingleProductFunction = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id));
            const product = productTemp.data();
            setProduct({
                title: product?.title,
                price: product?.price,
                productImageUrl: product?.productImageUrl,
                category: product?.category,
                description: product?.description,
                quantity: product?.quantity,
                time: product?.time,
                date: product?.date
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const updateProduct = async () => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', id), product);
            toast.success("Product Updated successfully");
            getAllProductFunction();
            setLoading(false);
            navigate('/admin-dashboard');
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProductFunction();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
            {loading && <Loader />}
            <div className="bg-white px-8 py-8 border border-gray-300 rounded-lg shadow-lg max-w-lg w-full transition-transform transform hover:scale-105 duration-300 hover:bg-green-50 hover:border-green-300">
                <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Update Product</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                        placeholder='Product Title'
                        className='bg-gray-100 border text-gray-700 border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-pink-500 transition-colors duration-300 hover:bg-gray-200'
                    />

                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        placeholder='Product Price'
                        className='bg-gray-100 border text-gray-700 border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-pink-500 transition-colors duration-300 hover:bg-gray-200'
                    />

                    <input
                        type="text"
                        name="productImageUrl"
                        value={product.productImageUrl}
                        onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
                        placeholder='Product Image Url'
                        className='bg-gray-100 border text-gray-700 border-gray-300 px-4 py-2 w-full rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-pink-500 transition-colors duration-300 hover:bg-gray-200'
                    />

                    <select
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300 hover:bg-gray-200"
                    >
                        <option disabled>Select Product Category</option>
                        {categoryList.map((name, index) => (
                            <option key={index} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
                        ))}
                    </select>

                    <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        name="description"
                        placeholder="Product Description"
                        rows="5"
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none placeholder-gray-500 focus:ring-2 focus:ring-pink-500 transition-colors duration-300 hover:bg-gray-200"
                    />

                    <button
                        onClick={updateProduct}
                        type='button'
                        className='bg-green-500 hover:bg-green-700 w-full text-white text-center py-3 font-bold rounded-md transition-transform transform hover:scale-105 duration-300'
                    >
                        Update Product
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProductPage;
