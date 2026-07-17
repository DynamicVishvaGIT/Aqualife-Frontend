import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const WaterPurifiers = lazy(() => import("./pages/WaterPurifiers"));
const WaterCooler = lazy(() => import("./pages/WaterCooler"));
const WaterSofteners = lazy(() => import("./pages/WaterSofteners"));
const ROPlant = lazy(() => import("./pages/ROPlant"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ProductDetail = lazy(() => import("./components/ProductDetails"));
const Signup = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const OtpVerification = lazy(() => import("./pages/OtpVerification"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/MyOrders"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AddressForm = lazy(() => import("./pages/AddressForm"));
const SelectAddress = lazy(() => import("./pages/SelectAddress"));

import "./App.css";
import Loader from "./components/Loader";

function App() {
  const location = useLocation();

  const hideLayout = ["/otp-verification"].includes(location.pathname);
  const notFoundPage = ["*"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!notFoundPage && <Navbar />}

      <Suspense fallback={<Loader />}>
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
      </Suspense>

      {!hideLayout && !notFoundPage && <Footer />}
    </>
  );
}

export default App;