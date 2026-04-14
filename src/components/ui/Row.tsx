export const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-[12px] text-gray-400">{label}</span>
    <span className="text-[13px] text-gray-600 text-right">{value ?? '—'}</span>
  </div>
);
