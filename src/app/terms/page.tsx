import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms" subtitle="Operating Protocols & User Agreements">
      <div className="space-y-10">
        <section>
          <h3 className="text-gray-900 font-black uppercase text-sm mb-4 italic tracking-widest">01. Service Authorization</h3>
          <p className="text-gray-500 font-bold uppercase text-[11px] leading-relaxed tracking-wide">
            Global Capital is a high-frequency liquidity provider. By accessing this terminal, you acknowledge that you are at least 18 years of age and authorized to manage digital assets in your jurisdiction.
          </p>
        </section>
        <section>
          <h3 className="text-gray-900 font-black uppercase text-sm mb-4 italic tracking-widest">02. Capital Injection</h3>
          <p className="text-gray-500 font-bold uppercase text-[11px] leading-relaxed tracking-wide">
            All deposits are processed through secure network nodes. Users must ensure that JazzCash/Easypaisa details match their registered profile to avoid transaction latency.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}