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

import { useCvActions } from '../../../actions';
import { DEGREE_MAP, EMPLOYMENT_MAP, LANGUAGE_MAP, PROFICIENCY_MAP, WORK_TYPE_MAP } from '../../../constants/typeMaps';
import type { ICV } from '../../../types';

import CVCompleteness from './CVCompleteness';
import EmptyState from './EmptyState';
import SectionCard from './SectionCard';
import Tag from './Tag';

const fmt = (ts: Timestamp | null) =>
  ts ? new Date(ts.seconds * 1000).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : null;

const dateRange = (start: Timestamp, end: Timestamp | null, isCurrent: boolean) =>
  `${fmt(start)} – ${isCurrent ? 'Devam Ediyor' : (fmt(end) ?? '?')}`;

const CvDetails = () => {
  const { cv_id } = useParams<{ cv_id: string }>();

  const { loading, getCvDetails, incrementCvViewCount } = useCvActions();

  const [cv, setCv] = useState<ICV>();

  useEffect(() => {
    const boot = async () => {
      const bootedData = await getCvDetails(cv_id!);
      if (bootedData) {
        setCv(bootedData);
      }
    };
    if (cv_id) {
      boot();
    }
  }, [cv_id]);

  useEffect(() => {
    if (!cv_id) return;
    incrementCvViewCount(cv_id);
  }, [cv_id]);

  return (
    <div className="p-10 animate-[fadeUp_0.3s_ease]">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-32">
          <div className="w-7 h-7 border-2 border-[#6366F1]/30 border-t-[#6366F1] rounded-full animate-spin" />
        </div>
      )}

      {/* Not found */}
      {!loading && !cv && (
        <div className="flex flex-col items-center gap-3 py-32 text-[#5A5F7A]">
          <FileText size={40} className="opacity-30" />
          <p className="text-[14px]">CV bulunamadı.</p>
        </div>
      )}

      {!loading && cv && (
        <div className="flex flex-col gap-5">
          {/* Hero */}
          <div className="bg-[#1C1E27] border border-white/6 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#6366F1]/12 border border-[#6366F1]/20 flex items-center justify-center text-[#818CF8] shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-[22px] font-bold text-white tracking-tight">{cv.title}</h1>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5A5F7A]">
                      <User size={12} />
                      <span>
                        UID: <NavLink to={`/dashboard/user/${cv.userId}`}>{cv.userId}</NavLink>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#5A5F7A]">
                      <Star size={12} />
                      <span>{cv.viewCount ?? 0} görüntülenme</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#5A5F7A]">
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

            {/* Summary */}
            {cv.summary && (
              <p className="mt-4 text-[13px] text-[#9CA3C7] leading-relaxed border-t border-white/6 pt-4">{cv.summary}</p>
            )}
          </div>

          <CVCompleteness cv={cv} />

          {/* Experience */}
          <SectionCard title="Deneyim" icon={Briefcase} count={cv.experience?.length ?? 0}>
            {cv.experience?.length > 0 ? (
              <div className="flex flex-col divide-y divide-white/4">
                {cv.experience.map(exp => {
                  const wt = WORK_TYPE_MAP[exp.workType];
                  return (
                    <div key={exp.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="text-[14px] font-semibold text-white">{exp.position}</div>
                          <div className="text-[12px] text-[#818CF8] mt-0.5">
                            {exp.company} · {EMPLOYMENT_MAP[exp.employmentType]}
                          </div>
                        </div>
                        {wt && <Tag label={wt.label} className={wt.className} />}
                      </div>
                      <div className="text-[12px] text-[#5A5F7A] mb-2">
                        {dateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        {exp.location && ` · ${exp.location.city}, ${exp.location.district}`}
                      </div>
                      {exp.description && (
                        <p className="text-[12px] text-[#9CA3C7] leading-relaxed mb-3">{exp.description}</p>
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.education.map(edu => (
                  <div key={edu.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="text-[14px] font-semibold text-white">{edu.school}</div>
                        <div className="text-[12px] text-[#818CF8] mt-0.5">
                          {edu.field} · {DEGREE_MAP[edu.degree]}
                        </div>
                      </div>
                      {edu.gpa && (
                        <span className="text-[11px] text-[#9CA3C7] bg-white/5 border border-white/8 px-2.5 py-1 rounded-full shrink-0">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-[#5A5F7A] mb-2">
                      {dateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                    </div>
                    {edu.description && <p className="text-[12px] text-[#9CA3C7] leading-relaxed">{edu.description}</p>}
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.languages.map((lang, i) => {
                  const prof = PROFICIENCY_MAP[lang.proficiency];
                  return (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <span className="text-[13px] text-white font-medium">
                        {Object.keys(LANGUAGE_MAP).includes(lang.name) ? LANGUAGE_MAP[lang.name] : lang.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {Array.from({ length: 7 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2.5 h-2.5 rounded-full ${idx < prof.level ? 'bg-[#6366F1]' : 'bg-white/10'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#9CA3C7] min-w-25 text-right">{prof.label}</span>
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.certifications.map(cert => (
                  <div key={cert.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-white">{cert.name}</div>
                        <div className="text-[12px] text-[#818CF8] mt-0.5">{cert.issuer}</div>
                        <div className="text-[11px] text-[#5A5F7A] mt-1">
                          {fmt(cert.issueDate)}
                          {cert.hasExpiry && cert.expiryDate ? ` – ${fmt(cert.expiryDate)}` : ' · Süresiz'}
                        </div>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#818CF8] hover:text-[#6366F1] transition-colors shrink-0"
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.projects.map(proj => (
                  <div key={proj.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="text-[14px] font-semibold text-white">{proj.name}</div>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#818CF8] hover:text-[#6366F1] transition-colors shrink-0"
                        >
                          <Link size={12} />
                          <span>Link</span>
                        </a>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5A5F7A] mb-2">{fmt(proj.startDate)}</div>
                    {proj.description && (
                      <p className="text-[12px] text-[#9CA3C7] leading-relaxed mb-3">{proj.description}</p>
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.courses.map(course => (
                  <div key={course.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-white">{course.name}</div>
                        <div className="text-[12px] text-[#818CF8] mt-0.5">{course.institution}</div>
                        <div className="text-[11px] text-[#5A5F7A] mt-1">{fmt(course.completionDate)}</div>
                        {course.description && (
                          <p className="text-[12px] text-[#9CA3C7] leading-relaxed mt-1">{course.description}</p>
                        )}
                      </div>
                      {course.url && (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#818CF8] hover:text-[#6366F1] transition-colors shrink-0"
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.awards.map(award => (
                  <div key={award.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-[13px] font-semibold text-white">{award.title}</div>
                    <div className="text-[12px] text-[#818CF8] mt-0.5">
                      {award.issuer} · {fmt(award.date)}
                    </div>
                    {award.description && (
                      <p className="text-[12px] text-[#9CA3C7] leading-relaxed mt-1">{award.description}</p>
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
              <div className="flex flex-col divide-y divide-white/4">
                {cv.patents.map(patent => (
                  <div key={patent.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-white">{patent.title}</div>
                        <div className="text-[12px] text-[#818CF8] mt-0.5">
                          No: {patent.patentNumber} · {fmt(patent.issueDate)}
                        </div>
                        {patent.description && (
                          <p className="text-[12px] text-[#9CA3C7] leading-relaxed mt-1">{patent.description}</p>
                        )}
                      </div>
                      {patent.url && (
                        <a
                          href={patent.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#818CF8] hover:text-[#6366F1] transition-colors shrink-0"
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
                  <div key={ref.id} className="bg-[#181A21] border border-white/6 rounded-xl p-4">
                    <div className="text-[13px] font-semibold text-white">{ref.name}</div>
                    <div className="text-[12px] text-[#818CF8] mt-0.5">
                      {ref.position} · {ref.company}
                    </div>
                    <div className="text-[11px] text-[#5A5F7A] mt-1 mb-3">{ref.relationship}</div>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[11px] text-[#9CA3C7]">{ref.email}</div>
                      <div className="text-[11px] text-[#9CA3C7]">{ref.phone}</div>
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
                    <Tag key={h} label={h} className="bg-white/5 text-[#9CA3C7] border-white/8" />
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
                    <Tag key={d} label={d} className="bg-white/5 text-[#9CA3C7] border-white/8" />
                  ))}
                </div>
              ) : (
                <EmptyState text="Sürücü belgesi eklenmemiş." />
              )}
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
};

export { CvDetails };
