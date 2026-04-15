import { Users, FileText, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const features = [
  {
    icon: Users,
    title: 'Aday Havuzu',
    description: 'Uygulamaya kayıtlı tüm kullanıcıların profillerini inceleyin, iletişim bilgilerine ulaşın.',
  },
  {
    icon: FileText,
    title: 'CV İnceleme',
    description: "Adayların oluşturduğu CV'leri detaylıca görüntüleyin, beceri ve deneyimlerini karşılaştırın.",
  },
  {
    icon: Search,
    title: 'Akıllı Arama',
    description: 'İsim, ünvan veya beceriye göre saniyeler içinde doğru adayı bulun.',
  },
  {
    icon: TrendingUp,
    title: 'Büyüyen Havuz',
    description: 'Her gün yeni adaylar platforma katılıyor. En güncel profillere her zaman erişin.',
  },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.email?.split('@')[0] ?? 'İşveren';

  return (
    <div className="min-h-full p-10">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] p-10 mb-8">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-20 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-6">
          <img src="/logo.png" alt="İşim Bu" className="w-16 h-16 rounded-2xl object-cover shadow-xl shadow-black/20" />
          <div>
            <p className="text-white/70 text-[13px] font-medium mb-1">Hoş geldin, {firstName} 👋</p>
            <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">
              İşim Bu
              <br />
              <span className="text-white/70 text-[18px] font-medium">İşveren Paneli</span>
            </h1>
          </div>
        </div>

        <p className="relative z-10 mt-6 text-white/80 text-[14px] leading-relaxed max-w-lg">
          Doğru adayı bulmak artık çok daha kolay. Binlerce iş arayan arasından sana uygun profillere ulaş, CV'leri incele ve
          işe alım sürecini hızlandır.
        </p>

        <div className="relative z-10 flex gap-3 mt-7">
          <button
            onClick={() => navigate('/dashboard/users')}
            className="flex items-center gap-2 bg-white text-[#6366F1] font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10"
          >
            <Users size={15} />
            Kullanıcılara Git
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('/dashboard/cvs')}
            className="flex items-center gap-2 bg-white/15 text-white font-medium text-[13px] px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            <FileText size={15} />
            CV'lere Git
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="mb-3">
        <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Panel Özellikleri</h2>
        <div className="grid grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#6366F1]/30 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/8 border border-[#6366F1]/15 flex items-center justify-center text-[#6366F1] mb-4">
                <Icon size={18} />
              </div>
              <div className="text-[14px] font-semibold text-gray-900 mb-1.5">{title}</div>
              <p className="text-[12px] text-gray-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-8">İşim Bu — Doğru adayı, doğru zamanda bulmanı sağlıyoruz.</p>
    </div>
  );
};

export { DashboardHome };
