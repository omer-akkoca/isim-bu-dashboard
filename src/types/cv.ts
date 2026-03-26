import type { Timestamp } from 'firebase/firestore';

import type { ILocation } from './common';

export interface ICV {
  cvId: string;
  title: string;
  user: ICvUser;
  viewCount: number;
  summary: string;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  certifications: ICertificate[];
  languages: ILanguage[];
  projects: IProject[];
  hobbies: string[];
  drivingLicences: string[];
  references: IReference[];
  courses: ICourse[];
  patents: IPatent[];
  awards: IAward[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ICvUser {
  userId: string;
  fullName: string;
  userTitle?: string;
  userPhoto?: string;
}

export interface IExperience {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  workType: WorkType;
  startDate: Timestamp;
  endDate: Timestamp | null; // hala çalışıyorsa null
  isCurrent: boolean; // hala bu işte mi
  description: string;
  location: ILocation;
  skills: string[];
}

export interface IEducation {
  id: string;
  school: string;
  field: string;
  degree: DegreeType;
  startDate: Timestamp;
  endDate: Timestamp | null;
  isCurrent: boolean;
  gpa: number | null;
  description: string;
}

export interface ICertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: Timestamp;
  expiryDate: Timestamp | null;
  hasExpiry: boolean;
  credentialUrl: string;
}

export interface ILanguage {
  name: CommonLanguagesType;
  proficiency: ProficiencyType;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  url: string;
  startDate: Timestamp;
  skills: string[];
}

export interface IReference {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface ICourse {
  id: string;
  name: string;
  institution: string;
  completionDate: Timestamp;
  url?: string;
  description: string;
}

export interface IPatent {
  id: string;
  title: string; // patent adı
  patentNumber: string; // patent numarası
  issueDate: Timestamp; // verilme tarihi
  url?: string; // patent linki, isteğe bağlı
  description: string; // açıklama
}

export interface IAward {
  id: string;
  title: string;
  issuer: string;
  date: Timestamp;
  description: string;
}

export type EmploymentType = 'full_time' | 'part_time' | 'internship' | 'freelance' | 'volunteer' | 'contract';

export type WorkType = 'remote' | 'hybrid' | 'onsite';

export type DegreeType = 'high_school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'vocational' | 'other';

export type ProficiencyType = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2' | 'native';
export type CommonLanguagesType =
  | 'english'
  | 'german'
  | 'french'
  | 'spanish'
  | 'russian'
  | 'arabic'
  | 'chinese'
  | 'japanese'
  | 'portuguese'
  | 'hindi'
  | 'other';
