import React from "react";
import banner1 from "../assets/product_listing_banner.png";
import ProductListing from "../components/ProductListing";
import AlkalineWaterBanner from "../components/AlkalineWaterBanner";
import FaqSection from "../components/FaqSection";
import Breadcrumb from "../components/Breadcrumb";

const WaterPurifiers = () => {
  return (
    <main className="w-full overflow-x-hidden pt-20 lg:pt-20">
      {/* Hero Banner */}
      <div
        className="relative w-full overflow-hidden
      aspect-[4/5]
      sm:aspect-[16/10]
      lg:aspect-[1440/572]"
      >
        <img
          src={banner1}
          alt="Water Cooler Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Breadcrumb */}
        <div className="absolute top-2 lg:top-14 left-0 w-full z-10">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <ProductListing />

      {/* Bottom Banner */}
      <AlkalineWaterBanner />

      {/* faq */}
      <FaqSection className="py-10" />
    </main>
  );
};

export default WaterPurifiers;
