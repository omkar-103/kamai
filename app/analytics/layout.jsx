'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const isDemo = localStorage.getItem('isDemo') === 'true';

    if (!token || !userData) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser({ ...parsedUser, isDemo });
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080715] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1BD4CA]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Simply render children - each page handles its own layout
  return <>{children}</>;
}