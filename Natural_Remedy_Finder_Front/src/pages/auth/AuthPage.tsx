import { useState } from 'react';
import AuthForm from '../../components/Auth/AuthForm';
import { LeafBackground } from '../../components/Auth/AuthBackground';

function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white overflow-hidden relative py-8">
      <LeafBackground />
      
      <div className="z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-green-800 mb-3 font-herbal text-center leading-tight">
            Natural Remedy
            <br />
            Finder
          </h1>
          <p className="text-green-600 text-center max-w-sm text-lg">
            Discover natural solutions for your wellness journey
          </p>
        </div>
        
        <AuthForm mode={mode} toggleMode={toggleMode} />
        
        <p className="text-center mt-8 text-green-700 text-sm">
          © 2025 Natural Remedy Finder. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;