import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Heart, ChevronDown, ZoomIn, X } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

const images = [product1, product2, product3, product4, product2];

const allSpecs = [
  { label: "Net Weight", value: "4.5 kg" },
  { label: "Dimensions MM (WxDxH)", value: "31× 21× 41CM" },
  { label: "Installation Type", value: "Wall Mounted / Counter Top" },
  { label: "Purification Modules", value: "RO + UV + UF + Copper & Zinc" },
  { label: "Purification Stage", value: "8 Stage Purification" },
  { label: "Storage Capacity", value: "6 Litres" },
  { label: "TDS", value: "Up to 2000 ppm" },
  { label: "Water Flow Rate", value: "12-15 Litres/hour" },
  { label: "Input Water Pressure", value: "0.3 - 3 kg/cm²" },
  { label: "Input Water Temperature", value: "10°C - 40°C" },
  { label: "Input Water Chlorine (Max)", value: "1 ppm" },
  { label: "Input Water Turbidity (Max)", value: "5 NTU" },
  { label: "Input Water Iron", value: "0.2 ppm" },
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

/* ── Product card ── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const bumpButton = (e) => {
    e.stopPropagation();
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.93 },
      { scale: 1, duration: 0.35, ease: "back.out(3)" }
    );
  };

  return (
    <div
      ref={cardRef}
      className="pd-product-card bg-white cursor-pointer rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between transition-shadow duration-300 hover:shadow-lg"
      onClick={() => navigate("/product-details")}
    >
      <div className="relative bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
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

      {/* Action row */}
      <div className="flex gap-2 mt-auto">
        <WaterButton
          variant="primary"
          onClick={bumpButton}
          className="flex-1 py-1 px-2 sm:py-2.5 text-[11px] sm:text-sm active:scale-95 transition-transform"
        >
          Book Demo
        </WaterButton>

        <button
          onClick={bumpButton}
          className="flex-1 text-slate-500 text-[10px] sm:text-sm border border-[#F0F3F6]
          rounded-full cursor-pointer hover:text-blue-600 hover:border-[#155DFC] font-medium transition-colors
          py-1 sm:py-2.5 px-2 sm:px-3 active:scale-95"
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

  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const galleryImgContainerRef = useRef(null);
  const swiperRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);

  // Desktop hover-zoom (Amazon-style lens + side panel)
  const ZOOM_LEVEL = 2.5;
  const LENS_SIZE = 160;
  const [showZoomPane, setShowZoomPane] = useState(false);
  const [zoomBgPos, setZoomBgPos] = useState("50% 50%");
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [paneRect, setPaneRect] = useState(null);

  // Mobile tap-to-zoom lightbox (pinch + double-tap)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const lastTapRef = useRef(0);
  const pinchStartDistRef = useRef(null);
  const pinchStartScaleRef = useRef(1);

  /* ── Go to a given slide, keeping the Swiper instance and state in sync ── */
  const goToSlide = (index) => {
    const wrapped = (index + images.length) % images.length;
    setMainImg(wrapped);
    if (swiperRef.current) {
      swiperRef.current.slideTo(wrapped);
    }
  };

  const prevImg = () => goToSlide(mainImg - 1);
  const nextImg = () => goToSlide(mainImg + 1);

  /* ── Mobile swipe handlers for the main gallery image ── */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isSwiping.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const SWIPE_THRESHOLD = 45;
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      prevImg();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      nextImg();
    }
    touchDeltaX.current = 0;
  };

  const bumpButton = (el) => {
    if (!el) return;
    gsap.fromTo(
      el,
      { scale: 0.9 },
      { scale: 1, duration: 0.35, ease: "back.out(3)" }
    );
  };

  /* ── Desktop hover-zoom: lens + side zoom pane (lg and up only) ── */
  const handleGalleryMouseEnter = () => {
    if (window.innerWidth < 1024 || !galleryImgContainerRef.current) return;
    const rect = galleryImgContainerRef.current.getBoundingClientRect();
    setPaneRect({ top: rect.top, left: rect.right + 24 });
    setShowZoomPane(true);
  };

  const handleGalleryMouseMove = (e) => {
    if (window.innerWidth < 1024 || !galleryImgContainerRef.current) return;
    const rect = galleryImgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensX = Math.min(Math.max(x - LENS_SIZE / 2, 0), rect.width - LENS_SIZE);
    const lensY = Math.min(Math.max(y - LENS_SIZE / 2, 0), rect.height - LENS_SIZE);
    setLensPos({ x: lensX, y: lensY });

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    setZoomBgPos(`${bgX}% ${bgY}%`);
  };

  const handleGalleryMouseLeave = () => setShowZoomPane(false);

  /* ── Mobile lightbox: open/close ── */
  const openLightbox = () => {
    if (window.innerWidth >= 1024) return;
    setZoomScale(1);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomScale(1);
  };

  /* ── Mobile lightbox: pinch-to-zoom + double-tap-to-zoom + swipe ── */
  const getTouchDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleLightboxTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchStartDistRef.current = getTouchDistance(e.touches);
      pinchStartScaleRef.current = zoomScale;
      return;
    }

    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchDeltaX.current = 0;
      isSwiping.current = true;

      const now = Date.now();
      const rect = e.currentTarget.getBoundingClientRect();
      const tapX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const tapY = ((e.touches[0].clientY - rect.top) / rect.height) * 100;

      if (now - lastTapRef.current < 300) {
        setTransformOrigin(`${tapX}% ${tapY}%`);
        setZoomScale((s) => (s > 1 ? 1 : 2.5));
      }
      lastTapRef.current = now;
    }
  };

  const handleLightboxTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistRef.current) {
      const newDist = getTouchDistance(e.touches);
      const scale = Math.min(
        Math.max(
          (newDist / pinchStartDistRef.current) * pinchStartScaleRef.current,
          1
        ),
        3
      );
      setZoomScale(scale);
      return;
    }

    if (e.touches.length === 1 && zoomScale === 1) {
      handleTouchMove(e);
    }
  };

  const handleLightboxTouchEnd = (e) => {
    if (e.touches.length === 0) {
      pinchStartDistRef.current = null;
      if (zoomScale === 1) {
        handleTouchEnd();
      } else {
        isSwiping.current = false;
      }
    }
  };

  // product info
  const VISIBLE_COUNT = 13;
  const [showAll, setShowAll] = useState(false);

  const specs = showAll ? allSpecs : allSpecs.slice(0, VISIBLE_COUNT);

  /* ── Crossfade the main gallery image whenever it changes ── */
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !imgRef.current) return;

    gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [mainImg]);

  /* ── Lock background scroll while the zoom lightbox is open ── */
  useLayoutEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  /* ── Reveal newly expanded spec rows ── */
  useLayoutEffect(() => {
    if (!showAll) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      ".pd-extra-row",
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" }
    );
  }, [showAll]);

  /* ── Page load reveal + scroll-triggered sections ── */
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });

      heroTl
        .fromTo(".pd-gallery", { opacity: 0, y: 24 }, { opacity: 1, y: 0 })
        .fromTo(
          ".pd-title",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.45"
        )
        .fromTo(
          ".pd-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0 },
          "-=0.45"
        )
        .fromTo(
          ".pd-feature",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, stagger: 0.12 },
          "-=0.35"
        )
        .fromTo(
          ".pd-price",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0 },
          "-=0.3"
        )
        .fromTo(
          ".pd-actions",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0 },
          "-=0.35"
        );

      // Generic fade-up reveal for below-the-fold sections
      gsap.utils.toArray(".pd-scroll-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

      // Spec table rows, staggered in on first scroll into view
      gsap.fromTo(
        ".pd-spec-row",
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".pd-spec-table",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Testimonials
      ScrollTrigger.batch(".pd-testimonial-card", {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
            }
          ),
      });

      // Top purifiers grid
      ScrollTrigger.batch(".pd-product-card", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            }
          ),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen pt-25 lg:pt-33 bg-white">
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
          <div className="pd-gallery relative w-full lg:w-[45%] flex-shrink-0">
            {/* Main image */}
            <div
              ref={galleryImgContainerRef}
              className="relative overflow-hidden flex items-center justify-center w-full h-[340px] sm:h-[420px] lg:h-[500px] bg-white touch-pan-y lg:cursor-zoom-in"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={handleGalleryMouseEnter}
              onMouseMove={handleGalleryMouseMove}
              onMouseLeave={handleGalleryMouseLeave}
            >
              <button
                onClick={prevImg}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                aria-label="Previous image"
                className="hidden sm:flex absolute left-3 z-10 w-9 h-9 rounded-full cursor-pointer bg-white shadow-md items-center justify-center text-gray-500 hover:text-gray-800 hover:scale-110 active:scale-90 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>

              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={1}
                onSlideChange={(swiper) => setMainImg(swiper.activeIndex)}
                className="w-full h-full"
              >
                {images.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <img
                      ref={index === mainImg ? imgRef : null}
                      src={img}
                      alt={`Product view ${index + 1}`}
                      onClick={openLightbox}
                      className="w-full h-[340px] sm:h-[420px] lg:h-[500px] object-contain"
                      draggable={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Mobile Image Counter */}
              <div className="absolute top-3 right-3 lg:hidden">
                <div className="bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {mainImg + 1} / {images.length}
                </div>
              </div>

              <button
                onClick={nextImg}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                aria-label="Next image"
                className="hidden select-none sm:flex absolute right-3 z-10 w-9 h-9 rounded-full cursor-pointer bg-[#0061C2] shadow-md items-center justify-center text-white hover:scale-110 active:scale-90 transition-transform"
              >
                <ArrowRight size={20} />
              </button>

              {/* Lens overlay — follows the cursor, desktop only */}
              {showZoomPane && (
                <div
                  className="hidden lg:block absolute pointer-events-none border-2 border-white/90 bg-white/20 shadow-inner"
                  style={{
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    left: lensPos.x,
                    top: lensPos.y,
                  }}
                />
              )}
            </div>

            {/* Desktop zoom pane — portaled to <body> so it always paints
                above the page, no matter what stacking context any GSAP
                transform elsewhere on the page creates */}
            {showZoomPane &&
              paneRect &&
              createPortal(
                <div
                  className="hidden lg:block fixed border border-gray-200 shadow-2xl rounded-xl overflow-hidden pointer-events-none"
                  style={{
                    top: paneRect.top,
                    left: paneRect.left,
                    width: 500,
                    height: 440,
                    backgroundColor: "#ffffff",
                    backgroundImage: `url(${images[mainImg]})`,
                    backgroundSize: `${ZOOM_LEVEL * 100}%`,
                    backgroundPosition: zoomBgPos,
                    backgroundRepeat: "no-repeat",
                    zIndex: 9999,
                  }}
                />,
                document.body
              )}

            {/* Mobile dot navigation — swipe the image above or tap a dot */}
            <div className="flex lg:hidden justify-center items-center gap-1.5 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={mainImg === i}
                  className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 active:scale-90 ${
                    mainImg === i
                      ? "w-6 bg-[#0061C2]"
                      : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnails */}
            <div className="hidden lg:flex gap-2 sm:gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-current={mainImg === i}
                  className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 active:scale-95
        w-16 h-16
        sm:w-20 sm:h-20
        md:w-20 md:h-20
        lg:w-20 lg:h-20
        xl:w-22 xl:h-22
        ${
          mainImg === i
            ? "border-[#0061C2] opacity-100 shadow-md shadow-blue-100"
            : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
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
            <h1 className="pd-title text-2xl heading sm:text-3xl font-semibold text-gray-900 leading-tight">
              Aqualife Ever LEGO+ Water Purifier
            </h1>

            {/* Short desc */}
            <p className="pd-desc mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
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
              <div className="pd-feature">
                <h3 className="text-sm heading sm:text-base font-bold text-gray-900">
                  RO Purification
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Removes contaminants like lead and mercury and eliminates
                  disease-causing viruses and bacteria.
                </p>
              </div>

              <div className="pd-feature">
                <h3 className="text-sm heading sm:text-base font-bold text-gray-900">
                  Smart Display
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
                  onClick={(e) => {
                    setShowMore(!showMore);
                    bumpButton(e.currentTarget);
                  }}
                  className="mt-2 flex items-center gap-1 text-sm font-medium text-[#0061C2] cursor-pointer transition-colors hover:text-[#004A99] active:scale-95"
                >
                  {showMore ? "Show Less" : "Show More"}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-5 border-gray-100" />

            {/* Color */}
            <p className="pd-feature text-sm heading sm:text-base font-semibold text-gray-800">
              Color: <span className="font-semibold">Black</span>
            </p>

            {/* Divider */}
            <hr className="my-5 border-gray-100" />

            {/* Pricing */}
            <div className="pd-price flex flex-wrap items-baseline sm:gap-3">
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
            <div className="pd-actions mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Quantity */}
              <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={(e) => {
                    setQty((q) => Math.max(1, q - 1));
                    bumpButton(e.currentTarget);
                  }}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <FiMinus size={16} />
                </button>

                <span className="min-w-[45px] h-11 flex items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                  {qty}
                </span>

                <button
                  onClick={(e) => {
                    setQty((q) => q + 1);
                    bumpButton(e.currentTarget);
                  }}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={(e) => bumpButton(e.currentTarget)}
                className="flex cursor-pointer items-center gap-2 bg-[#0061C2] hover:bg-[#0052A6] text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors active:scale-95 duration-200"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>

              {/* Add to Wishlist */}
              <button
                onClick={(e) => bumpButton(e.currentTarget)}
                className="flex items-center cursor-pointer gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 text-sm font-medium px-5 py-3 rounded-xl transition-all active:scale-95 duration-200"
              >
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
          <h2 className="pd-scroll-section text-2xl sm:text-3xl font-bold heading text-gray-900">
            Product information
          </h2>
          <p className="text-sm text-gray-400 mt-1 mb-6">Technical Details</p>
          {/* Specs table */}
          <div className="pd-spec-table divide-y divide-[#626C7A24]">
            {specs.map(({ label, value }, idx) => (
              <div
                key={label}
                className={`pd-spec-row flex items-center py-3.5 gap-4 ${
                  idx >= VISIBLE_COUNT ? "pd-extra-row" : ""
                }`}
              >
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
            onClick={(e) => {
              setShowAll((s) => !s);
              bumpButton(e.currentTarget);
            }}
            className="mt-5 flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors active:scale-95"
          >
            {showAll ? "Show Less" : "Show More"}
            <ChevronDown
              size={15}
              className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* info banner */}
      <AlkalineWaterBanner />

      <DownloadPdf />

      {/* What Customers Are Saying */}
      <section className="bg-[#FFF9F9] py-10 sm:py-12">
        <div className="primary-container">
          {/* Heading */}
          <div className="pd-scroll-section max-w-4xl mb-10">
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
                className="pd-testimonial-card overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition duration-300"
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
          <div className="pd-scroll-section max-w-4xl mb-10">
            <h2 className="heading text-3xl lg:text-4xl font-semibold text-[#191919]">
              Explore our Top Water Purifiers
            </h2>

            <p className="mt-3 text-[#191919]">
              Find our top-selling water purifiers designed to offer unmatched
              purity and long-lasting performance.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* faq */}
      <FaqSection className="pb-15" />

      {/* ── Mobile zoom lightbox: pinch, double-tap, or swipe ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col lg:hidden">
          <button
            onClick={closeLightbox}
            aria-label="Close zoomed image view"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <X size={22} />
          </button>

          <div
            className="flex-1 flex items-center justify-center overflow-hidden"
            style={{ touchAction: "none" }}
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <img
              src={images[mainImg]}
              alt="Product zoomed"
              draggable={false}
              className="max-h-full max-w-full object-contain select-none"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin,
                transition: "transform 0.2s ease-out",
              }}
            />
          </div>

          <p className="text-center text-white/50 text-xs pb-2">
            Pinch or double-tap to zoom · swipe to change image
          </p>

          {/* Dot navigation inside the lightbox */}
          <div className="flex justify-center items-center gap-1.5 pb-6">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={mainImg === i}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 active:scale-90 ${
                  mainImg === i ? "w-6 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}