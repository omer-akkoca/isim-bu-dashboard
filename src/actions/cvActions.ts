import { useCallback, useState } from 'react';
import type { ICV } from '../types';
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

  return { loading, totalPages, getCvs };
};

export { useCvActions };
