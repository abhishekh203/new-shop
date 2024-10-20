import { useContext } from "react";
import myContext from "../../context/myContext";

const UserDetail = () => {
    const context = useContext(myContext);
    const { getAllUser } = context;

    return (
        <div className="bg-gradient-to-r from-black to-blue-500 py-12 min-h-screen"> {/* Gradient background */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-5 flex justify-between items-center">
                    <h1 className="text-2xl text-green-600 font-bold">All Users</h1>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full text-left border-collapse border border-gray-300">
                        <thead className="bg-green-50">
                            <tr>
                                <th className="h-16 px-6 text-lg border-b border-gray-300 text-green-700 font-semibold">S.No.</th>
                                <th className="h-16 px-6 text-lg border-b border-gray-300 text-green-700 font-semibold">Name</th>
                                <th className="h-16 px-6 text-lg border-b border-gray-300 text-green-700 font-semibold">Email</th>
                                <th className="h-16 px-6 text-lg border-b border-gray-300 text-green-700 font-semibold">Uid</th>
                                <th className="h-16 px-6 text-lg border-b border-gray-300 text-green-700 font-semibold">Role</th>
                                <th className="h-16 px-6 text-lg border-b border-gray-300 text-green-700 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-50">
                            {getAllUser.map((value, index) => (
                                <tr key={index} className="hover:bg-green-50 transition duration-300">
                                    <td className="h-16 px-6 text-md border-t border-gray-300 text-gray-700">{index + 1}</td>
                                    <td className="h-16 px-6 text-md border-t border-gray-300 text-gray-700">{value.name}</td>
                                    <td className="h-16 px-6 text-md border-t border-gray-300 text-gray-700">{value.email}</td>
                                    <td className="h-16 px-6 text-md border-t border-gray-300 text-gray-700">{value.uid}</td>
                                    <td className="h-16 px-6 text-md border-t border-gray-300 text-gray-700">{value.role}</td>
                                    <td className="h-16 px-6 text-md border-t border-gray-300 text-gray-700">{value.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
