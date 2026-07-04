import { useState } from "react";
import { FiBookOpen, FiFileText, FiDownload } from "react-icons/fi";
import PdfModel from "./PdfModel";

// Central place to configure each downloadable document — add more
// entries here and wire up a new button the same way if you need to.
const DOCUMENTS = {
  manual: {
    title: "Download User Manual",
    description:
      "Get step-by-step guidance for safe usage, maintenance, and reliable performance of your Aqualife Ever softener.",
    url: "/files/aqualife-user-manual.pdf",
    fileName: "Aqualife-User-Manual.pdf",
  },
  brochure: {
    title: "Download Product Brochure",
    description:
      "Explore complete product details — key features, specifications, and the technology behind Aqualife Ever softeners.",
    url: "/files/aqualife-product-brochure.pdf",
    fileName: "Aqualife-Product-Brochure.pdf",
  },
};

const DownloadPdf = () => {
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleDownloadClick = (key) => {
    setSelectedDoc(DOCUMENTS[key]);
    setOpen(true);
  };

  return (
    <>
      {/* downloads pdf */}
      <section className="bg-[#FFFFFF] py-10 sm:py-12">
        <div className="primary-container">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-semibold heading text-[#191919] mb-6 sm:mb-8">
            Download Brochures & Manuals
          </h2>

          <div className="relative grid grid-cols-1 md:grid-cols-2 border border-gray-200 rounded-2xl overflow-hidden">
            {/* User Manual */}
            <div className="flex items-start sm:items-center justify-between gap-4 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0061C2]">
                  <FiBookOpen size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold heading text-[#191919]">
                    User Manual
                  </h3>

                  <p className="mt-1 text-sm text-[#626C7A] leading-6">
                    Step-by-step guidance for safe usage, maintenance, and
                    reliable performance.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadClick("manual")}
                className="group h-10 w-10 sm:h-11 sm:w-11 shrink-0 cursor-pointer rounded-full border border-[#0061C2]/20 flex items-center justify-center text-[#0061C2] transition hover:bg-[#0061C2] hover:text-white"
              >
                <FiDownload
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
              </button>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-gray-200 -translate-x-1/2" />

            {/* Product Brochure */}
            <div className="flex items-start sm:items-center justify-between gap-4 p-5 sm:p-6 lg:p-8 border-t md:border-t-0">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0061C2]">
                  <FiFileText size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold heading text-[#191919]">
                    Product Brochure
                  </h3>

                  <p className="mt-1 text-sm text-[#626C7A] leading-6">
                    From key features to advanced technology, explore complete
                    product details at a glance.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadClick("brochure")}
                className="group h-10 w-10 sm:h-11 sm:w-11 shrink-0 cursor-pointer rounded-full border border-[#0061C2]/20 flex items-center justify-center text-[#0061C2] transition hover:bg-[#0061C2] hover:text-white"
              >
                <FiDownload
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <PdfModel open={open} setOpen={setOpen} doc={selectedDoc} />
    </>
  );
};

export default DownloadPdf;