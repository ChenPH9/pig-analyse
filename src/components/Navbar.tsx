import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, PiggyBank } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '仪表板', icon: TrendingUp },
    { path: '/reports', label: '财报数据', icon: BarChart3 },
    { path: '/sow', label: '母猪存栏', icon: PiggyBank },
  ];

  return (
    <nav className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center glow">
              <PiggyBank className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              牧原财报分析
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
