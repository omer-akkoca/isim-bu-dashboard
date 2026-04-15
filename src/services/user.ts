import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../lib/firebase';
import type { ICV, IUser, UserBasicInfo } from '../types';

export const getUserCount = async () => {
  const coll = collection(db, 'users');
  const snapshot = await getCountFromServer(coll);
  const userCount = snapshot.data().count;
  return userCount;
};

export const getAllUsers = async (): Promise<IUser[] | null> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const cvs = querySnapshot.docs.map(doc => doc.data() as IUser);
    return cvs;
  } catch (error) {
    return null;
  }
};

export const getUserBasicInfo = async (userId: string): Promise<UserBasicInfo | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data() as IUser;
    const value: UserBasicInfo = {
      userId: data.uid,
      name: data.name,
      photoUrl: data.photoUrl,
      surname: data.surname,
      title: data.title ?? '',
    };
    return value;
  } catch (error) {
    return null;
  }
};

export const getUserDetails = async (userId: string): Promise<IUser | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const data = docSnap.data() as IUser;
    return data;
  } catch (error) {
    return null;
  }
};

export const incrementUserViewCount = async (userId: string): Promise<boolean> => {
  try {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { viewCount: increment(1) });
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserActiveCvs = async (userId: string): Promise<ICV[] | null> => {
  try {
    const q = query(collection(db, 'cvs'), where('userId', '==', userId), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    const cvs = snapshot.docs.map(doc => doc.data() as ICV);
    return cvs;
  } catch (error) {
    return null;
  }
};
