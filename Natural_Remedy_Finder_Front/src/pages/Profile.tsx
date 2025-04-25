import { useState } from 'react';
import ProfileImageUpload from '../components/Profile/ProfileImageUpload';
import ActiveGoals from '../components/Profile/ActiveGoals';
import SavedHerbs from '../components/Profile/SavedHerbs';
import DailyHerbNotification from '../components/Profile/DailyHerbNotification';
import { Calendar, Mail, Clock, Leaf, Award, BookOpen, Bell } from 'lucide-react';
import Button from '../components/ui/Button';
 interface User {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    goals: Goal[];
    favoriteHerbs: Herb[];
    joinDate: string;
  }
  
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
const todaysHerb = {
  name: 'Chamomile',
  benefits: 'Promotes relaxation, supports digestion, eases anxiety and insomnia.',
  usage: 'Tea, oil, or warm compress.',
  tags: ['Sleep', 'Calm', 'Digestive'],
};

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
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [showNotification, setShowNotification] = useState(false);

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUser(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
  };

  const handleGoalsUpdate = (updatedGoals: Goal[]) => {
    setUser(prev => ({
      ...prev,
      goals: updatedGoals
    }));
  };

  const handleHerbsUpdate = (updatedHerbs: Herb[]) => {
    setUser(prev => ({
      ...prev,
      favoriteHerbs: updatedHerbs
    }));
  };

  return (
    <div className="min-h-screen bg-green-50 pb-12">
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 animate-fadeIn relative">
          {/* Decorative leaves */}
          <div className="absolute -right-16 -bottom-16 text-green-50 transform rotate-12 animate-pulse">
            <Leaf size={200} />
          </div>
          <div className="absolute -left-16 -top-16 text-green-50 transform -rotate-12 animate-pulse">
            <Leaf size={200} />
          </div>
          
          <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 px-6 py-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative">
                <ProfileImageUpload 
                  currentImage={user.profileImage}
                  onImageUpload={handleImageUpload}
                />
                <div className="absolute -bottom-2 right-0 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                  <Award size={16} />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowNotification(true)}
                    className="flex items-center gap-2"
                  >
                    <Bell size={16} />
                    <span>Today's Herb</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-green-100 justify-center md:justify-start">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <p className="text-green-200 mt-2 flex items-center gap-2 justify-center md:justify-start">
                  <BookOpen size={16} />
                  <span>Natural Health Enthusiast</span>
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-center transform hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-white">{user.goals.length}</p>
                  <p className="text-sm text-green-100">Goals</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-center transform hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-white">{user.favoriteHerbs.length}</p>
                  <p className="text-sm text-green-100">Herbs</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-center gap-8 text-gray-600 relative z-10 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-green-600" />
              <div>
                <p className="text-sm">Member Since</p>
                <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-green-600" />
              <div>
                <p className="text-sm">Last Active</p>
                <p className="font-medium">Today at 9:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActiveGoals goals={user.goals} onGoalsUpdate={handleGoalsUpdate} />
          <SavedHerbs herbs={user.favoriteHerbs} onHerbsUpdate={handleHerbsUpdate} />
        </div>
      </div>
      
      {showNotification && (
        <DailyHerbNotification 
          herb={todaysHerb} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;