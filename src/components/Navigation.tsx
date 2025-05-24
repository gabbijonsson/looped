import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Users, Utensils, Calendar } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-amber-100 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
            CabinVibe Coordinator
          </h1>

          <nav className="flex space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className={`navigation-item ${activeSection === "home" ? "active" : ""}`}
              onClick={() => setActiveSection("home")}
            >
              <Home className="h-5 w-5" />
              {!isMobile && <span className="mt-1">Hem</span>}
            </Button>

            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className={`navigation-item ${activeSection === "food" ? "active" : ""}`}
              onClick={() => setActiveSection("food")}
            >
              <Utensils className="h-5 w-5" />
              {!isMobile && <span className="mt-1">Mat</span>}
            </Button>

            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className={`navigation-item ${activeSection === "info" ? "active" : ""}`}
              onClick={() => setActiveSection("info")}
            >
              <Users className="h-5 w-5" />
              {!isMobile && <span className="mt-1">Info</span>}
            </Button>

            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className={`navigation-item ${activeSection === "schedule" ? "active" : ""}`}
              onClick={() => setActiveSection("schedule")}
            >
              <Calendar className="h-5 w-5" />
              {!isMobile && <span className="mt-1">Planering</span>}
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
