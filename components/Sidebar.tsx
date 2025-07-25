
import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const AnalyticsLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M4 25V7C4 6.44772 4.44772 6 5 6H27C27.5523 6 28 6.44772 28 7V25C28 25.5523 27.5523 26 27 26H5C4.44772 26 4 25.5523 4 25Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 20L15 15L18 18L23 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 17V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 19V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
    </svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
    </svg>
);

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full rounded-lg px-4 py-3 text-left transition-colors duration-200 relative ${
      isActive
        ? 'bg-primary/20 text-primary font-semibold'
        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full"></div>}
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex flex-col w-64 bg-surface/30 backdrop-blur-lg border-r border-border-default shrink-0">
      <div className="flex items-center space-x-3 justify-start h-20 px-6 border-b border-border-default">
        <AnalyticsLogo />
        <h1 className="text-xl font-bold text-text-primary">Analytics</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavItem
          icon={<ChartBarIcon />}
          label="Latam Reserve"
          isActive={activeView === 'latam_reserve'}
          onClick={() => setActiveView('latam_reserve')}
        />
        <NavItem
          icon={<GlobeIcon />}
          label="Country Wise GP"
          isActive={activeView === 'country_gp'}
          onClick={() => setActiveView('country_gp')}
        />
      </nav>
    </div>
  );
};

export default Sidebar;