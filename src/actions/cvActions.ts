import { useCallback, useState } from 'react';

import { getActiveCvCount, getAllActiveCvs, getCvCount, getCvDetails, incrementCvViewCount } from '../services';
import type { ICV } from '../types';

const useCvActions = () => {
  const [loading, setLoading] = useState(false);

  const handleGetCvCount = useCallback(async (): Promise<number> => {
    const cvCount = await getCvCount();
    return cvCount;
  }, []);

  const handleGetActiveCvCount = useCallback(async (): Promise<number> => {
    const cvCount = await getActiveCvCount();
    return cvCount;
  }, []);

  const handleGetAllActiveCvs = useCallback(async (): Promise<ICV[]> => {
    setLoading(true);
    try {
      const data = await getAllActiveCvs();
      if (data) return data;
      return [];
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetCvDetails = useCallback(async (cvId: string): Promise<ICV | null> => {
    try {
      const cv = await getCvDetails(cvId);
      if (cv) return cv;
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const handleIncrementCvViewCount = async (cvId: string) => {
    await incrementCvViewCount(cvId);
  };

  return {
    loading,
    handleGetCvCount,
    handleGetActiveCvCount,
    handleGetAllActiveCvs,
    handleGetCvDetails,
    handleIncrementCvViewCount,
  };
};

export { useCvActions };
