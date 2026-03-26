const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="bg-[#1C1E27] border border-white/6 rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/6">
      <div className="w-7 h-7 rounded-lg bg-[#6366F1]/12 border border-[#6366F1]/20 flex items-center justify-center text-[#818CF8]">
        <Icon size={14} />
      </div>
      <span className="text-[13px] font-semibold text-white">{title}</span>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

export default SectionCard;
