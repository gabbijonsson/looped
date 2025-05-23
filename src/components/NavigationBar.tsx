import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface NavigationBarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NavigationBar = ({
  activeSection,
  setActiveSection,
}: NavigationBarProps) => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-[#f0e6e4] border-b border-[#d1cdc3] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#4a3c31]">Looped</h1>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => setActiveSection("home")}
              className={`px-3 py-2 text-sm focus:outline-none tracking-wider ${
                activeSection === "home"
                  ? "font-bold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                  : "font-medium text-[#947b5f] hover:text-[#4a3c31]"
              }`}
            >
              Hem
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveSection("food")}
                  className={`px-3 py-2 text-sm focus:outline-none tracking-wider ${
                    activeSection === "food"
                      ? "font-bold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                      : "font-medium text-[#947b5f] hover:text-[#4a3c31]"
                  }`}
                >
                  Mat
                </button>

                <button
                  onClick={() => setActiveSection("info")}
                  className={`px-3 py-2 text-sm focus:outline-none tracking-wider ${
                    activeSection === "info"
                      ? "font-bold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                      : "font-medium text-[#947b5f] hover:text-[#4a3c31]"
                  }`}
                >
                  Information
                </button>

                <button
                  onClick={() => setActiveSection("schedule")}
                  className={`px-3 py-2 text-sm focus:outline-none tracking-wider ${
                    activeSection === "schedule"
                      ? "font-bold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                      : "font-medium text-[#947b5f] hover:text-[#4a3c31]"
                  }`}
                >
                  Planering
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center">
                                                <div className="text-[#4a3c31] hidden md:block mr-4">                  <span className="font-medium">{currentUser?.username}</span>                </div>                <button                  onClick={() => logout()}                  className="flex items-center justify-center w-10 h-10 rounded-full text-[#4a3c31] hover:bg-[#e8e8d5]"                  title="Logout"                >                  <LogOut size={20} />                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-10 h-10 rounded-full text-[#4a3c31] hover:bg-[#e8e8d5]"
                title="Login"
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-[#d1cdc3]">
        <div className="grid grid-cols-4 px-2 py-2">
          <button
            onClick={() => setActiveSection("home")}
            className={`flex flex-col items-center py-2 w-full tracking-wider ${
              activeSection === "home"
                ? "font-semibold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                : "text-[#947b5f]"
            }`}
          >
            <span className="text-xs">Home</span>
          </button>

          {isAuthenticated && (
            <>
              <button
                onClick={() => setActiveSection("food")}
                className={`flex flex-col items-center py-2 w-full tracking-wider ${
                  activeSection === "food"
                    ? "font-semibold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                    : "text-[#947b5f]"
                }`}
              >
                <span className="text-xs">Food</span>
              </button>

              <button
                onClick={() => setActiveSection("info")}
                className={`flex flex-col items-center py-2 w-full tracking-wider ${
                  activeSection === "info"
                    ? "font-semibold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                    : "text-[#947b5f]"
                }`}
              >
                <span className="text-xs">Info</span>
              </button>

              <button
                onClick={() => setActiveSection("schedule")}
                className={`flex flex-col items-center py-2 w-full tracking-wider ${
                  activeSection === "schedule"
                    ? "font-semibold text-[#4a3c31] border-b-2 border-[#4a3c31]"
                    : "text-[#947b5f]"
                }`}
              >
                <span className="text-xs">Schedule</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
