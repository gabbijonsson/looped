
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

interface ArrivalInfo {
  id: string;
  familyName: string;
  eta: string;
  transport: string;
  notes: string;
}

interface TripScheduleProps {
  checkInDate: string;
  checkOutDate: string;
  dinnerReservation: {
    date: string;
    time: string;
    restaurantName: string;
    menuLink: string;
  };
}

const TripSchedule = ({
  checkInDate,
  checkOutDate,
  dinnerReservation
}: TripScheduleProps) => {
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [newArrival, setNewArrival] = useState<ArrivalInfo>({
    id: Date.now().toString(),
    familyName: '',
    eta: '',
    transport: '',
    notes: ''
  });

  const handleAddArrival = () => {
    if (!newArrival.familyName || !newArrival.eta || !newArrival.transport) {
      toast.error("Please fill in all required fields");
      return;
    }

    setArrivalInfo([...arrivalInfo, { ...newArrival }]);
    setNewArrival({
      id: Date.now().toString(),
      familyName: '',
      eta: '',
      transport: '',
      notes: ''
    });

    toast.success("Arrival information added!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-amber-100">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Trip Schedule & Logistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="font-bold text-lg text-amber-800 mb-2">Cabin Access</h3>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800 font-bold">IN</span>
              </div>
              <div>
                <p className="text-sm text-amber-600">Check-in</p>
                <p className="font-medium text-amber-900">{checkInDate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="font-bold text-lg text-amber-800 mb-2">Cabin Departure</h3>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800 font-bold">OUT</span>
              </div>
              <div>
                <p className="text-sm text-amber-600">Check-out</p>
                <p className="font-medium text-amber-900">{checkOutDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg text-amber-800 mb-3">Dinner Reservation</h3>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-3 md:mb-0">
                <p className="font-medium text-amber-800">Group Dinner Reservation:</p>
                <p className="text-amber-700">{dinnerReservation.date}, {dinnerReservation.time} at {dinnerReservation.restaurantName}</p>
              </div>
              <a 
                href={dinnerReservation.menuLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline hover:text-amber-900"
              >
                View Menu
              </a>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-amber-800">Arrival Coordination</h3>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-4">
            <h4 className="font-medium text-amber-800 mb-3">Add Your Arrival Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="family-name">Family Name *</Label>
                <Input
                  id="family-name"
                  value={newArrival.familyName}
                  onChange={(e) => setNewArrival({...newArrival, familyName: e.target.value})}
                  placeholder="e.g., Smith Family"
                  className="form-input"
                />
              </div>
              
              <div>
                <Label htmlFor="eta">Estimated Arrival Time *</Label>
                <Input
                  id="eta"
                  value={newArrival.eta}
                  onChange={(e) => setNewArrival({...newArrival, eta: e.target.value})}
                  placeholder="e.g., May 28th, 16:00"
                  className="form-input"
                />
              </div>
              
              <div>
                <Label htmlFor="transport">Mode of Transportation *</Label>
                <Input
                  id="transport"
                  value={newArrival.transport}
                  onChange={(e) => setNewArrival({...newArrival, transport: e.target.value})}
                  placeholder="e.g., Car, Train, etc."
                  className="form-input"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Input
                  id="notes"
                  value={newArrival.notes}
                  onChange={(e) => setNewArrival({...newArrival, notes: e.target.value})}
                  placeholder="e.g., Stopping for lunch on the way"
                  className="form-input"
                />
              </div>
            </div>
            
            <Button onClick={handleAddArrival} className="mt-4">
              Add Arrival Info
            </Button>
          </div>
          
          {arrivalInfo.length > 0 ? (
            <div className="bg-white rounded-lg border border-amber-100 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-amber-800">Family</th>
                    <th className="px-4 py-2 text-left text-amber-800">ETA</th>
                    <th className="px-4 py-2 text-left text-amber-800">Transportation</th>
                    <th className="px-4 py-2 text-left text-amber-800">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {arrivalInfo.map((info, index) => (
                    <tr key={info.id} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-amber-800">{info.familyName}</td>
                      <td className="px-4 py-3 text-amber-700">{info.eta}</td>
                      <td className="px-4 py-3 text-amber-700">{info.transport}</td>
                      <td className="px-4 py-3 text-amber-700">{info.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-amber-500 italic">No arrivals scheduled yet</p>
          )}
        </div>
        
        <div>
          <h3 className="font-bold text-lg text-amber-800 mb-3">General Itinerary</h3>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <p className="italic text-amber-700 mb-3">Optional timeline for planned group activities</p>
            
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-amber-300">
                <div className="absolute w-4 h-4 bg-amber-400 rounded-full -left-[9px] top-1"></div>
                <p className="font-medium text-amber-800">May 28th</p>
                <p className="text-amber-700">Arrival day - Get settled, explore the cabin</p>
              </div>
              
              <div className="relative pl-6 border-l-2 border-amber-300">
                <div className="absolute w-4 h-4 bg-amber-400 rounded-full -left-[9px] top-1"></div>
                <p className="font-medium text-amber-800">May 29th</p>
                <p className="text-amber-700">Hiking day - Trail maps in the cabin</p>
              </div>
              
              <div className="relative pl-6 border-l-2 border-amber-300">
                <div className="absolute w-4 h-4 bg-amber-400 rounded-full -left-[9px] top-1"></div>
                <p className="font-medium text-amber-800">May 30th</p>
                <p className="text-amber-700">Group dinner at restaurant</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-amber-400 rounded-full -left-[9px] top-1"></div>
                <p className="font-medium text-amber-800">May 31st</p>
                <p className="text-amber-700">Free day - relaxation at the cabin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSchedule;
