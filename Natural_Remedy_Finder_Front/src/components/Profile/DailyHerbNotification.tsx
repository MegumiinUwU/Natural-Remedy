import { X } from 'lucide-react';
interface DailyHerbNotificationProps {
  herb: {
    name: string;
    benefits: string;
    usage: string;
    tags: string[];
  };
  onClose: () => void;
}
const DailyHerbNotification: React.FC<DailyHerbNotificationProps> = ({ herb, onClose }) => {
  return (
    <div className="fixed top-24 right-4 w-80 bg-white rounded-lg shadow-lg border border-green-100 overflow-hidden animate-slideIn z-50">
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">Today's Herb</span>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
          <span>🌿</span> {herb.name}
        </h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-600">Benefits:</h4>
            <p className="text-sm text-gray-700">{herb.benefits}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600">Use it as:</h4>
            <p className="text-sm text-gray-700">{herb.usage}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {herb.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <button className="mt-4 text-sm text-green-700 hover:text-green-800 font-medium">
          Learn more →
        </button>
      </div>
    </div>
  );
};

export default DailyHerbNotification;