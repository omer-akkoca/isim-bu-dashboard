import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileText, Search, User, Briefcase, GraduationCap, Calendar } from 'lucide-react';

interface CV {
  id: string;
  title?: string;
  userId?: string;
  ownerName?: string;
  ownerEmail?: string;
  jobTitle?: string;
  summary?: string;
  skills?: string[];
  experienceCount?: number;
  educationCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

const CVsPage = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const snap = await getDocs(collection(db, 'cvs'));
        setCvs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CV[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  const filtered = cvs.filter(
    cv =>
      cv.title?.toLowerCase().includes(search.toLowerCase()) ||
      cv.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      cv.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      cv.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="p-9 max-w-[1200px] animate-[fadeUp_0.3s_ease]">
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">CV'ler</h1>
          <p className="text-[13px] text-[#5A5F7A] mt-1">Kullanıcıların oluşturduğu tüm CV'ler</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1C1E27] border border-white/6 rounded-full px-4 py-2 text-[12px] font-medium text-[#9CA3C7]">
          <FileText size={15} className="text-[#818CF8]" />
          <span>{cvs.length} CV</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5F7A] pointer-events-none" />
        <input
          className="w-full max-w-sm bg-[#1C1E27] border border-white/6 rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-white placeholder-[#5A5F7A] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
          placeholder="CV başlığı, isim veya beceri ile ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-[#5A5F7A] text-[14px]">
          <FileText size={40} className="opacity-30" />
          <p>{search ? 'Sonuç bulunamadı.' : 'Henüz CV yok.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(cv => (
            <div
              key={cv.id}
              className="bg-[#1C1E27] border border-white/6 rounded-2xl px-6 py-5 flex justify-between items-start gap-6 hover:border-[#6366F1]/20 hover:-translate-y-px hover:shadow-xl hover:shadow-black/25 transition-all"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-11 h-11 rounded-xl shrink-0 bg-[#6366F1]/12 border border-[#6366F1]/20 flex items-center justify-center text-[#818CF8]">
                  <FileText size={19} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-white mb-0.5">{cv.title || 'İsimsiz CV'}</div>
                  {cv.jobTitle && <div className="text-[12px] text-[#818CF8] mb-2">{cv.jobTitle}</div>}
                  {cv.summary && (
                    <p className="text-[12px] text-[#5A5F7A] leading-relaxed max-w-lg mb-2.5 line-clamp-2">{cv.summary}</p>
                  )}
                  {cv.skills && cv.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cv.skills.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-1 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full text-[#818CF8] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {cv.skills.length > 5 && (
                        <span className="text-[11px] px-2.5 py-1 bg-[#181A21] border border-white/6 rounded-full text-[#5A5F7A]">
                          +{cv.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0 min-w-[140px] items-end">
                {cv.ownerName && (
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <User size={12} className="text-[#5A5F7A]" />
                    <span>{cv.ownerName}</span>
                  </div>
                )}
                {cv.experienceCount !== undefined && (
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <Briefcase size={12} className="text-[#5A5F7A]" />
                    <span>{cv.experienceCount} deneyim</span>
                  </div>
                )}
                {cv.educationCount !== undefined && (
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <GraduationCap size={12} className="text-[#5A5F7A]" />
                    <span>{cv.educationCount} eğitim</span>
                  </div>
                )}
                {cv.updatedAt && (
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <Calendar size={12} className="text-[#5A5F7A]" />
                    <span>{new Date(cv.updatedAt?.seconds * 1000).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { CVsPage };
