import { useEffect, useRef, useState } from "react";
import BlogHeroImg from "../assets/ro_banner_1.png";
import img_3 from "../assets/familyImg.png";
import Breadcrumb from "../components/Breadcrumb";
import img_1 from "../assets/ro_banner.jpg";
import img_2 from "../assets/softer_img_2.png";
import img_4 from "../assets/softer_img_2.png";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const THEME = "#0061C2";
const PAGE_SIZE = 6;

const BLOG_DATA = [
  { id: 1, image: img_1, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=1" },
  { id: 2, image: img_2, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=2" },
  { id: 3, image: img_3, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=3" },
  { id: 4, image: img_4, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=4" },
  { id: 5, image: img_3, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=5" },
  { id: 6, image: img_1, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=6" },
  { id: 7, image: img_3, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=7" },
  { id: 8, image: img_2, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=8" },
  { id: 9, image: img_3, category: "Technology", title: "Air Purifier for Babies & Toddlers: What Parents Need to Know", author: "Tracey Wilson", date: "August 20, 2022", avatar: "https://i.pravatar.cc/32?img=9" },
];

/* ─────────────────────────────────────────
   Single unified BlogCard
───────────────────────────────────────── */
function BlogCard({ post, cardRef }) {
  return (
    <Link
      ref={cardRef}
      to="/blog-details"
      className="group select-none relative rounded-2xl overflow-hidden cursor-pointer min-h-[420px]
        transition-shadow duration-500 hover:shadow-[0_20px_45px_-15px_rgba(0,97,194,0.45)]"
    >
      <img
        src={post.image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover object-top
          transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(160,160,160,0.5) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      {/* Theme-colored ring that appears on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 2px ${THEME}` }}
      />

      <div className="absolute heading bottom-0 left-0 right-0 px-6 pb-8 flex flex-col gap-3 text-white">
        <span
          className="text-[11px] font-bold tracking-[0.14em] uppercase w-fit px-2.5 py-1 rounded-full
            transition-colors duration-300"
          style={{ backgroundColor: "rgba(0,97,194,0.85)", color: "#fff" }}
        >
          {post.category}
        </span>

        <p
          className="text-[15px] heading font-semibold leading-relaxed text-white
            transition-transform duration-500 group-hover:-translate-y-1"
        >
          {post.title}
        </p>

        <div className="flex justify-between items-center gap-4 mt-1">
          <div className="flex justify-between gap-2 items-center">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-7 h-7 rounded-full object-cover border-2 transition-colors duration-300"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            />
            <span className="text-sm text-white/90 font-medium">{post.author}</span>
          </div>
          <div className="flex justify-between gap-2 items-center">
            <span className="text-white/50">•</span>
            <span className="text-xs text-white/70">{post.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
const Blogs = () => {
  const heroWrapRef     = useRef(null);
  const heroImgRef      = useRef(null);
  const heroGradientRef = useRef(null);
  const breadcrumbRef   = useRef(null);
  const heroTitleRef    = useRef(null);
  const cardRefs        = useRef([]);
  const prevCountRef    = useRef(0);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visiblePosts = BLOG_DATA.slice(0, visibleCount);
  const hasMore = visibleCount < BLOG_DATA.length;

  /* ── Hero entrance ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(heroImgRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 1.8 }
        )
        .fromTo(heroGradientRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.1 },
          "-=1.5"
        )
        .fromTo(breadcrumbRef.current,
          { y: -16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.9"
        )
        .fromTo(heroTitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85 },
          "-=0.5"
        );
    }, heroWrapRef);
    return () => ctx.revert();
  }, []);

  /* ── Cards stagger (initial load + each "view more" reveal) ── */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const newCards = cards.slice(prevCountRef.current);
    if (!newCards.length) return;

    if (prefersReducedMotion()) {
      prevCountRef.current = visibleCount;
      return;
    }

    gsap.fromTo(
      newCards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        delay: prevCountRef.current === 0 ? 0.3 : 0,
      }
    );
    prevCountRef.current = visibleCount;
  }, [visibleCount]);

  const handleViewMore = () => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, BLOG_DATA.length));
  };

  return (
    <section className="w-full mt-20">

      {/* ── Hero ── */}
      <div
        ref={heroWrapRef}
        className="relative  h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden"
      >
        <img
          ref={heroImgRef}
          src={BlogHeroImg}
          alt="Aqualife blogs"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div ref={heroGradientRef} className="absolute inset-0 bg-black/40" />

        <div ref={breadcrumbRef} className="absolute top-2 lg:top-14 left-0 w-full z-10">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>

        <div className="relative z-10 h-full primary-container flex items-center justify-center">
          <h1
            ref={heroTitleRef}
            className="heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            Blogs
          </h1>
        </div>
      </div>

      {/* ── Blog Grid ── */}
      <div className="primary-container py-12 lg:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
          Latest Blog
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiblePosts.map((post, i) => (
            <BlogCard
              key={post.id}
              post={post}
              cardRef={(el) => (cardRefs.current[i] = el)}
            />
          ))}
        </div>

        {/* ── View More ── */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleViewMore}
              className="group flex flex-col items-center gap-2 px-6 py-2 transition-colors duration-300"
              style={{ color: THEME }}
            >
              <span className="text-sm font-semibold tracking-wide uppercase">
                View More
              </span>
              <span
                className="flex items-center justify-center w-9 h-9 rounded-full border-2
                  transition-all duration-300 group-hover:bg-[--theme] group-hover:text-white
                  animate-bounce group-hover:animate-none"
                style={{ borderColor: THEME, "--theme": THEME }}
              >
                <ChevronDown size={18} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </span>
            </button>
          </div>
        )}
      </div>

    </section>
  );
};

export default Blogs;