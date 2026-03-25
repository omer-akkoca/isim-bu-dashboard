import type { Timestamp } from 'firebase/firestore';
import type { ILocation, ISocialMedia } from './common';

export interface IUser {
  uid: string;
  email: string;
  phone: string;
  name: string;
  surname: string;
  photoUrl: string;
  title?: string;
  gender: GenderType;
  birthDate: Timestamp;
  location: ILocation;
  cvs: ICVSummary[];
  jobSearchStatus: JobSearchStatusType;
  socialMedia: ISocialMedia[];
  militaryStatus: MilitaryStatusType;
  salaryExpectation: ISalaryExpectation;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type GenderType = 'male' | 'female' | 'other';
export type JobSearchStatusType = 'very_urgent' | 'urgent' | 'looking' | 'not_looking';
export type MilitaryStatusType = 'completed' | 'exempt' | 'deferred' | 'notDone';

export interface ICVSummary {
  cvId: string;
  title: string;
  createdAt: Timestamp;
}

export interface ISalaryExpectation {
  min?: number;
  max?: number;
}

export interface UserBasicInfo {
  photoUrl: string;
  name: string;
  surname: string;
  title: string;
}
