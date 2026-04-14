// CvDetails/SectionCard.tsx
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
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#6366F1]/8 border border-[#6366F1]/15 flex items-center justify-center text-[#6366F1]">
          <Icon size={14} />
        </div>
        <span className="text-[13px] font-semibold text-gray-900">{title}</span>
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

export default SectionCard;
