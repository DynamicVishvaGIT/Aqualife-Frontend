import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import WaterPurifiers from "./pages/WaterPurifiers";
import WaterCooler from "./pages/WaterCooler";
import WaterSofteners from "./pages/WaterSofteners";
import ROPlant from "./pages/ROPlant";
import ContactUs from "./pages/ContactUs";
import ProductDetail from "./components/ProductDetails";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import OtpVerification from "./pages/OtpVerification";
import Profile from "./pages/Profile";
import Orders from "./pages/MyOrders";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import PageNotFound from "./pages/PageNotFound";
import AddressForm from "./pages/AddressForm";
import SelectAddress from "./pages/SelectAddress";

const HIDE_LAYOUT_PATHS = ["/otp-verification",];

function App() {
  const location = useLocation();

  const showLayout = !HIDE_LAYOUT_PATHS.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {showLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/water-purifiers" element={<WaterPurifiers />} />
        <Route path="/water-cooler" element={<WaterCooler />} />
        <Route path="/water-softeners" element={<WaterSofteners />} />
        <Route path="/ro-plant" element={<ROPlant />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/product-details" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/checkout-address" element={<AddressForm />} />
        <Route path="/select-address" element={<SelectAddress />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {showLayout && <Footer />}
    </>
  );
}

export default App;