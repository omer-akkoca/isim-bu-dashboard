import { useCallback, useState } from 'react';

import {
  getAllUsers,
  getUserActiveCvs,
  getUserBasicInfo,
  getUserCount,
  getUserDetails,
  incrementUserViewCount,
} from '../services';
import type { ICV, IUser, UserBasicInfo } from '../types';

const useUserActions = () => {
  const [loading, setLoading] = useState(false);

  const handleGetUserCount = useCallback(async (): Promise<number> => {
    const cvCount = await getUserCount();
    return cvCount;
  }, []);

  const handleGetAllUsers = useCallback(async (): Promise<IUser[]> => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      if (data) return data;
      return [];
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetUserBasicInfo = async (userId: string): Promise<UserBasicInfo | null> => {
    try {
      const userBasicInfo = getUserBasicInfo(userId);
      return userBasicInfo;
    } catch (error) {
      return null;
    }
  };

  const handleGetUserDetails = useCallback(async (userId: string): Promise<IUser | null> => {
    try {
      const user = await getUserDetails(userId);
      if (user) return user;
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const handleIncrementUserViewCount = async (cvId: string) => {
    await incrementUserViewCount(cvId);
  };

  const handlegetUserActiveCvs = useCallback(async (userId: string): Promise<ICV[] | []> => {
    try {
      const userCVs = await getUserActiveCvs(userId);
      if (userCVs) return userCVs;
      return [];
    } catch (error) {
      return [];
    }
  }, []);

  return {
    loading,
    handleGetUserCount,
    handleGetAllUsers,
    handleGetUserBasicInfo,
    getUserDetails,
    handleIncrementUserViewCount,
    handleGetUserDetails,
    handlegetUserActiveCvs,
  };
};

export { useUserActions };
