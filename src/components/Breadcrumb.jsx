import { Link, useLocation } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

const Breadcrumb = ({
  homeColor = "text-gray-500",
  linkColor = "text-gray-500",
  activeColor = "text-gray-900",
  separatorColor = "text-gray-400",
}) => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <section className="w-full">
      <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] sm:text-[15px]">

        <Link
          to="/"
          className={`${homeColor} hover:opacity-80 transition whitespace-nowrap`}
        >
          Home
        </Link>

        {paths.map((path, index) => {
          const href = "/" + paths.slice(0, index + 1).join("/");
          const isLast = index === paths.length - 1;
          const label = path
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <span key={index} className="flex items-center gap-x-2">
              <IoChevronForward className={`${separatorColor} text-sm`} />

              {isLast ? (
                <span className={`${activeColor} font-medium truncate max-w-[140px] sm:max-w-[240px] lg:max-w-none`}>
                  {label}
                </span>
              ) : (
                <Link
                  to={href}
                  className={`${linkColor} hover:opacity-80 transition whitespace-nowrap`}
                >
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </section>
  );
};

export default Breadcrumb;