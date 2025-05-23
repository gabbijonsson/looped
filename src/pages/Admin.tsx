import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-[#867e74]">Laddar...</div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#f9f5f0] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#4a3c31] mb-8">
          Admin Dashboard
        </h1>

        <Card className="border-[#e8e8d5] bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-[#4a3c31]">Användarhantering</CardTitle>
            <CardDescription className="text-[#867e74]">
              Hantera användarkonton för stugresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#f0e6e4] p-4 rounded-lg border border-[#e8e8d5]">
              <h3 className="font-semibold text-[#4a3c31] mb-2">
                Databashantering
              </h3>
              <p className="text-[#867e74] mb-2">
                Användarkonton skapas nu direkt i Supabase databasen i 'auth'
                tabellen.
              </p>
              <p className="text-[#867e74] text-sm">
                Kontakta administratören för att skapa nya konton eller ändra
                lösenord.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e8e8d5] bg-white">
          <CardHeader>
            <CardTitle className="text-[#4a3c31]">Systemöversikt</CardTitle>
            <CardDescription className="text-[#867e74]">
              Information om systemet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#f0e6e4]">
                <span className="text-[#4a3c31] font-medium">
                  Autentisering
                </span>
                <span className="text-[#867e74]">Supabase Database</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#f0e6e4]">
                <span className="text-[#4a3c31] font-medium">
                  Användarregistrering
                </span>
                <span className="text-[#867e74]">Endast admin</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[#4a3c31] font-medium">
                  Lösenordsändringar
                </span>
                <span className="text-[#867e74]">Endast admin</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
