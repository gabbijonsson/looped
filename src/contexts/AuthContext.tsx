import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import supabase from "@/util/supabaseClient";
import { User } from "@/types/auth";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = currentUser !== null;

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
      // First, query the simpleuser table to get the email for the username
      const { data: simpleUsers, error: queryError } = await supabase
        .from("simpleuser")
        .select("userid, email")
        .eq("username", username)
        .limit(1);

      if (queryError) {
        console.error("Error querying simpleuser:", queryError);
        toast.error("Fel vid inloggning");
        return false;
      }

      if (!simpleUsers || simpleUsers.length === 0) {
        toast.error("Felaktigt användarnamn eller lösenord");
        return false;
      }

      const { email, userid } = simpleUsers[0];

      // Use Supabase authentication with the email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // Log the authentication response data for validation
      console.log("Supabase auth response data:", data);

      if (error) {
        console.error("Authentication error:", error);
        toast.error("Felaktigt användarnamn eller lösenord");
        return false;
      }

      if (!data.user) {
        toast.error("Inloggning misslyckades");
        return false;
      }

      // Create user object with the userid from simpleuser table
      const user: User = {
        id: userid, // Use the userid from simpleuser table for ingredient tracking
        username: username,
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

  const logout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    setCurrentUser(null);
    localStorage.removeItem("cabin-current-user");
    toast.info("Du har loggats ut");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, login, logout, loading }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
