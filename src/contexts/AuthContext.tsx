import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import supabase from "@/util/supabaseClient";
import { User } from "@/types/auth";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  isAdmin: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.isAdmin || false;

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      const savedUser = localStorage.getItem("cabin-current-user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("cabin-current-user");
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data: users, error } = await supabase
        .from("auth")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .limit(1);

      if (error) {
        console.error("Login error:", error);
        toast.error("Fel vid inloggning");
        return false;
      }

      if (!users || users.length === 0) {
        toast.error("Felaktigt användarnamn eller lösenord");
        return false;
      }

      const authUser = users[0];
      const user: User = {
        username: authUser.username,
        isAdmin: authUser.is_admin,
      };

      setCurrentUser(user);
      localStorage.setItem("cabin-current-user", JSON.stringify(user));
      toast.success(`Välkommen tillbaka, ${username}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Fel vid inloggning");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cabin-current-user");
    toast.info("Du har loggats ut");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
