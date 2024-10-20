import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router";

const SearchBar = () => {
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Filter search data and limit results
    const filterSearchData = getAllProduct.filter((obj) =>
        obj.title.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8);

    return (
        <div className="relative">
            {/* Search input */}
            <div className="flex justify-center">
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-gray-200 placeholder-gray-400 rounded-lg px-3 py-2 w-72 outline-none text-black focus:bg-white focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            {/* Search dropdown */}
            <div className="flex justify-center">
                {search && (
                    <div className="absolute bg-white w-72 shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
                        {filterSearchData.length > 0 ? (
                            filterSearchData.map((item, index) => (
                                <div
                                    key={index}
                                    className="py-1 px-2 cursor-pointer hover:bg-blue-100 flex items-center gap-2 transition duration-150"
                                    onClick={() => navigate(`/productinfo/${item.id}`)}
                                >
                                    <img className="w-8 h-8 object-cover rounded-full" src={item.productImageUrl} alt={item.title} />
                                    <span className="text-sm text-gray-700">{item.title}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-2">
                                <p className="text-gray-500">No results found</p>
                                <img className="mx-auto w-16" src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png" alt="No results" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
