import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => setOpen(!open);

    const validateFields = () => {
        const { name, address, country, pincode, mobileNumber } = addressInfo;
        return name && address && country && pincode && mobileNumber;
    };

    const handleConfirmPurchase = () => {
        if (!validateFields()) {
            alert("Please fill in all fields before proceeding.");
            return;
        }

        handleOpen();
        buyNowFunction();
        navigate("/purchase"); // Redirect to PurchasePage
    };

    const handleCountryChange = (e) => {
        setAddressInfo({
            ...addressInfo,
            country: e.target.value,
        });
    };

    return (
        <>
            {/* Modern Buy Now Button */}
            <Button
                type="button"
                onClick={handleOpen}
                className="relative w-full px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-l hover:from-blue-500 hover:via-purple-600 hover:to-pink-500"
            >
                <span className="absolute inset-0 bg-white opacity-10 rounded-xl blur-md"></span>
                <span className="relative flex items-center justify-center gap-2">
                    🚀 Buy Now
                </span>
            </Button>

            {/* Modal Dialog */}
            <Dialog
                open={open}
                handler={handleOpen}
                className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-lg"
            >
                <DialogBody className="p-6 text-white">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        📦 Enter Shipping Details
                    </h2>

                    {/* Input Fields */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={addressInfo.name}
                            onChange={(e) =>
                                setAddressInfo({ ...addressInfo, name: e.target.value })
                            }
                            placeholder="Enter your name"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <select
                            name="country"
                            value={addressInfo.country || ""}
                            onChange={handleCountryChange}
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select your country
                            </option>
                            <option value="Nepal">Nepal</option>
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Canada">Canada</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="address"
                            value={addressInfo.address}
                            onChange={(e) =>
                                setAddressInfo({ ...addressInfo, address: e.target.value })
                            }
                            placeholder="Enter your address"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="number"
                            name="pincode"
                            value={addressInfo.pincode}
                            onChange={(e) =>
                                setAddressInfo({ ...addressInfo, pincode: e.target.value })
                            }
                            placeholder="Enter your WhatsApp Number with Country Code"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="mobileNumber"
                            value={addressInfo.mobileNumber}
                            onChange={(e) =>
                                setAddressInfo({ ...addressInfo, mobileNumber: e.target.value })
                            }
                            placeholder="Enter your mobile number"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Confirm Purchase Button */}
                    <div className="mt-6">
                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            className="relative w-full px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 via-teal-600 to-blue-500 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-l hover:from-blue-500 hover:via-teal-600 hover:to-green-500"
                        >
                            <span className="absolute inset-0 bg-white opacity-10 rounded-lg blur-md"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                ✅ Confirm Purchase
                            </span>
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
};

export default BuyNowModal;
