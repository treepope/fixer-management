
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings, FileText, Import, Export, User } from "lucide-react";

interface AppSidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const { hasPermission } = useAuth();
  
  const handleLinkClick = () => {
    if (window.innerWidth < 992) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <Sidebar className="border-r" isExpanded={isMobileSidebarOpen}>
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary-orange flex items-center justify-center text-white font-bold">
            24
          </div>
          <span className="font-semibold text-lg">CARFIX</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-primary bg-primary/10" : ""
                }
                onClick={handleLinkClick}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/fixers"
                className={({ isActive }) =>
                  isActive ? "text-primary bg-primary/10" : ""
                }
                onClick={handleLinkClick}
              >
                <User />
                <span>Fixers</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/import-export"
                className={({ isActive }) =>
                  isActive ? "text-primary bg-primary/10" : ""
                }
                onClick={handleLinkClick}
              >
                <FileText />
                <span>Import/Export</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {hasPermission("admin") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive ? "text-primary bg-primary/10" : ""
                  }
                  onClick={handleLinkClick}
                >
                  <Users />
                  <span>Users</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-1.5 rounded-md ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`
            }
            onClick={handleLinkClick}
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </NavLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
