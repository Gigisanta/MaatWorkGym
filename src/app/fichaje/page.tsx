'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FichajeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/main/fichaje');
  }, [router]);

  return null;
}
