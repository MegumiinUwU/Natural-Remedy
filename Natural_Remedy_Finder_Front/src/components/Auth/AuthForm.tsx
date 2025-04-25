import { useState } from 'react';
import { Leaf } from 'lucide-react';
import LoginForm from '../../pages/auth/login';
import RegisterForm from '../../pages/auth/register';

interface AuthFormProps {
  mode: 'login' | 'register';
  toggleMode: () => void;
}

const AuthForm = ({ mode, toggleMode }: AuthFormProps) => {
  const [formKey, setFormKey] = useState(0);
  
  const handleToggleMode = () => {
    setFormKey(prev => prev + 1);
    setTimeout(() => {
      toggleMode();
    }, 50);
  };

  return (
    <div 
      className="form-container"
      style={{
        minHeight: mode === 'login' ? '430px' : '580px',
      }}
    >
      <div className="absolute -top-6 -right-6 text-green-200 opacity-30 transform rotate-45 scale-150">
        <Leaf size={80} />
      </div>
      <div className="absolute -bottom-6 -left-6 text-green-200 opacity-30 transform -rotate-45 scale-150">
        <Leaf size={80} />
      </div>
      
      <div className="relative z-10" key={formKey}>
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="flex space-x-2 bg-green-100 p-1 rounded-lg">
              <button
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  mode === 'login'
                    ? 'bg-white text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-white/50'
                }`}
                onClick={() => mode === 'register' && handleToggleMode()}
              >
                Sign In
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  mode === 'register'
                    ? 'bg-white text-green-800 shadow-sm'
                    : 'text-green-700 hover:bg-white/50'
                }`}
                onClick={() => mode === 'login' && handleToggleMode()}
              >
                Register
              </button>
            </div>
            <div 
              className="absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-300"
              style={{ 
                width: '50%',
                transform: `translateX(${mode === 'login' ? '0%' : '100%'})`
              }}
            />
          </div>
        </div>
        
        <div className="transition-all duration-500 transform">
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;