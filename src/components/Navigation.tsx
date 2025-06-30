import React from 'react';
import { BookOpen, Compass, Star, Heart, Database } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => {
  return (
    <div className={`relative group p-3 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${active ? 'bg-indigo-800/50' : 'hover:bg-indigo-800/30'}`}>
      <div className={`${active ? 'text-amber-300' : 'text-indigo-300 group-hover:text-white'} transition-colors duration-300`}>
        {icon}
      </div>
      <span className="mt-1 text-xs font-medium text-indigo-200 opacity-80">{label}</span>
      
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-300 rounded-r-full"></div>
      )}
    </div>
  );
};

const Navigation: React.FC = () => {
  return (
    <nav className="flex flex-row lg:flex-col justify-center lg:justify-start gap-2">
      <NavItem icon={<BookOpen size={20} />} label="Journal" active />
      <NavItem icon={<Star size={20} />} label="Rituals" />
      <NavItem icon={<Compass size={20} />} label="Vision" />
      <NavItem icon={<Database size={20} />} label="Vault" />
      <NavItem icon={<Heart size={20} />} label="Growth" />
    </nav>
  );
};

export default Navigation;