
import React, { useState } from 'react';
import UserManagement from './UserManagement';
import RewardManagement from './RewardManagement';
import QRScannerPage from './QRScannerPage';
import AdminDashboard from './AdminDashboard';
import CardDesignSettingsPage from './CardDesignSettingsPage'; 
import MechanicsManagement from './MechanicsManagement'; // New import
import { UserGroupIcon, ArchiveBoxIcon, CogIcon, QrCodeIcon, PresentationChartLineIcon, PaintBrushIcon, ListIcon as MechanicsIcon } from '../icons/Icons'; // Added MechanicsIcon

type AdminSection = 'dashboard' | 'users' | 'rewards' | 'cardDesign' | 'mechanics' | 'scanner'; // Added 'mechanics'

const AdminPortal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [scannedUserId, setScannedUserId] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: PresentationChartLineIcon },
    { id: 'users' as AdminSection, label: 'User Management', icon: UserGroupIcon },
    { id: 'rewards' as AdminSection, label: 'Reward Management', icon: ArchiveBoxIcon },
    { id: 'mechanics' as AdminSection, label: 'Earning Mechanics', icon: MechanicsIcon }, // New Mechanics tab
    { id: 'cardDesign' as AdminSection, label: 'Card Design', icon: PaintBrushIcon },
    { id: 'scanner' as AdminSection, label: 'QR Scanner', icon: QrCodeIcon },
  ];

  const handleUserScanned = (userId: string) => {
    setScannedUserId(userId);
    setActiveSection('users'); 
  };

  const clearScannedUserId = () => {
    setScannedUserId(null);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl min-h-[70vh]">
      <div className="flex items-center mb-6 pb-4 border-b border-neutral-200">
        <CogIcon className="w-8 h-8 text-primary mr-3" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-800">Admin Portal</h2>
      </div>
      
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-1 sm:gap-2 border-b border-neutral-300">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center py-3 px-4 sm:px-5 font-medium text-sm sm:text-base transition-colors duration-150 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-primary/50
                        ${activeSection === item.id 
                            ? 'border-b-2 border-primary text-primary bg-primary/10' 
                            : 'text-neutral-600 hover:text-primary hover:bg-neutral-200/60'}`}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.label}
          </button>
        ))}
      </div>

      {activeSection === 'dashboard' && <AdminDashboard />}
      {activeSection === 'users' && <UserManagement scannedUserId={scannedUserId} clearScannedUserId={clearScannedUserId} />}
      {activeSection === 'rewards' && <RewardManagement />}
      {activeSection === 'mechanics' && <MechanicsManagement />}
      {activeSection === 'cardDesign' && <CardDesignSettingsPage />}
      {activeSection === 'scanner' && <QRScannerPage onScanSuccess={handleUserScanned} />}
    </div>
  );
};

export default AdminPortal;