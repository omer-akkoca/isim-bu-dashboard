export const Tag = ({ label, className = '' }: { label: string; className?: string }) => (
  <span
    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${className || 'bg-[#6366F1]/8 text-[#6366F1] border-[#6366F1]/15'}`}
  >
    {label}
  </span>
);
