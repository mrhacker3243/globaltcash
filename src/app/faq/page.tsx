import LegalLayout from "@/components/LegalLayout";

export default function FAQPage() {
  const faqs = [
    { q: "What is the minimum injection?", a: "The minimum capital required to activate a node is Rs. 5,000 via the Basic Plan." },
    { q: "How fast are withdrawals?", a: "Withdrawals are routed through instant settlement nodes, usually reflecting in 5-30 minutes." },
    { q: "Can I run multiple plans?", a: "Yes, our architecture supports multi-plan layering for diversified yield generation." }
  ];

  return (
    <LegalLayout title="FAQ" subtitle="Technical Specifications & Operations">
      <div className="space-y-8">
        {faqs.map((f, i) => (
          <div key={i} className="border-l-4 border-[#E11D48] pl-6 py-2">
            <h4 className="text-gray-900 font-black uppercase text-[12px] mb-2 italic tracking-widest">{f.q}</h4>
            <p className="text-gray-500 font-bold uppercase text-[10px] leading-relaxed tracking-wide">{f.a}</p>
          </div>
        ))}
      </div>
    </LegalLayout>
  );
}