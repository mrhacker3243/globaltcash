import LegalLayout from "@/components/LegalLayout";
import { MessageSquare, Mail, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <LegalLayout title="Contact" subtitle="24/7 Node Support Access">
      <div className="grid grid-cols-1 gap-6">
        {[
          { icon: Mail, label: "Official Correspondence", val: "support@globaltcash.com" },
          { icon: MessageSquare, label: "Telegram Portal", val: "@Globaltcash" },
          { icon: Globe, label: "Live Assistance", val: "Available via Dashboard" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-6 p-6 bg-[#F9FAFB] rounded-2xl border border-gray-50">
            <item.icon className="text-[#E11D48]" size={24} />
            <div>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">{item.label}</p>
              <p className="text-xs font-black uppercase text-gray-900 tracking-widest">{item.val}</p>
            </div>
          </div>
        ))}
      </div>
    </LegalLayout>
  );
}