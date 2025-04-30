
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md my-4 inline-block">
          Unauthorized Access
        </div>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
