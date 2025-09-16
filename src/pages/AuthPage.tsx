import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Login } from '@/components/Auth/Login';
import { Register } from '@/components/Auth/Register';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { userType } = useParams<{ userType: 'driver' | 'user' }>();

  if (!userType) {
    // Handle case where userType is not defined, maybe redirect to home
    return <div>Invalid user type specified.</div>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        {isLogin ? <Login userType={userType} /> : <Register userType={userType} />}
        <div className="text-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
