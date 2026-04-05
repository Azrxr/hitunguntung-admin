"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { 
  LayoutDashboard, 
  Settings, 
  Megaphone, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  FileText
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ad-settings", label: "Ad Settings", icon: Settings },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admins", label: "Admins", icon: Users },
  { href: "/privacy-policy", label: "Privacy Policy", icon: FileText },
];

export function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicRoute = pathname === "/privacy-policy";
  if (isPublicRoute) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-card-border sticky top-0 z-40 bg-card-bg/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image src="/icon.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-[0_0_10px_rgba(255,215,0,0.2)]" />
          <span className="font-bold text-lg bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">HitungUntung</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-card-border/50 rounded-xl text-foreground"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-72 glass-panel border-r border-card-border flex flex-col
        transition-transform duration-300 ease-in-out bg-card-bg/95 backdrop-blur-xl
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 hidden md:flex items-center gap-4 border-b border-card-border/50">
          <Image src="/icon.png" alt="Logo" width={40} height={40} className="rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">HitungUntung</span>
        </div>

        {/* User Info (Mobile mostly, but also active on Desktop) */}
        <div className="p-6 border-b border-card-border/50 flex items-center gap-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-gold-500/30" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center font-bold border border-gold-500/30">
              {user?.displayName?.[0] || "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{user?.displayName || "Admin"}</p>
            <p className="text-xs text-foreground/50 truncate block">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group
                  ${isActive 
                    ? "bg-gold-500/10 text-gold-500 border border-gold-500/20 shadow-[0_4px_20px_rgba(229,179,0,0.1)]" 
                    : "text-foreground/70 hover:bg-card-border/50 hover:text-foreground"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-gold-500" : "text-foreground/50 group-hover:text-foreground"}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-gold-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-card-border/50">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-x-hidden p-6 md:p-10 w-full animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
