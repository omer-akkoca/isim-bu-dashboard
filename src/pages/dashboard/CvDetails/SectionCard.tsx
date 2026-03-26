const SectionCard = ({
  title,
  icon: Icon,
  children,
  count,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  count?: number;
}) => (
  <div className="bg-[#1C1E27] border border-white/6 rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#6366F1]/12 border border-[#6366F1]/20 flex items-center justify-center text-[#818CF8]">
          <Icon size={14} />
        </div>
        <span className="text-[13px] font-semibold text-white">{title}</span>
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-[#5A5F7A] bg-white/5 border border-white/6 px-2 py-0.5 rounded-full">{count}</span>
      )}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

export default SectionCard;
