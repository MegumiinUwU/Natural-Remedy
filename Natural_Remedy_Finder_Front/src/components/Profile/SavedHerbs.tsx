import { useState } from 'react';
import { Search, BookmarkCheck } from 'lucide-react';

export interface Herb {
    id: string;
    name: string;
    scientificName: string;
    description: string;
    benefits: string[];
    image: string;
    savedAt: string;
  }
interface SavedHerbsProps {
  herbs: Herb[];
}

const SavedHerbs: React.FC<SavedHerbsProps> = ({ herbs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredHerbs = herbs.filter(herb => 
    herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
      <div className="px-6 py-4 border-b border-green-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-green-900">Saved Herbs</h2>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search herbs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-green-50/50 border-0 rounded-full focus:ring-2 focus:ring-green-500 text-sm"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHerbs.map((herb) => (
            <div 
              key={herb.id}
              className="bg-white rounded-lg overflow-hidden border border-green-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative h-40">
                <img 
                  src={herb.image} 
                  alt={herb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
                  <BookmarkCheck size={16} className="text-green-600" />
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-green-900">{herb.name}</h3>
                <p className="text-xs text-gray-500 italic mt-0.5">{herb.scientificName}</p>
                
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{herb.description}</p>
                
                <div className="mt-3 pt-3 border-t border-green-50">
                  <div className="flex flex-wrap gap-1">
                    {herb.benefits.slice(0, 2).map((benefit, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                    {herb.benefits.length > 2 && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">
                        +{herb.benefits.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedHerbs;