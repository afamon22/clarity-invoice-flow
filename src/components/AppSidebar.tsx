
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  UserPlus,
  BarChart3,
  Palette,
  LogOut,
  Globe,
  Scale,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Domaines",
    url: "/domaines",
    icon: Globe,
  },
  {
    title: "Loi 25",
    url: "/loi25",
    icon: Scale,
  },
  {
    title: "Factures",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Rappels",
    url: "/reminders",
    icon: Bell,
  },
  {
    title: "Analyses",
    url: "/analytics",
    icon: BarChart3,
  },
];

const settingsItems = [
  {
    title: "Équipe & Rôles",
    url: "/team",
    icon: UserPlus,
  },
  {
    title: "Branding",
    url: "/branding",
    icon: Palette,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut, userRole, user } = useAuth();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">GroupeObv</h2>
            <p className="text-sm text-gray-500">Gestion domaines</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="w-full justify-start space-x-3 py-3 px-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Link 
                      to={item.url}
                      className={`flex items-center ${
                        location.pathname === item.url 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="w-full justify-start space-x-3 py-3 px-3 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Link 
                      to={item.url}
                      className={`flex items-center ${
                        location.pathname === item.url 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/api/placeholder/40/40" />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
              {userRole === 'admin' ? 'AD' : 'US'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userRole === 'admin' ? 'Administrateur' : user?.email || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userRole === 'admin' ? 'Admin - GroupeObv' : 'Utilisateur standard'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
