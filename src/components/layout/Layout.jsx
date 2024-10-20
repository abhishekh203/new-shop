/* eslint-disable react/prop-types */
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

const Layout = ({ children }) => {
    return (
        <div className="bg-gradient-to-r from-black to-blue-600 min-h-screen">
            <Navbar />
            <div className="main-content">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
