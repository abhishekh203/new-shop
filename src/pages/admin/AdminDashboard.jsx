import React, { useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
import myContext from '../../context/myContext';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser } = context;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white">
            {/* Top */}
            <div className="px-5 py-5">
                <div className="bg-gray-800 py-4 border border-gray-700 rounded-lg">
                    <h1 className="text-center text-3xl font-extrabold text-white">Admin Dashboard</h1>
                </div>
            </div>

            <div className="px-5">
                {/* Mid */}
                <div className="mb-6">
                    <div className="bg-gray-800 py-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-center">
                            <img 
                                src="./img/ak.jpg" 
                                alt="Admin" 
                                className="w-20 h-20 rounded-full border-4 border-gray-600"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <h1 className="text-xl">
                                <span className="font-bold text-gray-400">Name: </span>
                                {user?.name}
                            </h1>
                            <h1 className="text-xl">
                                <span className="font-bold text-gray-400">Email: </span>
                                {user?.email}
                            </h1>
                            <h1 className="text-xl">
                                <span className="font-bold text-gray-400">Date: </span>
                                {user?.date}
                            </h1>
                            <h1 className="text-xl">
                                <span className="font-bold text-gray-400">Role: </span>
                                {user?.role}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Add Product Button */}
                <div className="mb-6 text-center">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                        Add Product
                    </button>
                </div>

                {/* Bottom */}
                <div className="">
                    <Tabs>
                        <TabList className="flex flex-wrap -m-4 text-center justify-center">
                            {/* Total Products */}
                            <Tab className="p-4 md:w-1/4 sm:w-1/2 w-full cursor-pointer">
                                <div className="border bg-green-700 hover:bg-green-600 border-green-600 px-4 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="text-white w-12 h-12 mb-3 mx-auto">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={50}
                                            height={50}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-shopping-basket"
                                        >
                                            <path d="m5 11 4-7" />
                                            <path d="m19 11-4-7" />
                                            <path d="M2 11h20" />
                                            <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
                                            <path d="m9 11 1 9" />
                                            <path d="M4.5 15.5h15" />
                                            <path d="m15 11-1 9" />
                                        </svg>
                                    </div>
                                    <h2 className="title-font font-medium text-3xl text-green-300">{getAllProduct.length}</h2>
                                    <p className="text-gray-300 font-bold">Total Products</p>
                                </div>
                            </Tab>

                            {/* Total Orders */}
                            <Tab className="p-4 md:w-1/4 sm:w-1/2 w-full cursor-pointer">
                                <div className="border bg-blue-700 hover:bg-blue-600 border-blue-600 px-4 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="text-white w-12 h-12 mb-3 mx-auto">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={50}
                                            height={50}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-list-ordered"
                                        >
                                            <line x1={10} x2={21} y1={6} y2={6} />
                                            <line x1={10} x2={21} y1={12} y2={12} />
                                            <line x1={10} x2={21} y1={18} y2={18} />
                                            <path d="M4 6h1v4" />
                                            <path d="M4 10h2" />
                                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                        </svg>
                                    </div>
                                    <h2 className="title-font font-medium text-3xl text-blue-300">{getAllOrder.length}</h2>
                                    <p className="text-gray-300 font-bold">Total Orders</p>
                                </div>
                            </Tab>

                            {/* Total Users */}
                            <Tab className="p-4 md:w-1/4 sm:w-1/2 w-full cursor-pointer">
                                <div className="border bg-purple-700 hover:bg-purple-600 border-purple-600 px-4 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="text-white w-12 h-12 mb-3 mx-auto">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={50}
                                            height={50}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-users"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx={9} cy={7} r={4} />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                    <h2 className="title-font font-medium text-3xl text-purple-300">{getAllUser.length}</h2>
                                    <p className="text-gray-300 font-bold">Total Users</p>
                                </div>
                            </Tab>
                        </TabList>

                        <TabPanel>
                            <ProductDetail />
                        </TabPanel>

                        <TabPanel>
                            <OrderDetail />
                        </TabPanel>

                        <TabPanel>
                            <UserDetail />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
