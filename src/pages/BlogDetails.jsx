import { useEffect, useRef } from "react";
import Breadcrumb from "../components/Breadcrumb";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import img_1 from "../assets/ro_banner.jpg";
import img_2 from "../assets/softer_img_2.webp";
import img_3 from "../assets/familyImg.png";

const THEME = "#0061C2";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SIDEBAR_POSTS = [
  {
    id: 1,
    image: img_1,
    category: "Technology",
    title: "Air Purifier for Babies & Toddlers: What Parents Need to Know",
    author: "Tracey Wilson",
    date: "August 20, 2022",
    avatar: "https://i.pravatar.cc/32?img=1",
  },
  {
    id: 2,
    image: img_2,
    category: "Technology",
    title: "Air Purifier for Babies & Toddlers: What Parents Need to Know",
    author: "Tracey Wilson",
    date: "August 20, 2022",
    avatar: "https://i.pravatar.cc/32?img=2",
  },
  {
    id: 3,
    image: img_3,
    category: "Technology",
    title: "Air Purifier for Babies & Toddlers: What Parents Need to Know",
    author: "Tracey Wilson",
    date: "August 20, 2022",
    avatar: "https://i.pravatar.cc/32?img=3",
  },
  {
    id: 4,
    image: img_1,
    category: "Technology",
    title: "Air Purifier for Babies & Toddlers: What Parents Need to Know",
    author: "Tracey Wilson",
    date: "August 20, 2022",
    avatar: "https://i.pravatar.cc/32?img=4",
  },
];

/* ─────────────────────────────────────────
   Sidebar card (matches main BlogCard style)
───────────────────────────────────────── */
function SidebarCard({ post, cardRef }) {
  return (
    <Link
      to="/blog-details"
      ref={cardRef}
      className="block group relative h-[380px] rounded-2xl overflow-hidden mb-6 cursor-pointer
                 transition-shadow duration-500
                 hover:shadow-[0_15px_35px_-12px_rgba(0,97,194,0.4)]"
    >
      <img
        src={post.image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-700 ease-out
                   group-hover:scale-110"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(160,160,160,0.5) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 2px ${THEME}` }}
      />

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex flex-col gap-2 text-white">
        <span
          className="text-[10px] font-bold tracking-[0.12em] uppercase w-fit px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "rgba(0,97,194,0.85)", color: "#fff" }}
        >
          {post.category}
        </span>

        <p className="text-[14px] font-semibold leading-snug line-clamp-2 transition-transform duration-500 group-hover:-translate-y-1">
          {post.title}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-6 h-6 rounded-full object-cover border-2"
            style={{ borderColor: "rgba(255,255,255,0.4)" }}
          />

          <span className="text-xs text-white/90 font-medium">
            {post.author}
          </span>

          <span className="text-white/50">•</span>

          <span className="text-[11px] text-white/70">
            {post.date}
          </span>
        </div>
      </div>
    </Link>
  );
}
/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
const BlogDetails = () => {
  const contentRef = useRef(null);
  const media1Ref = useRef(null);
  const media2Ref = useRef(null);
  const sidebarRefs = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .fromTo(
          contentRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          }
        )
        .fromTo(
          [media1Ref.current, media2Ref.current],
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.3"
        );

      const cards = sidebarRefs.current.filter(Boolean);

      if (cards.length) {
        gsap.fromTo(
          cards,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.3,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full mt-20">
      <div className="primary-container py-8 lg:py-12">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* ── Main content ── */}
          <div ref={contentRef} className="lg:col-span-8">
            <span
              className="inline-block heading text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: "rgba(0,97,194,0.1)", color: THEME }}
            >
              Technology
            </span>

            <h1 className="text-2xl heading sm:text-3xl font-semibold text-gray-900 leading-snug mb-4">
              Air Purifier for Babies & Toddlers: What Parents Need to Know
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <img
              loading="lazy"
                src="https://i.pravatar.cc/32?img=1"
                alt="Tracey Wilson"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm heading font-medium text-gray-800">
                Tracey Wilson
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-400">August 20, 2022</span>
            </div>

            <div
              ref={media1Ref}
              className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[380px] mb-6 group cursor-pointer"
            >
              <img
              loading="lazy"
                src={img_1}
                alt="Blog"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <p className="text-[15px] leading-relaxed text-gray-600 mb-6">
              Is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              1960, when designers at Letraset and James Mosley, the librarian
              at St Bride Printing Library, took a 1914 Cicero translation and
              scrambled it to make dummy text for Letraset's Body Type sheets.
              It has survived not only many decades, but also the leap into
              electronic typesetting, remaining essentially unchanged. It has
              popularised these sheets and more recently with desktop publishing
              software including versions of Lorem Ipsum.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Research Your Destination
            </h3>
            <p className="text-[15px] leading-relaxed text-gray-600 mb-6">
              Is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              1960, when designers at Letraset and James Mosley, the librarian
              at St Bride Printing Library, took a 1914 Cicero translation and
              scrambled it to make dummy text for Letraset's Body Type sheets.
              It has survived not only many decades, but also the leap into
              electronic typesetting, remaining essentially unchanged. It has
              popularised these sheets and more recently with desktop publishing
              software including versions of Lorem Ipsum.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Research Your Destination
            </h3>
            <p className="text-[15px] leading-relaxed text-gray-600 mb-6">
              Is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              1960, when designers at Letraset and James Mosley, the librarian
              at St Bride Printing Library, took a 1914 Cicero translation and
              scrambled it to make dummy text for Letraset's Body Type sheets.
              It has survived not only many decades, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>

            <blockquote
              className="rounded-2xl px-8 py-6 my-8 text-center"
              style={{
                backgroundColor: "rgba(0,97,194,0.05)",
                borderLeft: `4px solid ${THEME}`,
              }}
            >
              <p className="text-[16px] italic font-medium text-gray-700 leading-relaxed">
                "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit."
              </p>
            </blockquote>

            <div
              ref={media2Ref}
              className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[380px] mb-6 group cursor-pointer"
            >
              <img
              loading="lazy"
                src={img_2}
                alt="Blog"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-5 heading">
                <h2 className="text-lg font-bold text-gray-900">Latest Blog</h2>
                <ChevronDown size={18} className="text-gray-400" />
              </div>

              {SIDEBAR_POSTS.map((post, i) => (
                <SidebarCard
                  key={post.id}
                  post={post}
                  cardRef={(el) => (sidebarRefs.current[i] = el)}
                />
              ))}

              <div className="flex justify-center mt-4">
                <button
                  className="group flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300"
                  style={{ color: THEME }}
                >
                  View More
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;