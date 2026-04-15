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
import type { ICV } from '../types';

export const getCvCount = async () => {
  const coll = collection(db, 'cvs');
  const snapshot = await getCountFromServer(coll);
  const cvCount = snapshot.data().count;
  return cvCount;
};

export const getActiveCvCount = async () => {
  const q = query(collection(db, 'cvs'), where('status', '==', 'active'));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const getAllActiveCvs = async (): Promise<ICV[] | null> => {
  try {
    const q = query(collection(db, 'cvs'), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    const cvs = querySnapshot.docs.map(doc => doc.data()) as ICV[];
    return cvs;
  } catch (error) {
    return null;
  }
};

export const getCvDetails = async (cvId: string): Promise<ICV | null> => {
  try {
    const docRef = doc(db, 'cvs', cvId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const data = docSnap.data() as ICV;
    return data;
  } catch (error) {
    return null;
  }
};

export const incrementCvViewCount = async (cvId: string): Promise<boolean> => {
  try {
    const ref = doc(db, 'cvs', cvId);
    await updateDoc(ref, { viewCount: increment(1) });
    return true;
  } catch (error) {
    return false;
  }
};
