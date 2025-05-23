import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading while checking existing session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5f0]">
        <div className="text-[#867e74]">Laddar...</div>
      </div>
    );
  }

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f0]">
      <Card className="w-full max-w-md border-[#e8e8d5] bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#4a3c31]">
            Looped
          </CardTitle>
          <CardDescription className="text-center text-[#867e74]">
            Ange dina inloggningsuppgifter för att komma vidare
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#4a3c31]">
                Användarnamn
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ange ditt användarnamn"
                required
                disabled={isLoggingIn}
                className="border-[#d1cdc3] focus:border-[#947b5f] focus:ring-[#947b5f]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#4a3c31]">
                Lösenord
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ange ditt lösenord"
                required
                disabled={isLoggingIn}
                className="border-[#d1cdc3] focus:border-[#947b5f] focus:ring-[#947b5f]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#947b5f] hover:bg-[#7f6a52] text-white disabled:opacity-50"
            >
              {isLoggingIn ? "Loggar in..." : "Logga in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
