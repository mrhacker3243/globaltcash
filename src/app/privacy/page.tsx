import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy" subtitle="Data Encryption & Security Standards">
      <div className="space-y-10">
        <section>
          <h3 className="text-gray-900 font-black uppercase text-sm mb-4 italic tracking-widest">Data Sovereignty</h3>
          <p className="text-gray-500 font-bold uppercase text-[11px] leading-relaxed tracking-wide">
            Your financial data is encrypted using 256-bit SSL protocols. We do not share user identity with third-party aggregators. All transaction logs are stored in offline cold-nodes for maximum security.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}