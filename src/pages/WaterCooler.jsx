import React from "react";
import banner1 from "../assets/product_listing_banner.png";
import ProductListing from "../components/ProductListing";
import AlkalineWaterBanner from "../components/AlkalineWaterBanner";

const WaterCooler = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero Banner */}
      <section className="w-full">
        <div
          className="relative w-full overflow-hidden
            aspect-[4/5]
            sm:aspect-[16/10]
            lg:aspect-[1440/630]"
        >
          <img
            src={banner1}
            alt="Water Cooler Banner"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Product Listing */}
      <section className="py-10 sm:py-12 lg:py-16">
        <ProductListing />
      </section>

      {/* Bottom Banner */}
      <section className="w-full">
        <AlkalineWaterBanner />
      </section>
    </main>
  );
};

export default WaterCooler;