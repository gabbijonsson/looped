
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface NavigationBarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NavigationBar = ({ activeSection, setActiveSection }: NavigationBarProps) => {
  const { currentUser, isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-[#f0e6e4] border-b border-[#d1cdc3] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#4a3c31]">CabinVibe</h1>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => setActiveSection('home')}
              className={`navigation-item ${activeSection === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveSection('food')}
                  className={`navigation-item ${activeSection === 'food' ? 'active' : ''}`}
                >
                  Food
                </button>
                
                <button
                  onClick={() => setActiveSection('info')}
                  className={`navigation-item ${activeSection === 'info' ? 'active' : ''}`}
                >
                  Info
                </button>
                
                <button
                  onClick={() => setActiveSection('schedule')}
                  className={`navigation-item ${activeSection === 'schedule' ? 'active' : ''}`}
                >
                  Schedule
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="text-[#4a3c31] hidden md:block mr-4">
                  <span className="font-medium">{currentUser?.username}</span>
                  {isAdmin && <span className="ml-2 px-2 py-0.5 text-xs bg-[#947b5f] text-white rounded-full">Admin</span>}
                </div>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center justify-center w-10 h-10 rounded-full text-[#4a3c31] hover:bg-[#e8e8d5]"
                    title="Admin Settings"
                  >
                    <Settings size={20} />
                  </Link>
                )}
                
                <button 
                  onClick={logout}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-[#4a3c31] hover:bg-[#e8e8d5]"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
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
            onClick={() => setActiveSection('home')}
            className={`flex flex-col items-center py-2 ${activeSection === 'home' ? 'text-[#947b5f]' : 'text-[#4a3c31]'}`}
          >
            <span className="text-xs">Home</span>
          </button>
          
          {isAuthenticated && (
            <>
              <button
                onClick={() => setActiveSection('food')}
                className={`flex flex-col items-center py-2 ${activeSection === 'food' ? 'text-[#947b5f]' : 'text-[#4a3c31]'}`}
              >
                <span className="text-xs">Food</span>
              </button>
              
              <button
                onClick={() => setActiveSection('info')}
                className={`flex flex-col items-center py-2 ${activeSection === 'info' ? 'text-[#947b5f]' : 'text-[#4a3c31]'}`}
              >
                <span className="text-xs">Info</span>
              </button>
              
              <button
                onClick={() => setActiveSection('schedule')}
                className={`flex flex-col items-center py-2 ${activeSection === 'schedule' ? 'text-[#947b5f]' : 'text-[#4a3c31]'}`}
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
