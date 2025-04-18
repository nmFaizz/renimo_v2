import { getToken } from '@/lib/cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return function WrappedComponent(props: P) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    
    const checkAuth = useCallback(() => {
      const token = getToken("renimo_token");
      if (!token) {
        router.replace("/sign-in");
        return false;
      }
      return true;
    }, [router]);
    
    useEffect(() => {
      checkAuth();
      setIsChecking(false);
    }, [checkAuth]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        checkAuth();
      }, 5000); 
      
      return () => clearInterval(intervalId);
    }, [checkAuth]);

    useEffect(() => {
      const handleCookieChange = () => {
        setIsChecking(true);
        checkAuth();
        setIsChecking(false);
      };
      
      window.addEventListener('cookie-change', handleCookieChange);
      return () => window.removeEventListener('cookie-change', handleCookieChange);
    }, [checkAuth]);

    console.log("isChecking", isChecking);

    if (isChecking) {
      return <Skeleton className='max-w-[520px] h-[70vh] rounded-xl w-full' />; 
    }

    return <Component {...props} />;
  };
};

export default withAuth;