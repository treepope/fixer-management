
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const loginPresets = [
    { role: "Super Admin", email: "super@24carfix.com", password: "password" },
    { role: "Admin", email: "admin@24carfix.com", password: "password" },
    { role: "Viewer", email: "viewer@24carfix.com", password: "password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-md bg-primary-orange flex items-center justify-center text-white font-bold text-xl mr-3">
            24
          </div>
          <h1 className="text-3xl font-bold">CARFIX</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Log in to access the 24CARFIX admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="email@24carfix.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
              
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-2 text-center">Demo Accounts:</p>
                <div className="grid grid-cols-3 gap-2">
                  {loginPresets.map((preset) => (
                    <Button
                      key={preset.role}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail(preset.email);
                        setPassword(preset.password);
                      }}
                    >
                      {preset.role}
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
