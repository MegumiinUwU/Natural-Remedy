import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormField from '../../components/Auth/FormField';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', { email, password, rememberMe });
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500">
      <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center font-herbal">
        Welcome Back
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        
        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button 
            type="button"
            className="absolute right-3 top-[43px] text-green-600 hover:text-green-800"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex items-center justify-between my-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-green-700">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-green-600 hover:text-green-800 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
        
        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;