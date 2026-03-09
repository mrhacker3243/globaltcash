import LegalLayout from "@/components/LegalLayout";

export default function AboutPage() {
  return (
    <LegalLayout title="About" subtitle="The Future of Capital Management">
      <div className="space-y-10">
        <p className="text-gray-900 text-xl font-black italic uppercase tracking-tighter leading-tight">
          We are not just a platform; we are a <span className="text-[#E11D48]">liquidity powerhouse</span> designed for the next generation of wealth.
        </p>
        <p className="text-gray-500 font-bold uppercase text-[11px] leading-relaxed tracking-wide">
          Founded in 2026, Global Capital utilizes Tier-4 data centers and secure encrypted protocols to deliver consistent daily yields to our global network of investors. Our mission is to democratize high-level finance.
        </p>
      </div>
    </LegalLayout>
  );
}