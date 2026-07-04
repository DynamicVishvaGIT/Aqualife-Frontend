import { useState } from "react";
import { ShoppingCart, Heart, ChevronDown } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";
import Breadcrumb from "./Breadcrumb";
import { FiMinus, FiPlus } from "react-icons/fi";
import AlkalineWaterBanner from "./AlkalineWaterBanner";
import user1 from "../assets/user_1.png";
import user2 from "../assets/user_2.png";
import { WaterButton } from "../components/WaterButton";
import { useNavigate } from "react-router-dom";
import FaqSection from "../components/FaqSection";
import DownloadPdf from "./DownloadPdf";


const images = [product1, product2, product3, product4, product2];

const allSpecs = [
  { label: "Net Weight", value: "4.5 kg" },
  { label: "Dimensions MM (WxDxH)", value: "31× 21× 41CM" },
  { label: "Installation Type", value: "4.5 kg" },
  { label: "Purification Modules", value: "31× 21× 41CM" },
  { label: "Purification Stage", value: "4.5 kg" },
  { label: "Storage Capacity", value: "31× 21× 41CM" },
  { label: "TDS", value: "4.5 kg" },
  { label: "Water Flow Rate", value: "31× 21× 41CM" },
  { label: "Input Water Pressure", value: "4.5 kg" },
  { label: "Input Water Temperature", value: "31× 21× 41CM" },
  { label: "Input Water Chlorine (Max)", value: "4.5 kg" },
  { label: "Input Water Turbidity (Max)", value: "31× 21× 41CM" },
  { label: "Input Water Iron", value: "4.5 kg" },
  // hidden rows (shown after "Show More")
  { label: "Voltage", value: "220V / 50Hz" },
  { label: "Power Consumption", value: "60 W" },
  { label: "Warranty", value: "1 Year" },
];

const TESTIMONIALS = [
  {
    id: 1,
    image: user1,
    text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
    name: "Priya Sharma",
    location: "Mumbai",
  },
  {
    id: 2,
    image: user2,
    text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
    name: "Karthik Reddy",
    location: "Mumbai",
  },
  {
    id: 3,
    image: user1,
    text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
    name: "Anita Patel",
    location: "Delhi",
  },
  {
    id: 4,
    image: user2,
    text: "We faced a lot of throat issues with corporation water, but after switching to Aqualife there are no health issues. It is hassle free with easy subscription, customer support and tracking in app.",
    name: "Karthik Reddy",
    location: "Mumbai",
  },
];

/* ── Mock products ── */
const PRODUCTS = [
  {
    id: 1,
    image: product1,
    badge: "New launch",
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 2,
    image: product2,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 3,
    image: product3,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
];

// cards
/* ── Product card ── */
function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white cursor-pointer rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between"
      onClick={() => navigate("/product-details")}
    >
      <div className="relative  bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-400 text-[11px] sm:text-[13px] mt-0.5 mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mb-3 sm:mb-4">
          <p className="text-lg sm:text-[22px] font-bold text-slate-900 leading-none mb-1">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[11px] sm:text-[13px]">
            <span className="text-slate-400">MRP</span>
            <span className="text-slate-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-green-500 font-semibold whitespace-nowrap">
              ({product.discount}% OFF)
            </span>
          </div>
        </div>
      </div>

      {/* Action row — optimized touch target sizing on mobile */}
      <div className="flex gap-2 mt-auto">
        <WaterButton
          variant="primary"
          className="flex-1 py-1 px-2 sm:py-2.5 text-[11px] sm:text-sm"
        >
          Book Demo
        </WaterButton>

        <button
          className="flex-1 text-slate-500 text-[10px] sm:text-sm border border-[#F0F3F6]
          rounded-full cursor-pointer hover:text-blue-600 hover:border-[#155DFC] font-medium transition-colors
          py-1 sm:py-2.5 px-2 sm:px-3"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [showMore, setShowMore] = useState(false);

  const prevImg = () =>
    setMainImg((p) => (p - 1 + images.length) % images.length);
  const nextImg = () => setMainImg((p) => (p + 1) % images.length);

  //   product info
  const VISIBLE_COUNT = 13;
  const [showAll, setShowAll] = useState(false);

  const specs = showAll ? allSpecs : allSpecs.slice(0, VISIBLE_COUNT);

  return (
    <div className="relative min-h-screen  pt-25 lg:pt-33 bg-white">
      {/* Breadcrumb */}
      <div className="absolute left-0 w-full z-10">
        <div className="primary-container">
          <Breadcrumb />
        </div>
      </div>

      <div className="primary-container py-8 sm:py-12">
        {/* product details */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── LEFT: Image Gallery ── */}
          <div className="w-full lg:w-[45%] flex-shrink-0">
            {/* Main image */}
            <div className="relative overflow-hidden flex items-center justify-center h-72 sm:h-96">
              <button
                onClick={prevImg}
                className="absolute left-3 z-10 w-9 h-9 rounded-full cursor-pointer bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
              >
                <ArrowLeft size={20} />
              </button>

              <img
                src={images[mainImg]}
                alt="Product"
                className="h-full w-full object-contain p-4"
              />

              <button
                onClick={nextImg}
                className="absolute right-3 z-10 w-9 h-9 rounded-full cursor-pointer bg-[#0061C2] shadow-md flex items-center justify-center text-white transition"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition
        w-16 h-16
        sm:w-20 sm:h-20
        md:w-20 md:h-20
        lg:w-20 lg:h-20
        xl:w-22 xl:h-22
        ${
          mainImg === i
            ? "border-[#0061C2]"
            : "border-gray-200 hover:border-gray-400"
        }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-contain bg-white p-1"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="w-full lg:w-[55%]">
            {/* Title */}
            <h1 className="text-2xl heading sm:text-3xl font-semibold text-gray-900 leading-tight">
              Aqualife Ever LEGO+ Water Purifier
            </h1>

            {/* Short desc */}
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">
                RO + UV + UF + Copper &amp; Zinc + Mineral
              </span>{" "}
              Technology Water Purifier. Designed to suit the needs of small
              firms, shops, and businesses with 6 litres storage capacity,
              ensuring employees get access to pure drinking water.
            </p>

            {/* Divider */}
            <hr className="my-5 border-gray-100" />

            {/* Top Features */}
            <h2 className="text-base heading sm:text-lg font-bold text-[#0061C2] mb-4">
              Top Features
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm heading sm:text-base font-bold text-gray-900">
                  RO Purification
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Removes contaminants like lead and mercury and eliminates
                  disease-causing viruses and bacteria.
                </p>
              </div>

              <div>
                <h3 className="text-sm heading sm:text-base font-bold text-gray-900">
                  RO Purification
                </h3>
                <p
                  className={`text-sm text-gray-500 mt-1 leading-relaxed ${!showMore ? "line-clamp-3" : ""}`}
                >
                  Live TDS Status, Filter Life Indicator System, Sensor Base
                  Technology. The LED display acts as a smart indicator and also
                  assists you in hassle-free operations. The water level
                  indicator enables you to check the water quantity in the tank,
                  while the service and fault indicator throws light on the
                  issues that need your attention.
                </p>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-2 flex items-center gap-1 text-sm font-medium text-[#0061C2] ransition"
                >
                  {showMore ? "Show Less" : "Show More"}
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${showMore ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-5 border-gray-100" />

            {/* Color */}
            <p className="text-sm heading sm:text-base font-semibold text-gray-800">
              Color: <span className="font-semibold">Black</span>
            </p>

            {/* Divider */}
            <hr className="my-5 border-gray-100" />

            {/* Pricing */}
            <div className="flex flex-wrap items-baseline sm:gap-3">
              <span className="text-sm font-medium line-through">
                MRP ₹23,000.00
              </span>
              <span className="text-xl sm:text-2xl heading font-semibold text-gray-900">
                ₹ 12,599.00
              </span>
              <span className="text-sm font-semibold text-green-600 bg-[#E9FFF4] rounded-sm">
                (25% OFF)
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Tax included.</p>

            {/* Qty + Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Quantity */}
              <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <FiMinus size={18} />
                </button>

                <span className="min-w-[56px] h-12 flex items-center justify-center border-x border-gray-300 text-base font-semibold text-gray-900">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <FiPlus size={18} />
                </button>
              </div>

              {/* Add to Cart */}
              <button className="flex cursor-pointer  items-center gap-2 bg-[#0061C2] hover:bg-[#0061C2] text-white text-sm font-medium px-5 py-3 rounded-xl transition">
                <ShoppingCart size={16} />
                Add to Cart
              </button>

              {/* Add to Wishlist */}
              <button className="flex items-center cursor-pointer  gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 text-sm font-medium px-5 py-3 rounded-xl transition">
                <Heart size={16} />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* product info section */}
      <div className="bg-[#F5F9FF] min-h-screen py-10">
        <div className="primary-container">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold heading text-gray-900">
            Product information
          </h2>
          <p className="text-sm text-gray-400 mt-1 mb-6">Technical Details</p>
          {/* Specs table */}
          <div className="divide-y divide-[#626C7A24]">
            {specs.map(({ label, value }) => (
              <div key={label} className="flex items-center py-3.5 gap-4">
                <span className="w-1/2 text-sm text-[#191919] font-semibold leading-snug">
                  {label}
                </span>
                <span className="w-1/2 text-sm text-[#626C7A] leading-snug">
                  {value}
                </span>
              </div>
            ))}
          </div>
          {/* Show More / Less */}
          <button
            onClick={() => setShowAll((s) => !s)}
            className="mt-5 flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            {showAll ? "Show Less" : "Show More"}
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* info banner */}
      <AlkalineWaterBanner />

    <DownloadPdf/>

      {/* What Customers Are Saying */}
      <section className="bg-[#FFF9F9] py-10 sm:py-12">
        <div className="primary-container">
          {/* Heading */}
          <div className="max-w-4xl mb-10">
            <h2 className="heading text-3xl lg:text-4xl font-semibold text-[#191919]">
              What Customers Are Saying
            </h2>

            <p className="mt-3 text-[#191919]">
              Real experiences from real users. Discover why families trust
              Aqualife for their water and home needs.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col h-[220px]">
                  <p className="text-[15px] leading-6 text-[#626C7A] line-clamp-5">
                    {item.text}
                  </p>

                  <div className="mt-auto pt-5">
                    <h4 className="font-semibold text-lg text-[#191919]">
                      {item.name}
                    </h4>

                    <p className="text-sm text-[#7A7A7A]">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* top Water Purifiers */}
      <section className="bg-[#FFFFFF] py-10 sm:py-12">
        <div className="primary-container">
          {/* Heading */}
          <div className="max-w-4xl mb-10">
            <h2 className="heading text-3xl lg:text-4xl font-semibold text-[#191919]">
              Explore our Top Water Purifiers
            </h2>

            <p className="mt-3 text-[#191919]">
              Find our top-selling water purifiers designed to offer unmatched
              purity and long-lasting performance.
            </p>
          </div>

          {/* Cards */}
          {/* Product grid — 2 columns on mobile, scaling up smoothly */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      <FaqSection className="pb-15"/>
    </div>
  );
}
