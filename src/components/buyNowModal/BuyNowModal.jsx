// src/components/BuyNowModal.js

import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => setOpen(!open);

    const handleConfirmPurchase = () => {
        handleOpen();
        buyNowFunction();
        navigate('/purchase'); // Correct path for PurchasePage
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-white bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 border border-transparent dark:border-gray-700 hover:bg-gradient-to-l hover:from-orange-500 hover:via-red-500 hover:to-pink-600 rounded-xl"
            >
                Buy Now
            </Button>
            <Dialog open={open} handler={handleOpen} className="bg-gradient-to-br from-black to-blue-600">
                <DialogBody className="p-6 text-white">
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={addressInfo.name}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    name: e.target.value
                                });
                            }}
                            placeholder="Enter your name"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="address"
                            value={addressInfo.address}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    address: e.target.value
                                });
                            }}
                            placeholder="Enter your address"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="number"
                            name="pincode"
                            value={addressInfo.pincode}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    pincode: e.target.value
                                });
                            }}
                            placeholder="Enter your pincode"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="mobileNumber"
                            value={addressInfo.mobileNumber}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    mobileNumber: e.target.value
                                });
                            }}
                            placeholder="Enter your mobile number"
                            className="bg-gray-800 border border-blue-300 px-4 py-2 w-full rounded-md outline-none text-white placeholder-blue-400 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-6">
                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            className="w-full px-4 py-3 text-center text-white bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 border border-transparent rounded-lg hover:bg-gradient-to-l hover:from-orange-500 hover:via-red-500 hover:to-pink-600"
                        >
                            Confirm Purchase
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}

export default BuyNowModal;
