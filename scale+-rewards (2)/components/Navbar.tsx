import React from 'react';
import { GiftIcon, StarIcon } from './icons/Icons';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-primary-dark to-primary shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <StarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-accent"/>
            <span className="font-bold text-xl sm:text-2xl text-white ml-3 tracking-tight">Scale+ Rewards</span>
          </div>
          {/* Future navigation links can go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;