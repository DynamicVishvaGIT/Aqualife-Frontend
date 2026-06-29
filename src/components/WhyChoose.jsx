import { Sparkles, ShieldCheck, Handshake } from "lucide-react";

const REASONS = [
  {
    icon: Sparkles,
    title: "Aqualife Advantage",
    description:
      "Largest Manufacturer & Market Leader in RO Water Purifier with Large Sales and Service Network",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Brand",
    description: "Honored with Numerous International Certifications and Awards",
  },
  {
    icon: Handshake,
    title: "25 Years of Trust by Millions",
    description: "Most Preferred RO & Home Appliances Brands in India",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#F5F9FF] py-10 sm:py-12 lg:py-14">
      <div className="primary-container">

        <h2 className="text-2xl heading sm:text-3xl font-bold text-slate-900 mb-8 sm:mb-10">
          Why Choose Aqualife
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4">

              <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                <Icon
                  size={36}
                  strokeWidth={1.2}
                  className="text-slate-700"
                />
              </div>

              <div>
                <h3 className="text-[15px] heading sm:text-base font-bold text-slate-900 leading-snug mb-1.5">
                  {title}
                </h3>
                <p className="text-slate-400 text-[13px] sm:text-sm leading-relaxed">
                  {description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}