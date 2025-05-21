
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { isAuthenticated, isAdmin, addUser } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isNewUserAdmin, setIsNewUserAdmin] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (addUser(newUsername, newPassword, isNewUserAdmin)) {
      // Reset form on success
      setNewUsername('');
      setNewPassword('');
      setIsNewUserAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#4a3c31] mb-8">Admin Dashboard</h1>
        
        <Card className="border-[#e8e8d5] bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-[#4a3c31]">Add New User</CardTitle>
            <CardDescription className="text-[#867e74]">
              Create accounts for cabin trip participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-username" className="text-[#4a3c31]">Username</Label>
                <Input
                  id="new-username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="border-[#d1cdc3]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[#4a3c31]">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="border-[#d1cdc3]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin-role"
                  checked={isNewUserAdmin}
                  onCheckedChange={() => setIsNewUserAdmin(!isNewUserAdmin)}
                  className="data-[state=checked]:bg-[#947b5f] data-[state=checked]:border-[#947b5f]"
                />
                <Label htmlFor="admin-role" className="text-[#4a3c31]">
                  Grant admin privileges
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="bg-[#947b5f] hover:bg-[#7f6a52] text-white"
              >
                Add User
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* We could add user management here in the future */}
        <Card className="border-[#e8e8d5] bg-white">
          <CardHeader>
            <CardTitle className="text-[#4a3c31]">User Management</CardTitle>
            <CardDescription className="text-[#867e74]">
              Manage existing user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#867e74] italic">
              User management features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
