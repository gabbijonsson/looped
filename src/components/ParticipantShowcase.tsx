
import { Users, User, Dog } from "lucide-react";

interface ParticipantShowcaseProps {
  households: number;
  adults: number;
  teens: number;
  children: number;
  pets: number;
}

const ParticipantShowcase = ({ 
  households,
  adults,
  teens,
  children,
  pets
}: ParticipantShowcaseProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-amber-100">
      <h2 className="text-xl font-bold text-center text-amber-900 mb-3">Cabin Crew</h2>
      
      <div className="grid grid-cols-5 gap-2">
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Users className="w-7 h-7 text-amber-800" />
          </div>
          <p className="mt-1 text-sm font-medium text-amber-800">{households}</p>
          <p className="text-xs text-amber-600">Households</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="w-7 h-7 text-amber-800" />
          </div>
          <p className="mt-1 text-sm font-medium text-amber-800">{adults}</p>
          <p className="text-xs text-amber-600">Adults</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="w-6 h-6 text-amber-800" />
          </div>
          <p className="mt-1 text-sm font-medium text-amber-800">{teens}</p>
          <p className="text-xs text-amber-600">Teenager</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="w-5 h-5 text-amber-800" />
          </div>
          <p className="mt-1 text-sm font-medium text-amber-800">{children}</p>
          <p className="text-xs text-amber-600">Child</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Dog className="w-7 h-7 text-amber-800" />
          </div>
          <p className="mt-1 text-sm font-medium text-amber-800">{pets}</p>
          <p className="text-xs text-amber-600">Dog</p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantShowcase;
