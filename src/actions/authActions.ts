import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useCallback, useState } from 'react';
import type { ActionProps } from '../types';
import type { LoginProps, RegisterProps } from '../pages/@types';

const useAuthActions = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async ({ data, onSuccess, onError }: ActionProps<LoginProps>) => {
    const { email, password } = data;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.();
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('E-posta veya şifre hatalı.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Bu e-posta zaten kullanılıyor.');
      } else if (code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalı.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
      onError?.();
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ data, onSuccess, onError }: ActionProps<RegisterProps>) => {
    const { email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      onSuccess?.();
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('E-posta veya şifre hatalı.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Bu e-posta zaten kullanılıyor.');
      } else if (code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalı.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
      onError?.();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async ({ onSuccess }: ActionProps<null>) => {
    try {
      setLoading(true);
      await signOut(auth);
      onSuccess?.();
    } catch (err: any) {
      const message = err?.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, loading, login, register, logout };
};

export { useAuthActions };
