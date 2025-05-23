
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RewardsCatalog from './components/RewardsCatalog';
import ActivityLog from './components/ActivityLog';
import Navbar from './components/Navbar';
import { useLoyalty } from './hooks/useLoyalty';
// import ActionCenter from './components/ActionCenter'; // Removed ActionCenter
import AdminPortal from './components/admin/AdminPortal';
import DigitalCardPage from './components/DigitalCardPage';
import UserProfilePage from './components/UserProfilePage';
import { StarIcon, GiftIcon, ListIcon, LogoutIcon, LoginIcon as DashboardIcon, CogIcon, UserCircleIcon, QrCodeIcon } from './components/icons/Icons';

type ActiveTab = 'dashboard' | 'rewards' | 'activity' | 'digitalCard' | 'profile' | 'admin';

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { currentTier } = useLoyalty();

  const initialTab: ActiveTab = currentUser?.isAdmin ? 'admin' : 'dashboard';
  const [activeTab, setActiveTab] = React.useState<ActiveTab>(initialTab);

  React.useEffect(() => {
    if (currentUser?.isAdmin) {
      setActiveTab('admin');
    } else if (activeTab === 'admin' && !currentUser?.isAdmin) { 
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark to-secondary-dark flex items-center justify-center p-4">
        <Login />
      </div>
    );
  }

  const allNavItems: { id: ActiveTab; label: string; icon: React.FC<any>; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'rewards', label: 'Rewards', icon: GiftIcon },
    { id: 'activity', label: 'Activity', icon: ListIcon },
    { id: 'digitalCard', label: 'Digital Card', icon: QrCodeIcon },
    { id: 'profile', label: 'My Profile', icon: UserCircleIcon },
    { id: 'admin', label: 'Admin Portal', icon: CogIcon, adminOnly: true },
  ];

  const visibleNavItems = currentUser.isAdmin 
    ? allNavItems.filter(item => item.id === 'admin')
    : allNavItems.filter(item => !item.adminOnly);

  const UserAvatar: React.FC<{ user: typeof currentUser, sizeClass?: string }> = ({ user, sizeClass = "w-12 h-12" }) => {
    if (user.profileImageUrl) {
      return <img src={user.profileImageUrl} alt={user.name} className={`${sizeClass} rounded-full object-cover shadow-md`} />;
    }
    return (
      <div className={`${sizeClass} rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg shadow-md`}>
        {user.name.substring(0, 1).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 flex flex-col">
      <Navbar />
      
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <UserAvatar user={currentUser} sizeClass="w-10 h-10 sm:w-12 sm:h-12" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary-dark">Welcome, {currentUser.name}!</h1>
                {!currentUser.isAdmin && (
                  <p className="text-sm text-neutral-600">
                    Your current tier: 
                    <span className="ml-1 font-semibold text-secondary-dark bg-secondary-light/20 px-2 py-0.5 rounded-md">
                      {currentTier.icon && React.cloneElement(currentTier.icon, { className: "w-4 h-4 inline mr-1"})}
                      {currentTier.name}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
                {!currentUser.isAdmin && (
                  <div className="flex items-center text-md sm:text-lg font-semibold text-accent bg-amber-500/10 px-3 py-1.5 rounded-lg">
                      <StarIcon className="w-5 h-5 mr-1.5"/> 
                      {currentUser.points} Points
                  </div>
                )}
                <button
                onClick={logout}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150"
                >
                <LogoutIcon className="w-5 h-5 mr-1.5 sm:mr-2" />
                Logout
                </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        <div className="mb-6 sm:mb-8">
            <div className="flex border-b border-neutral-300 space-x-1 overflow-x-auto pb-px">
                {visibleNavItems.map(item => (
                  <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`py-3 px-4 sm:px-6 font-medium text-base sm:text-lg transition-colors duration-150 flex items-center rounded-t-md whitespace-nowrap
                                  ${activeTab === item.id 
                                      ? 'border-b-2 border-primary text-primary bg-primary/5' 
                                      : 'text-neutral-600 hover:text-primary hover:bg-neutral-200/50'}`}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5 inline mr-2"/>{item.label}
                  </button>
                ))}
            </div>
        </div>

        {activeTab === 'admin' && currentUser.isAdmin && <AdminPortal />}

        {!currentUser.isAdmin && (
          <>
            {activeTab === 'dashboard' && <Dashboard />} {/* Dashboard now includes How to Earn, ActionCenter removed */}
            {activeTab === 'rewards' && <RewardsCatalog />}
            {activeTab === 'activity' && <ActivityLog />}
            {activeTab === 'digitalCard' && <DigitalCardPage />}
            {activeTab === 'profile' && <UserProfilePage />}
          </>
        )}
        
      </main>

      <footer className="bg-neutral-800 text-neutral-300 text-center p-5 mt-auto">
        <p>&copy; {new Date().getFullYear()} Scale+ Rewards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
