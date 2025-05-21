
import { useState } from "react";
import Navigation from "@/components/Navigation";
import CountdownTimer from "@/components/CountdownTimer";
import ParticipantShowcase from "@/components/ParticipantShowcase";
import ImageToggle from "@/components/ImageToggle";
import FoodCoordination from "@/components/FoodCoordination";
import CabinInformation from "@/components/CabinInformation";
import TripSchedule from "@/components/TripSchedule";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Placeholder data - these would be fetched from an API or database in a real app
  const tripStartDate = new Date("May 28, 2025");
  
  const primaryImageUrl = "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb";
  const thumbnailImageUrl = "https://images.unsplash.com/photo-1501854140801-50d01698950b";
  
  const cabinAmenities = "WiFi available (password in kitchen drawer)\nDishwasher and full kitchen\nBBQ grill on back deck\n4 bedrooms (2 queen, 4 twin beds)\nFireplace in living room\nHot tub on deck";
  
  const parkingInfo = "2 spots available directly at the cabin. Overflow parking available on Pine Street, about 200 meters from the cabin. Please carppool when possible!";
  
  const localActivities = [
    { name: "Cedar Lake Hiking Trail (2.5 miles from cabin)", url: "#" },
    { name: "Pine Mountain Brewery", url: "#" },
    { name: "Mountain Town Grocery Store", url: "#" },
  ];

  // Dinner reservation details
  const dinnerReservation = {
    date: "May 30th",
    time: "17:00",
    restaurantName: "Mountain View Restaurant",
    menuLink: "#"
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">Our Epic Cabin Adventure!</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ImageToggle 
                    primaryImageUrl={primaryImageUrl} 
                    thumbnailImageUrl={thumbnailImageUrl} 
                  />
                </div>
                
                <div className="space-y-8">
                  <CountdownTimer targetDate={tripStartDate} />
                  <ParticipantShowcase 
                    households={5} 
                    adults={8} 
                    teens={1} 
                    children={1} 
                    pets={1} 
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case "food":
        return <FoodCoordination />;
        
      case "info":
        return (
          <CabinInformation 
            parkingInfo={parkingInfo}
            amenitiesInfo={cabinAmenities}
            activitiesInfo={localActivities}
          />
        );
        
      case "schedule":
        return (
          <TripSchedule 
            checkInDate="May 28th, 15:00" 
            checkOutDate="June 1st, 11:00" 
            dinnerReservation={dinnerReservation}
          />
        );
        
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Index;
