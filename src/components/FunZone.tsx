
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FunZoneProps {
  initialMotto: string;
  initialFunFact: string;
}

const FunZone = ({ initialMotto, initialFunFact }: FunZoneProps) => {
  const [tripMotto, setTripMotto] = useState(initialMotto);
  const [funFact, setFunFact] = useState(initialFunFact);
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const [isEditingFunFact, setIsEditingFunFact] = useState(false);
  const [tempMotto, setTempMotto] = useState(initialMotto);
  const [tempFunFact, setTempFunFact] = useState(initialFunFact);

  const handleSaveMotto = () => {
    setTripMotto(tempMotto);
    setIsEditingMotto(false);
  };

  const handleSaveFunFact = () => {
    setFunFact(tempFunFact);
    setIsEditingFunFact(false);
  };

  return (
    <div className="bg-amber-50 p-4 rounded-lg shadow-md border border-amber-100">
      <h2 className="text-xl font-bold text-center text-amber-900 mb-3">Fun Zone</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-amber-800 font-medium mb-1">Trip Motto:</h3>
          {isEditingMotto ? (
            <div className="flex space-x-2">
              <Input 
                value={tempMotto}
                onChange={(e) => setTempMotto(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveMotto} size="sm" variant="outline">Save</Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="italic text-amber-700">"{tripMotto}"</p>
              <Button 
                onClick={() => setIsEditingMotto(true)} 
                size="sm" 
                variant="ghost"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-amber-800 font-medium mb-1">Fun Fact about our Destination:</h3>
          {isEditingFunFact ? (
            <div className="flex space-x-2">
              <Input 
                value={tempFunFact}
                onChange={(e) => setTempFunFact(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveFunFact} size="sm" variant="outline">Save</Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-amber-700">{funFact}</p>
              <Button 
                onClick={() => setIsEditingFunFact(true)} 
                size="sm" 
                variant="ghost"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunZone;
