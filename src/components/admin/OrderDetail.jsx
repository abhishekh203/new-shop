import { useContext } from "react";
import myContext from "../../context/myContext";

const OrderDetail = () => {
    const context = useContext(myContext);
    const { getAllOrder, orderDelete } = context;

    return (
        <div className="min-h-screen bg-black text-white py-5">
            <div>
                {/* Header */}
                <h1 className="text-xl text-pink-300 font-bold text-center">All Orders</h1>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border border-collapse sm:border-separate border-pink-100 text-pink-400">
                        <thead>
                            <tr>
                                {["S.No.", "Order Id", "Image", "Title", "Category", "Price", "Quantity", "Total Price", "Status", "Name", "Address", "Pincode", "Phone Number", "Email", "Date", "Action"].map((header, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="h-12 px-6 text-md font-bold border-b border-pink-100 bg-slate-800"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getAllOrder.map((order) => (
                                <>
                                    {order.cartItems.map((item, index) => {
                                        const { id, productImageUrl, title, category, price, quantity } = item;
                                        return (
                                            <tr key={index} className="text-pink-300">
                                                <td className="h-12 px-6 text-md border-t border-green-100">{index + 1}</td>
                                                <td className="h-12 px-6 text-md border-t border-green-100">{id}</td>
                                                <td className="h-12 px-6 text-md border-t border-green-100">
                                                    <img src={productImageUrl} alt="img" className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{title}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{category}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">₹{price}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{quantity}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">₹{price * quantity}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.status}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.addressInfo.name}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.addressInfo.address}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.addressInfo.pincode}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.addressInfo.mobileNumber}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.email}</td>
                                                <td className="h-12 px-6 text-md border-t border-pink-100">{order.date}</td>
                                                <td onClick={() => orderDelete(order.id)} className="h-12 px-6 text-md border-t border-pink-100 text-red-500 cursor-pointer">
                                                    Delete
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
