import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, LayoutDashboard, HeartPulse, ShieldAlert, GitBranch } from 'lucide-react';

const Layout = () => {
  const navItems = [
    { label: 'Platform Overview', path: '/overview', icon: Activity },
    { label: 'Architecture', path: '/architecture', icon: GitBranch },
    { label: 'Patient Journey', path: '/journey', icon: HeartPulse },
    { label: 'Live Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Surveillance', path: '/surveillance', icon: ShieldAlert },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <img 
              src="/phone-logo.png" 
              alt="Ramba Voice Platform Phone" 
              className="w-10 h-10 object-contain rounded-full border-2 border-[var(--color-health)] bg-white p-1" 
            />
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">Ramba Voice</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Ramba Voice Platform</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="text-xs font-bold text-gray-500 mb-3 px-2 tracking-wider">MENU</div>
        <ul className="flex flex-col gap-1 list-none">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? 'bg-[rgba(45,212,191,0.15)] text-[#2dd4bf] border border-[rgba(45,212,191,0.2)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto px-2">
           <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'var(--color-health)', boxShadow: '0 0 8px var(--color-health)'}}></div>
                  <span className="text-xs text-white font-medium">Live in Rwanda</span>
                </div>
              </div>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
