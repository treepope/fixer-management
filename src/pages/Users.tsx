
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { users } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";

const userRoleBadgeVariants: Record<UserRole, { color: string; label: string }> = {
  super_admin: { color: "bg-purple-500", label: "Super Admin" },
  admin: { color: "bg-blue-500", label: "Admin" },
  viewer: { color: "bg-green-500", label: "Viewer" },
};

const Users = () => {
  const { currentUser, hasPermission } = useAuth();
  const { toast } = useToast();

  const [usersList, setUsersList] = useState<User[]>(users);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "viewer" as UserRole,
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    name: "",
  });

  const handleAddUser = () => {
    // Validate form
    const errors = {
      email: "",
      name: "",
    };

    let hasError = false;

    if (!newUser.email) {
      errors.email = "Email is required";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Invalid email format";
      hasError = true;
    } else if (usersList.some((user) => user.email === newUser.email)) {
      errors.email = "Email already in use";
      hasError = true;
    }

    if (!newUser.name) {
      errors.name = "Name is required";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    // Add new user
    const now = new Date().toISOString();
    const newId = `u${usersList.length + 1}`;
    
    setUsersList([
      ...usersList,
      {
        id: newId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        created_at: now,
      },
    ]);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${userRoleBadgeVariants[newUser.role].label}.`,
    });
    
    // Reset form
    setNewUser({
      email: "",
      name: "",
      role: "viewer",
    });
    setFormErrors({
      email: "",
      name: "",
    });
    setShowAddForm(false);
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    // Prevent changing your own role
    if (userId === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Operation Not Allowed",
        description: "You cannot change your own role.",
      });
      return;
    }
    
    setUsersList(
      usersList.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    
    const updatedUser = usersList.find((user) => user.id === userId);
    
    if (updatedUser) {
      toast({
        title: "Role Updated",
        description: `${updatedUser.name}'s role has been updated to ${userRoleBadgeVariants[newRole].label}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
        
        {hasPermission("super_admin") && (
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "default"}
          >
            {showAddForm ? "Cancel" : "Add User"}
          </Button>
        )}
      </div>
      
      {showAddForm && hasPermission("super_admin") && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => {
                      setNewUser({ ...newUser, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: "" });
                      }
                    }}
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => {
                      setNewUser({ ...newUser, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: "" });
                      }
                    }}
                    className={formErrors.email ? "border-destructive" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-destructive">{formErrors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {newUser.role === "super_admin" && "Can manage users and perform all actions"}
                  {newUser.role === "admin" && "Can manage technicians and data but not users"}
                  {newUser.role === "viewer" && "Read-only access to data"}
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              {hasPermission("super_admin") && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersList.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    className={`${userRoleBadgeVariants[user.role].color} text-white`}
                  >
                    {userRoleBadgeVariants[user.role].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.last_login
                    ? new Date(user.last_login).toLocaleDateString()
                    : "Never"}
                </TableCell>
                {hasPermission("super_admin") && (
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: UserRole) =>
                        handleChangeRole(user.id, value)
                      }
                      disabled={user.id === currentUser?.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Change Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
