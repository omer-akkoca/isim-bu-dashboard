import { useEffect, useMemo, useState } from 'react';

import { Briefcase, Clock, FileText, Globe, Mail, MapPin, Phone, Shield, User } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';

import * as actions from '../../../actions';
import { formatSalary, GENDER_MAP, JOB_STATUS_MAP, MILITARY_MAP } from '../../../constants/typeMaps';
import { useDayJs } from '../../../hooks';
import type { IUser } from '../../../types';

import Row from './Row';
import SectionCard from './SectionCard';

const UserDetails = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const { dayjs } = useDayJs();

  const { loading, getUserDetails, incrementUserViewCount } = actions.useUserActions();

  const [user, setUser] = useState<IUser>();

  const initials = useMemo(() => {
    if (!user) return '-';
    return `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();
  }, [user]);

  const status = useMemo(() => {
    if (!user) return null;
    return JOB_STATUS_MAP[user.jobSearchStatus];
  }, [user]);

  const military = useMemo(() => {
    if (!user) return null;
    return MILITARY_MAP[user.militaryStatus];
  }, [user]);

  useEffect(() => {
    if (!user_id) return;
    incrementUserViewCount(user_id);
  }, [user_id]);

  useEffect(() => {
    const boot = async () => {
      const bootedData = await getUserDetails(user_id!);
      if (bootedData) {
        setUser(bootedData);
      }
    };
    if (user_id) {
      boot();
    }
  }, [user_id]);

  return (
    <div className="p-10 animate-[fadeUp_0.3s_ease]">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-32">
          <div className="w-7 h-7 border-2 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      )}

      {/* Not found */}
      {!loading && !user && (
        <div className="flex flex-col items-center gap-3 py-32 text-[#5A5F7A]">
          <User size={40} className="opacity-30" />
          <p className="text-[14px]">Kullanıcı bulunamadı.</p>
        </div>
      )}

      {/* Content */}
      {!loading && user && (
        <div className="flex flex-col gap-5">
          {/* Hero card */}
          <div className="bg-[#1C1E27] border border-white/6 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[26px] font-bold text-white shrink-0 overflow-hidden">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight">
                      {user.name} {user.surname}
                    </h1>
                    {user.title && <p className="text-[13px] text-[#818CF8] mt-0.5">{user.title}</p>}
                  </div>
                  {status && (
                    <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full border ${status.className}`}>
                      {status.label}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <Mail size={13} className="text-[#5A5F7A]" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <Phone size={13} className="text-[#5A5F7A]" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3C7]">
                    <MapPin size={13} className="text-[#5A5F7A]" />
                    <span>
                      {user.location?.city}, {user.location?.district}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2 col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Kişisel Bilgiler */}
            <SectionCard title="Kişisel Bilgiler" icon={User}>
              <Row label="Ad Soyad" value={`${user.name} ${user.surname}`} />
              <Row label="Cinsiyet" value={GENDER_MAP[user.gender]} />
              <Row label="Doğum Tarihi" value={dayjs({ date: user.birthDate.toDate() })} />
              <Row label="Şehir" value={`${user.location?.city} / ${user.location?.district}`} />
            </SectionCard>

            {/* İletişim */}
            <SectionCard title="İletişim" icon={Phone}>
              <Row label="E-posta" value={user.email} />
              <Row label="Telefon" value={user.phone} />
            </SectionCard>

            {/* İş Bilgileri */}
            <SectionCard title="İş Bilgileri" icon={Briefcase}>
              <Row label="Ünvan" value={user.title ?? '—'} />
              <Row
                label="İş Arama"
                value={
                  status && (
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${status.className}`}>
                      {status.label}
                    </span>
                  )
                }
              />
              <Row
                label="Maaş Beklentisi"
                value={
                  user.salaryExpectation?.min || user.salaryExpectation?.max
                    ? `${user.salaryExpectation.min ? formatSalary(user.salaryExpectation.min) : '?'} – ${user.salaryExpectation.max ? formatSalary(user.salaryExpectation.max) : '?'}`
                    : '—'
                }
              />
              {user.gender === 'male' && (
                <Row
                  label="Askerlik"
                  value={
                    military && (
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${military.className}`}>
                        {military.label}
                      </span>
                    )
                  }
                />
              )}
            </SectionCard>

            {/* Sosyal Medya */}
            <SectionCard title="Sosyal Medya" icon={Globe}>
              {user.socialMedia?.length > 0 ? (
                <div className="flex flex-col gap-0">
                  {user.socialMedia.map((sm, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-0">
                      <span className="text-[12px] text-[#5A5F7A] capitalize">{sm.platform}</span>
                      <a
                        href={sm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#818CF8] hover:text-[#6366F1] transition-colors truncate max-w-45"
                      >
                        {sm.url}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#5A5F7A] py-2">Sosyal medya eklenmemiş.</p>
              )}
            </SectionCard>
          </div>

          {/* CV'ler — full width */}
          <SectionCard title="CV'ler" icon={FileText}>
            {user.cvs?.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/6">
                    <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider pb-3">
                      Başlık
                    </th>
                    <th className="text-left text-[11px] font-semibold text-[#5A5F7A] uppercase tracking-wider pb-3">
                      Oluşturulma
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.cvs.map((cv, i) => (
                    <tr key={cv.cvId} className={i !== user.cvs.length - 1 ? 'border-b border-white/4' : ''}>
                      <td className="py-3 text-[13px] text-white font-medium">
                        <NavLink to={`/dashboard/cv/${cv.cvId}`}>{cv.title}</NavLink>
                      </td>
                      <td className="py-3 text-[12px] text-[#9CA3C7]">{dayjs({ date: cv.createdAt.toDate() })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[13px] text-[#5A5F7A]">Henüz CV eklenmemiş.</p>
            )}
          </SectionCard>

          {/* Meta */}
          <div className="flex items-center gap-6 px-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#5A5F7A]">
              <Clock size={12} />
              <span>Kayıt: {dayjs({ date: user.createdAt.toDate() })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#5A5F7A]">
              <Shield size={12} />
              <span>UID: {user.uid}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#5A5F7A]">
              <Clock size={12} />
              <span>Güncelleme: {dayjs({ date: user.updatedAt.toDate() })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { UserDetails };
