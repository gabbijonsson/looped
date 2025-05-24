import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import CountdownTimer from "@/components/CountdownTimer";
import ParticipantShowcase from "@/components/ParticipantShowcase";
import ImageToggle from "@/components/ImageToggle";
import FoodCoordination from "@/components/FoodCoordination";
import CabinInformation from "@/components/CabinInformation";
import TripSchedule from "@/components/TripSchedule";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { isAuthenticated } = useAuth();

  // Placeholder data - these would be fetched from an API or database in a real app

  const parkingInfo =
    "2 spots available directly at the cabin. Overflow parking available on Pine Street, about 200 meters from the cabin. Please carppool when possible!";

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
    menuLink: "#",
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8 flex flex-col justify-between">
                <ImageToggle />
                <CountdownTimer />
              </div>

              {/* Right Column */}
              <div>
                <ParticipantShowcase />
              </div>
            </div>
          </div>
        );

      case "food":
        return (
          <ProtectedRoute>
            <FoodCoordination />
          </ProtectedRoute>
        );

      case "info":
        return (
          <ProtectedRoute>
            <CabinInformation
              parkingInfo={parkingInfo}
              activitiesInfo={localActivities}
            />
          </ProtectedRoute>
        );

      case "schedule":
        return (
          <ProtectedRoute>
            <TripSchedule />
          </ProtectedRoute>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0]">
      <NavigationBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">{renderActiveSection()}</div>
    </div>
  );
};

export default Index;
