import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormField from '../../components/Auth/FormField';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Register submitted:', { name, email, password, agreeTerms });
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500">
      <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center font-herbal">
        Create Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
        
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
        
        <div className="relative">
          <FormField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button 
            type="button"
            className="absolute right-3 top-[43px] text-green-600 hover:text-green-800"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex items-center my-4">
          <input
            id="agree-terms"
            type="checkbox"
            className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm text-green-700">
            I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={!agreeTerms}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;