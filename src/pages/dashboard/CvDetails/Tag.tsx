const Tag = ({ label, className = '' }: { label: string; className?: string }) => (
  <span
    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${className || 'bg-[#6366F1]/10 text-[#818CF8] border-[#6366F1]/20'}`}
  >
    {label}
  </span>
);

export default Tag;
