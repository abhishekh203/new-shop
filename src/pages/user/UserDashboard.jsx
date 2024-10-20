import { useContext } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const UserDashboard = () => {
    // user
    const user = JSON.parse(localStorage.getItem('users'));

    const context = useContext(myContext);
    const { loading, getAllOrder } = context;

    // Calculate the total amount for each order
    const calculateTotalAmount = (order) => {
        return order.cartItems.reduce((total, item) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            return total + itemTotal;
        }, 0);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-5 lg:py-8 bg-gradient-to-r from-black to-blue-800">
                {/* Top */}
                <div className="top">
                    {/* main */}
                    <div className="bg-black shadow-lg">
                        {/* image */}
                        <div className="flex justify-center mb-4">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" 
                                alt="User Icon" 
                                className="w-16 h-16"
                            />
                        </div>
                        {/* text */}
                        <div className="text-center">
                            {/* Name */}
                            <h1 className="text-xl font-bold text-green-600 mb-2">
                                <span className="font-semibold">Name:</span> {user?.name}
                            </h1>

                            {/* Email */}
                            <h1 className="text-lg text-gray-300 mb-2">
                                <span className="font-semibold">Email:</span> {user?.email}
                            </h1>

                            {/* Date */}
                            <h1 className="text-lg text-gray-400 mb-2">
                                <span className="font-semibold">Date:</span> {user?.date}
                            </h1>

                            {/* Role */}
                            <h1 className="text-lg text-gray-500">
                                <span className="font-semibold">Role:</span> {user?.role}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="bottom mt-6">
                    {/* main 1 */}
                    <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
                        {/* text */}
                        <h2 className="text-2xl lg:text-3xl font-bold text-green-600 mb-4">Order Details</h2>

                        <div className="flex justify-center relative top-10">
                            {loading && <Loader />}
                        </div>

                        {/* main 2 */}
                        {getAllOrder.filter((obj) => obj.userid === user?.uid).map((order, index) => (
                            <div key={index} className="mt-5 flex flex-col overflow-hidden rounded-xl border border-green-100 bg-black md:flex-row shadow-lg">
                                {/* main 3 */}
                                <div className="w-full border-r border-green-100 bg-black md:max-w-xs">
                                    {/* left */}
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                            <div className="mb-4">
                                                <div className="text-sm font-semibold text-white">Order Id</div>
                                                <div className="text-sm font-medium text-gray-200">#{order.id}</div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-sm font-semibold">Date</div>
                                                <div className="text-sm font-medium text-gray-200">{order.date}</div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-sm font-semibold">Total Amount</div>
                                                <div className="text-sm font-medium text-white">
                                                    ₹ {calculateTotalAmount(order).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-sm font-semibold">Order Status</div>
                                                <div className={`text-sm font-medium ${order.status === 'pending' ? 'text-red-800' : 'text-green-800'}`}>
                                                    {order.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* right */}
                                <div className="flex-1">
                                    <div className="p-8">
                                        <ul className="-my-7 divide-y divide-gray-200">
                                            {order.cartItems.map((item, index) => (
                                                <li key={index} className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                                                    <div className="flex flex-1 items-stretch">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                className="h-40 w-40 rounded-lg border border-gray-200 object-contain"
                                                                src={item.productImageUrl}
                                                                alt={item.title}
                                                            />
                                                        </div>

                                                        <div className="ml-5 flex flex-col justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-white">{item.title}</p>
                                                                <p className="mt-1.5 text-sm font-medium text-gray-200">{item.category}</p>
                                                            </div>

                                                            <p className="mt-4 text-sm font-medium text-white">x {item.quantity}</p>
                                                        </div>
                                                    </div>

                                                    <div className="ml-auto flex flex-col items-end justify-between">
                                                        <p className="text-right text-sm font-bold text-white">₹ {item.price}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserDashboard;
