
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface LinenChoice {
  name: string;
  choice: "bringing" | "rent";
  quantity: number;
}

interface CabinInformationProps {
  parkingInfo: string;
  amenitiesInfo: string;
  activitiesInfo: { name: string; url: string }[];
}

const CabinInformation = ({ 
  parkingInfo, 
  amenitiesInfo, 
  activitiesInfo 
}: CabinInformationProps) => {
  const [isParkingEditing, setIsParkingEditing] = useState(false);
  const [isAmenitiesEditing, setIsAmenitiesEditing] = useState(false);
  const [editedParking, setEditedParking] = useState(parkingInfo);
  const [editedAmenities, setEditedAmenities] = useState(amenitiesInfo);
  
  const [activities, setActivities] = useState(activitiesInfo);
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityUrl, setNewActivityUrl] = useState("");
  
  const [familyName, setFamilyName] = useState("");
  const [linenChoices, setLinenChoices] = useState<LinenChoice[]>([]);
  const [newFamily, setNewFamily] = useState({
    name: "",
    choice: "bringing" as "bringing" | "rent",
    quantity: 1
  });

  const saveParkingInfo = () => {
    setIsParkingEditing(false);
    toast.success("Parking information updated!");
  };

  const saveAmenitiesInfo = () => {
    setIsAmenitiesEditing(false);
    toast.success("Amenities information updated!");
  };

  const addActivity = () => {
    if (!newActivityName.trim() || !newActivityUrl.trim()) {
      toast.error("Please enter both a name and URL for the activity");
      return;
    }
    
    setActivities([
      ...activities,
      { name: newActivityName, url: newActivityUrl }
    ]);
    
    setNewActivityName("");
    setNewActivityUrl("");
    toast.success("Activity added!");
  };

  const addLinenChoice = () => {
    if (!newFamily.name.trim()) {
      toast.error("Please enter a family name");
      return;
    }
    
    setLinenChoices([...linenChoices, { ...newFamily }]);
    setNewFamily({
      name: "",
      choice: "bringing",
      quantity: 1
    });
    
    toast.success("Linen choice added!");
  };

  const totalRentals = linenChoices.reduce((total, family) => {
    if (family.choice === "rent") {
      return total + family.quantity;
    }
    return total;
  }, 0);
  
  const totalCost = totalRentals * 200;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-amber-100">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Cabin Information</h2>
        
        <div className="cabin-info-section">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-amber-800">Parking</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsParkingEditing(!isParkingEditing)}
            >
              {isParkingEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
          
          {isParkingEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedParking}
                onChange={(e) => setEditedParking(e.target.value)}
                className="form-input"
                rows={3}
              />
              <Button onClick={saveParkingInfo}>Save</Button>
            </div>
          ) : (
            <p className="text-amber-700">{editedParking}</p>
          )}
        </div>
        
        <div className="cabin-info-section">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-amber-800">Cabin Utilities & Amenities</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAmenitiesEditing(!isAmenitiesEditing)}
            >
              {isAmenitiesEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
          
          {isAmenitiesEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedAmenities}
                onChange={(e) => setEditedAmenities(e.target.value)}
                className="form-input"
                rows={4}
              />
              <Button onClick={saveAmenitiesInfo}>Save</Button>
            </div>
          ) : (
            <p className="text-amber-700 whitespace-pre-line">{editedAmenities}</p>
          )}
        </div>
        
        <div className="cabin-info-section">
          <h3 className="text-lg font-bold text-amber-800 mb-2">Local Activities/Links</h3>
          
          <div className="space-y-2 mb-4">
            {activities.map((activity, index) => (
              <div key={index} className="border-b border-amber-100 pb-2">
                <a 
                  href={activity.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  {activity.name}
                </a>
              </div>
            ))}
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md">
            <h4 className="font-medium text-amber-800 mb-2">Add New Activity</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input 
                placeholder="Activity name"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                className="form-input"
              />
              <Input 
                placeholder="URL"
                value={newActivityUrl}
                onChange={(e) => setNewActivityUrl(e.target.value)}
                className="form-input"
              />
            </div>
            <Button onClick={addActivity} className="mt-2">Add Activity</Button>
          </div>
        </div>
        
        <div className="cabin-info-section">
          <h3 className="text-lg font-bold text-amber-800 mb-1">Bed Linen & Towels</h3>
          <p className="text-amber-700 mb-4">You can bring your own bed linen and towels, or rent a set for 200 SEK per person for the entire stay.</p>
          
          <div className="bg-amber-50 p-4 rounded-md mb-4">
            <h4 className="font-medium text-amber-800 mb-3">Sign Up</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="family-name">Family/Person Name</Label>
                <Input 
                  id="family-name"
                  placeholder="Enter your name or family name"
                  value={newFamily.name}
                  onChange={(e) => setNewFamily({...newFamily, name: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div>
                <Label>Linen Choice</Label>
                <RadioGroup 
                  value={newFamily.choice}
                  onValueChange={(value) => setNewFamily({...newFamily, choice: value as "bringing" | "rent"})}
                  className="flex flex-col space-y-1 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bringing" id="bringing" />
                    <Label htmlFor="bringing">Bringing my own</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent">Rent (200 SEK per person)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {newFamily.choice === "rent" && (
                <div>
                  <Label htmlFor="quantity">Number of people</Label>
                  <Input 
                    id="quantity"
                    type="number"
                    min={1}
                    value={newFamily.quantity}
                    onChange={(e) => setNewFamily({...newFamily, quantity: parseInt(e.target.value) || 1})}
                    className="form-input w-24"
                  />
                </div>
              )}
              
              <Button onClick={addLinenChoice}>Add to List</Button>
            </div>
          </div>
          
          {linenChoices.length > 0 && (
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Current Sign-ups</h4>
              <div className="bg-white rounded-md border border-amber-100">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-amber-100">
                      <th className="text-left p-2 text-amber-800">Name</th>
                      <th className="text-left p-2 text-amber-800">Choice</th>
                      <th className="text-right p-2 text-amber-800">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linenChoices.map((family, index) => (
                      <tr key={index} className="border-b border-amber-100">
                        <td className="p-2 text-amber-700">{family.name}</td>
                        <td className="p-2 text-amber-700">
                          {family.choice === "bringing" ? "Bringing own" : `Renting (${family.quantity} ${family.quantity === 1 ? 'person' : 'people'})`}
                        </td>
                        <td className="p-2 text-right text-amber-700">
                          {family.choice === "rent" ? `${family.quantity * 200} SEK` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-amber-100 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>Total rentals needed:</span>
                  <span>{totalRentals} sets</span>
                </div>
                <div className="flex justify-between font-bold text-amber-900">
                  <span>Total cost:</span>
                  <span>{totalCost} SEK</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabinInformation;
