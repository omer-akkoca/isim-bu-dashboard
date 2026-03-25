import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db } from '../lib/firebase';
import type { IUser, UserBasicInfo } from '../types';

const PAGE_SIZE = 20;

const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageCursors, setPageCursors] = useState<Record<number, unknown>>({});

  const getUsers = useCallback(
    async (page: number = 1): Promise<IUser[]> => {
      setLoading(true);
      try {
        // Toplam sayıyı öğrenmek için count sorgusu
        const countSnap = await getDocs(collection(db, 'users'));
        const total = countSnap.size;
        setTotalPages(Math.ceil(total / PAGE_SIZE));

        let q;

        if (page === 1) {
          q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
        } else {
          const cursor = pageCursors[page];
          if (!cursor) return [];
          q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE_SIZE));
        }

        const snap = await getDocs(q);

        // Sonraki sayfa için cursor'ı sakla
        const lastDoc = snap.docs[snap.docs.length - 1];
        if (lastDoc) {
          setPageCursors(prev => ({ ...prev, [page + 1]: lastDoc }));
        }

        const users = snap.docs.map(doc => doc.data()) as IUser[];

        return users;
      } catch (err) {
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pageCursors],
  );

  const getUserBasicInfo = async (userId: string): Promise<UserBasicInfo | null> => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return {
        photoUrl: data.photoUrl,
        name: data.name,
        surname: data.surname,
        title: data.title,
      };
    } catch (error) {
      console.error('User fetch error:', error);
      return null;
    }
  };

  return { loading, totalPages, getUsers, getUserBasicInfo };
};

export { useUserActions };
