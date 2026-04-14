import { useEffect, useState } from 'react';

import { FileText } from 'lucide-react';

import { useCvActions } from '../../../actions';
import type { ICV } from '../../../types';

import CvRowItem from './CvRowItem';

const CVsPage = () => {
  const [cvs, setCvs] = useState<ICV[]>([]);
  const { loading, totalPages, getCvs } = useCvActions();

  useEffect(() => {
    const boot = async () => {
      const data = await getCvs();
      setCvs(data);
    };
    boot();
  }, []);

  return (
    <div className="p-10 animate-[fadeUp_0.3s_ease]">
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">CV'ler</h1>
          <p className="text-[13px] text-gray-400 mt-1">Kullanıcıların oluşturduğu tüm CV'ler</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-[12px] font-medium text-gray-500">
          <FileText size={15} className="text-[#6366F1]" />
          <span>{totalPages} CV</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Kullanıcı
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  CV Başlığı
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Güncelleme
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Detay
                </th>
              </tr>
            </thead>
            <tbody>
              {cvs.map((cv, i) => (
                <CvRowItem key={i.toString()} cv={cv} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { CVsPage };
