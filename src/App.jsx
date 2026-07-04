import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import WaterPurifiers from "./pages/WaterPurifiers";
import WaterCooler from "./pages/WaterCooler";
import WaterSofteners from "./pages/WaterSofteners";
import ROPlant from "./pages/ROPlant";
import ContactUs from "./pages/ContactUs";
import {Footer} from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProductDetail from "./components/ProductDetails";
import Cart from "./pages/Cart";
import SignUp from "./pages/SignUp";

import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      
      <Navbar />

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
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      <Footer />

    </>
  );
}

export default App;