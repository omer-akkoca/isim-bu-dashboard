const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-0">
    <span className="text-[12px] text-[#5A5F7A]">{label}</span>
    <span className="text-[13px] text-[#9CA3C7] text-right">{value ?? '—'}</span>
  </div>
);

export default Row;
