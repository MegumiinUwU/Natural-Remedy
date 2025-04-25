import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { Bell, Lock, User as UserIcon } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    description: string;
    progress: number;
    createdAt: string;
  }
  
 interface Herb {
    id: string;
    name: string;
    scientificName: string;
    description: string;
    benefits: string[];
    image: string;
    savedAt: string;
  }
interface User {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    goals: Goal[];
    favoriteHerbs: Herb[];
    joinDate: string;
  }
const mockUser: User = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    profileImage: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    goals: [
      {
        id: '1',
        title: 'Improve Sleep Quality',
        description: 'Develop a natural sleep routine using herbs and mindfulness',
        progress: 65,
        createdAt: '2023-09-15T10:30:00Z',
      },
      {
        id: '2',
        title: 'Boost Immunity',
        description: 'Strengthen immune system with natural supplements',
        progress: 40,
        createdAt: '2023-11-20T14:15:00Z',
      },
      {
        id: '3',
        title: 'Reduce Stress',
        description: 'Manage daily stress with meditation and herbal remedies',
        progress: 80,
        createdAt: '2023-08-05T09:45:00Z',
      }
    ],
    favoriteHerbs: [
      {
        id: '1',
        name: 'Lavender',
        scientificName: 'Lavandula',
        description: 'Known for its calming properties and pleasant scent',
        benefits: ['Promotes relaxation', 'Improves sleep', 'Reduces anxiety'],
        image: 'https://images.pexels.com/photos/4927376/pexels-photo-4927376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        savedAt: '2023-10-12T11:20:00Z',
      },
      {
        id: '2',
        name: 'Chamomile',
        scientificName: 'Matricaria chamomilla',
        description: 'Gentle herb with calming effects, commonly used in teas',
        benefits: ['Aids digestion', 'Reduces inflammation', 'Promotes sleep'],
        image: 'https://images.pexels.com/photos/6621362/pexels-photo-6621362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        savedAt: '2023-09-05T15:45:00Z',
      },
      {
        id: '3',
        name: 'Echinacea',
        scientificName: 'Echinacea purpurea',
        description: 'Popular herb used to support immune system health',
        benefits: ['Boosts immunity', 'Reduces cold symptoms', 'Anti-inflammatory'],
        image: 'https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        savedAt: '2023-11-18T08:30:00Z',
      },
      {
        id: '4',
        name: 'Peppermint',
        scientificName: 'Mentha piperita',
        description: 'Refreshing herb with cooling properties',
        benefits: ['Aids digestion', 'Relieves headaches', 'Improves concentration'],
        image: 'https://images.pexels.com/photos/970089/pexels-photo-970089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        savedAt: '2023-10-30T16:20:00Z',
      }
    ],
    joinDate: '2023-05-10T08:00:00Z',
  };
const SettingsPage: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [email, setEmail] = useState(user.email);
  const [notifications, setNotifications] = useState({
    dailyHerb: true,
    weeklyDigest: true,
    goalReminders: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for saving settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-900 mb-6">Account Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <UserIcon size={20} className="text-green-700" />
              <h2 className="text-lg font-semibold text-green-900">Profile Settings</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input 
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Lock size={20} className="text-green-700" />
              <h2 className="text-lg font-semibold text-green-900">Security</h2>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <Button variant="primary">
                  Update Password
                </Button>
              </form>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Bell size={20} className="text-green-700" />
              <h2 className="text-lg font-semibold text-green-900">Notifications</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Daily Herb Notification</h3>
                    <p className="text-sm text-gray-500">Receive daily herb recommendations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={notifications.dailyHerb}
                      onChange={(e) => setNotifications({...notifications, dailyHerb: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                    <p className="text-sm text-gray-500">Weekly summary of your herb journey</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={notifications.weeklyDigest}
                      onChange={(e) => setNotifications({...notifications, weeklyDigest: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Goal Reminders</h3>
                    <p className="text-sm text-gray-500">Notifications about your health goals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={notifications.goalReminders}
                      onChange={(e) => setNotifications({...notifications, goalReminders: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;