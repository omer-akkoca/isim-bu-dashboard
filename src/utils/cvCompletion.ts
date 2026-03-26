/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICV } from '../types';

export interface CVCompletenessResult {
  /** 0–100 arası toplam skor */
  score: number;
  /** Her alan için detaylı skor */
  breakdown: Record<CVSection, SectionScore>;
  /** Öncelikli iyileştirme önerileri */
  suggestions: Suggestion[];
}

export interface SectionScore {
  /** Bu alanın taşıdığı maksimum ağırlık */
  maxWeight: number;
  /** Kazanılan puan (0–maxWeight) */
  earned: number;
  /** 0–1 arası doluluk oranı */
  ratio: number;
}

export interface Suggestion {
  section: CVSection;
  message: string;
  /** Tamamlanırsa kazanılacak tahmini puan */
  potentialGain: number;
}

export type CVSection =
  | 'experience'
  | 'education'
  | 'skills'
  | 'summary'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'courses'
  | 'references'
  | 'awards'
  | 'patents'
  | 'hobbies';

// ─────────────────────────────────────────────
// Alan ağırlıkları (toplam = 100)
// ─────────────────────────────────────────────

const WEIGHTS: Record<CVSection, number> = {
  experience: 30,
  education: 15,
  skills: 15,
  summary: 10,
  languages: 5,
  certifications: 5,
  projects: 5,
  courses: 5,
  references: 4,
  awards: 3,
  patents: 2,
  hobbies: 1,
};

// ─────────────────────────────────────────────
// Yardımcı fonksiyonlar
// ─────────────────────────────────────────────

/** Bir string'in dolu ve anlamlı olup olmadığını kontrol eder */
function hasContent(s: string | null | undefined, minLength = 1): boolean {
  return typeof s === 'string' && s.trim().length >= minLength;
}

/** 0–1 arasına kıstırır */
function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

// ─────────────────────────────────────────────
// Bölüm bazlı kalite hesaplayıcılar
// Her fonksiyon 0–1 arası bir oran döndürür
// ─────────────────────────────────────────────

function scoreExperience(exp: ICV['experience']): number {
  if (!exp.length) return 0;

  // İlk 3 kayıt daha fazla ağırlık taşır (azalan katkı)
  const weights = [0.5, 0.3, 0.2];
  const items = exp.slice(0, 3);

  const total = items.reduce((sum, item, i) => {
    const w = weights[i] ?? 0.1;
    let q = 0;

    // Zorunlu alanlar
    q += hasContent(item.company) ? 0.2 : 0;
    q += hasContent(item.position) ? 0.2 : 0;
    q += item.startDate ? 0.1 : 0;

    // Kalite artırıcı alanlar
    q += hasContent(item.description, 50) ? 0.2 : hasContent(item.description) ? 0.1 : 0;
    q += item.skills?.length >= 2 ? 0.15 : item.skills?.length === 1 ? 0.07 : 0;
    q += item.employmentType ? 0.05 : 0;
    q += item.workType ? 0.05 : 0;
    q += hasContent(item.location?.city) ? 0.05 : 0;

    return sum + w * q;
  }, 0);

  // 3'ten fazla deneyim bonusu (max %20 ek)
  const countBonus = clamp01((exp.length - 1) / 5) * 0.2;

  return clamp01(total + countBonus);
}

function scoreEducation(edu: ICV['education']): number {
  if (!edu.length) return 0;

  const item = edu[0]; // En güncel/önemli eğitim
  let q = 0;

  q += hasContent(item.school) ? 0.3 : 0;
  q += hasContent(item.field) ? 0.25 : 0;
  q += item.degree ? 0.2 : 0;
  q += item.startDate ? 0.1 : 0;
  q += item.gpa !== null ? 0.1 : 0;
  q += hasContent(item.description) ? 0.05 : 0;

  // Birden fazla eğitim küçük bonus
  const multiBonus = edu.length > 1 ? 0.1 : 0;

  return clamp01(q + multiBonus);
}

function scoreSkills(skills: string[]): number {
  if (!skills.length) return 0;

  // 3 beceri → %50, 6 → %75, 10+ → %100
  if (skills.length >= 10) return 1;
  if (skills.length >= 6) return 0.75;
  if (skills.length >= 3) return 0.5;
  return skills.length / 6; // 1 veya 2 beceri orantılı
}

function scoreSummary(summary: string): number {
  const len = summary?.trim().length ?? 0;
  if (len === 0) return 0;
  if (len < 50) return 0.3;
  if (len < 100) return 0.6;
  if (len < 200) return 0.85;
  return 1; // 200+ karakter ideal özet
}

function scoreSimpleList(
  items: Array<Record<string, unknown>>,
  /** Bir öğenin "kaliteli" sayılması için kontrol fonksiyonu */
  qualityCheck?: (item: Record<string, unknown>) => boolean,
  idealCount = 2,
): number {
  if (!items.length) return 0;

  const baseScore = clamp01(items.length / idealCount);

  if (!qualityCheck) return baseScore;

  const qualityRatio = items.filter(i => qualityCheck(i)).length / items.length;

  // %70 varlık + %30 kalite
  return clamp01(baseScore * 0.7 + qualityRatio * 0.3);
}

// ─────────────────────────────────────────────
// Ana hesaplama fonksiyonu
// ─────────────────────────────────────────────

export function calculateCVCompleteness(cv: ICV): CVCompletenessResult {
  // 1. Her bölüm için 0–1 arası oran hesapla
  const ratios: Record<CVSection, number> = {
    experience: scoreExperience(cv.experience),
    education: scoreEducation(cv.education),
    skills: scoreSkills(cv.skills),
    summary: scoreSummary(cv.summary),
    languages: scoreSimpleList(cv.languages as never, (l: any) => hasContent(l.proficiency), 2),
    certifications: scoreSimpleList(cv.certifications as never, (c: any) => hasContent(c.name) && hasContent(c.issuer), 1),
    projects: scoreSimpleList(cv.projects as never, (p: any) => hasContent(p.description, 30), 2),
    courses: scoreSimpleList(cv.courses as never, undefined, 2),
    references: scoreSimpleList(cv.references as never, (r: any) => hasContent(r.email) || hasContent(r.phone), 1),
    awards: scoreSimpleList(cv.awards as never, undefined, 1),
    patents: scoreSimpleList(cv.patents as never, undefined, 1),
    hobbies: cv.hobbies?.length >= 2 ? 1 : cv.hobbies?.length / 2 || 0,
  };

  // 2. Ağırlıklı puan hesapla
  const breakdown = {} as Record<CVSection, SectionScore>;
  let totalScore = 0;

  for (const section of Object.keys(WEIGHTS) as CVSection[]) {
    const maxWeight = WEIGHTS[section];
    const ratio = ratios[section];
    const earned = maxWeight * ratio;

    breakdown[section] = { maxWeight, earned, ratio };
    totalScore += earned;
  }

  // 3. Önerileri üret (puan kaybı büyükten küçüğe)
  const suggestions: Suggestion[] = (Object.keys(WEIGHTS) as CVSection[])
    .map(section => ({
      section,
      lost: WEIGHTS[section] * (1 - ratios[section]),
    }))
    .filter(({ lost }) => lost > 0.5) // 0.5 puandan az kayıp önerilmez
    .sort((a, b) => b.lost - a.lost)
    //.slice(0, 5) // En fazla 5 öneri
    .map(({ section, lost }) => ({
      section,
      message: getSuggestionMessage(section, ratios[section]),
      potentialGain: Math.round(lost * 10) / 10,
    }));

  return {
    score: Math.round(totalScore),
    breakdown,
    suggestions,
  };
}

// ─────────────────────────────────────────────
// Öneri mesajları
// ─────────────────────────────────────────────

function getSuggestionMessage(section: CVSection, ratio: number): string {
  const messages: Record<CVSection, (r: number) => string> = {
    experience: r =>
      r === 0
        ? 'İş deneyimi eklenmemiş. En az bir pozisyon ekleyin.'
        : 'Deneyimlerinize açıklama ve beceriler ekleyerek detaylandırın.',
    education: r => (r === 0 ? 'Eğitim bilgisi eklenmemiş.' : 'Eğitiminize GPA veya açıklama ekleyin.'),
    skills: r => (r === 0 ? 'Hiç beceri eklenmemiş. En az 5-6 beceri ekleyin.' : 'Beceri sayınızı artırın (ideal: 10+).'),
    summary: r =>
      r === 0
        ? 'Özet bölümü boş. 150-200 karakterlik bir profesyonel özet yazın.'
        : 'Özet çok kısa. Daha açıklayıcı bir özet yazın.',
    languages: _ => 'Bildiğiniz dilleri ve yetkinlik seviyelerini ekleyin.',
    certifications: _ => 'Varsa sertifikalarınızı ekleyin.',
    projects: _ => 'Projelerinizi açıklamalarıyla birlikte ekleyin.',
    courses: _ => 'Aldığınız kurs veya eğitimleri ekleyin.',
    references: _ => 'Referans kişiler eklemek güven artırır.',
    awards: _ => 'Ödül veya başarılarınız varsa ekleyin.',
    patents: _ => 'Patentleriniz varsa ekleyin.',
    hobbies: _ => 'Hobiler kişiliğinizi yansıtır, birkaç tane ekleyin.',
  };

  return messages[section](ratio);
}
