import { useCallback, useState } from 'react';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../lib/firebase';
import type { ICV } from '../types';

const PAGE_SIZE = 20;

const useCvActions = () => {
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageCursors, setPageCursors] = useState<Record<number, unknown>>({});

  const getCvs = useCallback(
    async (page: number = 1): Promise<ICV[]> => {
      setLoading(true);
      try {
        // Toplam sayıyı öğrenmek için count sorgusu
        const countSnap = await getDocs(collection(db, 'cvs'));
        const total = countSnap.size;
        setTotalPages(Math.ceil(total / PAGE_SIZE));

        let q;

        if (page === 1) {
          q = query(collection(db, 'cvs'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
        } else {
          const cursor = pageCursors[page];
          if (!cursor) return [];
          q = query(collection(db, 'cvs'), orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE_SIZE));
        }

        const snap = await getDocs(q);

        // Sonraki sayfa için cursor'ı sakla
        const lastDoc = snap.docs[snap.docs.length - 1];
        if (lastDoc) {
          setPageCursors(prev => ({ ...prev, [page + 1]: lastDoc }));
        }

        const cvs = snap.docs.map(doc => doc.data()) as ICV[];

        return cvs;
      } catch (err) {
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pageCursors],
  );

  const getCvDetails = async (cvId: string): Promise<ICV | null> => {
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

  const incrementCvViewCount = async (cvId: string) => {
    const ref = doc(db, 'cvs', cvId);
    await updateDoc(ref, { viewCount: increment(1) });
  };

  return { loading, totalPages, getCvs, getCvDetails, incrementCvViewCount };
};

export { useCvActions };
