import { useEffect, useState } from 'react';

import type { Timestamp } from 'firebase/firestore';
import {
  Award,
  BookOpen,
  Briefcase,
  Car,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Heart,
  Languages,
  Lightbulb,
  Link,
  Medal,
  Shield,
  Star,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';

import { useCvActions, useUserActions } from '../../../actions';
import { EmptyState, Tag } from '../../../components';
import { DEGREE_MAP, EMPLOYMENT_MAP, LANGUAGE_MAP, PROFICIENCY_MAP, WORK_TYPE_MAP } from '../../../constants/typeMaps';
import { useDayJs } from '../../../hooks';
import type { ICV, UserBasicInfo } from '../../../types';

import CVCompleteness from './CVCompleteness';
import SectionCard from './SectionCard';

const fmt = (ts: Timestamp | null) =>
  ts ? new Date(ts.seconds * 1000).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : null;

const dateRange = (start: Timestamp, end: Timestamp | null, isCurrent: boolean) =>
  `${fmt(start)} – ${isCurrent ? 'Devam Ediyor' : (fmt(end) ?? '?')}`;

const CvDetails = () => {
  const { dayjs } = useDayJs();
  const { cv_id } = useParams<{ cv_id: string }>();
  const { loading, handleGetCvDetails, handleIncrementCvViewCount } = useCvActions();
  const { handleGetUserBasicInfo } = useUserActions();

  const [cv, setCv] = useState<ICV>();
  const [basicUser, setBasicInfo] = useState<UserBasicInfo>();

  useEffect(() => {
    const boot = async () => {
      const data = await handleGetCvDetails(cv_id!);
      if (data) setCv(data);
    };
    if (cv_id) {
      boot();
      handleIncrementCvViewCount(cv_id);
    }
  }, [cv_id]);

  useEffect(() => {
    const boot = async () => {
      const data = await handleGetUserBasicInfo(cv!.userId);
      if (data) setBasicInfo(data);
    };
    if (cv) boot();
  }, [cv]);

  return (
    <div className="p-10 animate-[fadeUp_0.3s_ease]">
      {loading && (
        <div className="flex justify-center py-32">
          <div className="w-7 h-7 border-2 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      )}

      {!loading && !cv && (
        <div className="flex flex-col items-center gap-3 py-32 text-gray-300">
          <FileText size={40} className="opacity-40" />
          <p className="text-[14px] text-gray-400">CV bulunamadı.</p>
        </div>
      )}

      {!loading && cv && (
        <div className="flex flex-col gap-5">
          {/* Hero */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#6366F1]/8 border border-[#6366F1]/15 flex items-center justify-center text-[#6366F1] shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{cv.title}</h1>
                  <div className="flex items-center gap-4 mt-1.5">
                    {basicUser ? (
                      <NavLink to={`/dashboard/user/${basicUser.userId}`}>
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-[#6366F1] transition-colors">
                          <User size={12} />
                          <span>Kullanıcı Id: {basicUser.userId}</span>
                        </div>
                      </NavLink>
                    ) : null}
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                      <Star size={12} />
                      <span>{cv.viewCount ?? 0} görüntülenme</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} />
                  <span>Oluşturuldu: {fmt(cv.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} />
                  <span>Güncellendi: {fmt(cv.updatedAt)}</span>
                </div>
              </div>
            </div>

            {cv.summary && (
              <p className="mt-4 text-[13px] text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{cv.summary}</p>
            )}
          </div>

          <CVCompleteness cv={cv} />

          {/* Experience */}
          <SectionCard title="Deneyim" icon={Briefcase} count={cv.experience?.length ?? 0}>
            {cv.experience?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.experience.map(exp => {
                  const wt = WORK_TYPE_MAP[exp.workType];
                  return (
                    <div key={exp.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="text-[14px] font-semibold text-gray-900">{exp.position}</div>
                          <div className="text-[12px] text-[#6366F1] mt-0.5">
                            {exp.company} · {EMPLOYMENT_MAP[exp.employmentType]}
                          </div>
                        </div>
                        {wt && <Tag label={wt.label} className={wt.className} />}
                      </div>
                      <div className="text-[12px] text-gray-400 mb-2">
                        {dateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        {exp.location && ` · ${exp.location.city}, ${exp.location.district}`}
                      </div>
                      {exp.description && (
                        <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{exp.description}</p>
                      )}
                      {exp.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.skills.map(s => (
                            <Tag key={s} label={s} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState text="Deneyim eklenmemiş." />
            )}
          </SectionCard>

          {/* Education */}
          <SectionCard title="Eğitim" icon={GraduationCap} count={cv.education?.length ?? 0}>
            {cv.education?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.education.map(edu => (
                  <div key={edu.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="text-[14px] font-semibold text-gray-900">{edu.school}</div>
                        <div className="text-[12px] text-[#6366F1] mt-0.5">
                          {edu.field} · {DEGREE_MAP[edu.degree]}
                        </div>
                      </div>
                      {edu.gpa && (
                        <span className="text-[11px] text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full shrink-0">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-gray-400 mb-2">
                      {dateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                    </div>
                    {edu.description && <p className="text-[12px] text-gray-500 leading-relaxed">{edu.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Eğitim eklenmemiş." />
            )}
          </SectionCard>

          {/* Skills */}
          <SectionCard title="Beceriler" icon={Wrench} count={cv.skills?.length ?? 0}>
            {cv.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.skills.map(s => (
                  <Tag key={s} label={s} />
                ))}
              </div>
            ) : (
              <EmptyState text="Beceri eklenmemiş." />
            )}
          </SectionCard>

          {/* Languages */}
          <SectionCard title="Diller" icon={Languages} count={cv.languages?.length ?? 0}>
            {cv.languages?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.languages.map((lang, i) => {
                  const prof = PROFICIENCY_MAP[lang.proficiency];
                  return (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <span className="text-[13px] text-gray-900 font-medium">
                        {Object.keys(LANGUAGE_MAP).includes(lang.name) ? LANGUAGE_MAP[lang.name] : lang.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {Array.from({ length: 7 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2.5 h-2.5 rounded-full ${idx < prof.level ? 'bg-[#6366F1]' : 'bg-gray-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-400 min-w-25 text-right">{prof.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState text="Dil eklenmemiş." />
            )}
          </SectionCard>

          {/* Certifications */}
          <SectionCard title="Sertifikalar" icon={Shield} count={cv.certifications?.length ?? 0}>
            {cv.certifications?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.certifications.map(cert => (
                  <div key={cert.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900">{cert.name}</div>
                        <div className="text-[12px] text-[#6366F1] mt-0.5">{cert.issuer}</div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          {fmt(cert.issueDate)}
                          {cert.hasExpiry && cert.expiryDate ? ` – ${fmt(cert.expiryDate)}` : ' · Süresiz'}
                        </div>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#6366F1] hover:text-[#4F46E5] transition-colors shrink-0"
                        >
                          <ExternalLink size={12} />
                          <span>Görüntüle</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Sertifika eklenmemiş." />
            )}
          </SectionCard>

          {/* Projects */}
          <SectionCard title="Projeler" icon={Lightbulb} count={cv.projects?.length ?? 0}>
            {cv.projects?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.projects.map(proj => (
                  <div key={proj.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="text-[14px] font-semibold text-gray-900">{proj.name}</div>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#6366F1] hover:text-[#4F46E5] transition-colors shrink-0"
                        >
                          <Link size={12} />
                          <span>Link</span>
                        </a>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mb-2">{fmt(proj.startDate)}</div>
                    {proj.description && (
                      <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{proj.description}</p>
                    )}
                    {proj.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.skills.map(s => (
                          <Tag key={s} label={s} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Proje eklenmemiş." />
            )}
          </SectionCard>

          {/* Courses */}
          <SectionCard title="Kurslar" icon={BookOpen} count={cv.courses?.length ?? 0}>
            {cv.courses?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.courses.map(course => (
                  <div key={course.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900">{course.name}</div>
                        <div className="text-[12px] text-[#6366F1] mt-0.5">{course.institution}</div>
                        <div className="text-[11px] text-gray-400 mt-1">{fmt(course.completionDate)}</div>
                        {course.description && (
                          <p className="text-[12px] text-gray-500 leading-relaxed mt-1">{course.description}</p>
                        )}
                      </div>
                      {course.url && (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#6366F1] hover:text-[#4F46E5] transition-colors shrink-0"
                        >
                          <ExternalLink size={12} />
                          <span>Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Kurs eklenmemiş." />
            )}
          </SectionCard>

          {/* Awards */}
          <SectionCard title="Ödüller" icon={Award} count={cv.awards?.length ?? 0}>
            {cv.awards?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.awards.map(award => (
                  <div key={award.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-[13px] font-semibold text-gray-900">{award.title}</div>
                    <div className="text-[12px] text-[#6366F1] mt-0.5">
                      {award.issuer} · {fmt(award.date)}
                    </div>
                    {award.description && (
                      <p className="text-[12px] text-gray-500 leading-relaxed mt-1">{award.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Ödül eklenmemiş." />
            )}
          </SectionCard>

          {/* Patents */}
          <SectionCard title="Patentler" icon={Medal} count={cv.patents?.length ?? 0}>
            {cv.patents?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {cv.patents.map(patent => (
                  <div key={patent.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900">{patent.title}</div>
                        <div className="text-[12px] text-[#6366F1] mt-0.5">
                          No: {patent.patentNumber} · {fmt(patent.issueDate)}
                        </div>
                        {patent.description && (
                          <p className="text-[12px] text-gray-500 leading-relaxed mt-1">{patent.description}</p>
                        )}
                      </div>
                      {patent.url && (
                        <a
                          href={patent.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#6366F1] hover:text-[#4F46E5] transition-colors shrink-0"
                        >
                          <ExternalLink size={12} />
                          <span>Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Patent eklenmemiş." />
            )}
          </SectionCard>

          {/* References */}
          <SectionCard title="Referanslar" icon={Users} count={cv.references?.length ?? 0}>
            {cv.references?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cv.references.map(ref => (
                  <div key={ref.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="text-[13px] font-semibold text-gray-900">{ref.name}</div>
                    <div className="text-[12px] text-[#6366F1] mt-0.5">
                      {ref.position} · {ref.company}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 mb-3">{ref.relationship}</div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[11px] text-gray-500">{ref.email}</div>
                      <div className="text-[11px] text-gray-500">{ref.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Referans eklenmemiş." />
            )}
          </SectionCard>

          {/* Hobbies + Driving Licences — 2 col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SectionCard title="Hobiler" icon={Heart} count={cv.hobbies?.length ?? 0}>
              {cv.hobbies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {cv.hobbies.map(h => (
                    <Tag key={h} label={h} className="bg-gray-100 text-gray-500 border-gray-200" />
                  ))}
                </div>
              ) : (
                <EmptyState text="Hobi eklenmemiş." />
              )}
            </SectionCard>

            <SectionCard title="Sürücü Belgesi" icon={Car} count={cv.drivingLicences?.length ?? 0}>
              {cv.drivingLicences?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {cv.drivingLicences.map(d => (
                    <Tag key={d} label={d} className="bg-gray-100 text-gray-500 border-gray-200" />
                  ))}
                </div>
              ) : (
                <EmptyState text="Sürücü belgesi eklenmemiş." />
              )}
            </SectionCard>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-6 px-1">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Clock size={12} />
              <span>Kayıt: {dayjs({ date: cv.createdAt.toDate() })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Shield size={12} />
              <span>Cv ID: {cv.cvId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Clock size={12} />
              <span>Güncelleme: {dayjs({ date: cv.updatedAt.toDate() })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CvDetails };
