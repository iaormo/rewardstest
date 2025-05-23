import React from 'react';
import { User, Reward, Tier } from './types';
import { AwardIcon } from './components/icons/Icons';

export const TIERS: Tier[] = [
  { id: 'bronze', name: 'Bronze', minPoints: 0, icon: React.createElement(AwardIcon, { className: "w-6 h-6 text-yellow-600" }) },
  { id: 'silver', name: 'Silver', minPoints: 500, pointMultiplier: 1.1, icon: React.createElement(AwardIcon, { className: "w-6 h-6 text-slate-400" }) },
  { id: 'gold', name: 'Gold', minPoints: 1500, pointMultiplier: 1.25, icon: React.createElement(AwardIcon, { className: "w-6 h-6 text-yellow-400" }) },
  { id: 'platinum', name: 'Platinum', minPoints: 5000, pointMultiplier: 1.5, icon: React.createElement(AwardIcon, { className: "w-6 h-6 text-blue-300" }) },
];

export const USERS: User[] = [
  { id: 'user1', name: 'Alice Wonderland', email: 'alice@example.com', points: 250, tierId: 'bronze', phone: '555-0101', registrationDate: new Date('2023-01-15T10:00:00Z'), profileImageUrl: undefined },
  { id: 'user2', name: 'Bob The Builder', email: 'bob@example.com', points: 1200, tierId: 'silver', phone: '555-0102', registrationDate: new Date('2022-11-20T14:30:00Z'), profileImageUrl: undefined },
  { id: 'user3', name: 'Scaleplus Admin', email: 'admin@scaleplus.com', points: 5600, tierId: 'platinum', isAdmin: true, phone: '555-0199', registrationDate: new Date('2022-01-01T09:00:00Z'), profileImageUrl: undefined },
];

// REWARDS_DATA is the initial seed data. Rewards are now managed in LoyaltyContext state.
export const REWARDS_DATA: Reward[] = [ 
  { id: 'reward1', name: '$5 Discount Coupon', description: 'Get $5 off your next purchase.', pointsRequired: 100, imageUrl: 'https://picsum.photos/seed/reward1/300/200', stock: 100 },
  { id: 'reward2', name: 'Free Coffee', description: 'Enjoy a free cup of our signature blend coffee.', pointsRequired: 250, imageUrl: 'https://picsum.photos/seed/reward2/300/200', stock: 50 },
  { id: 'reward3', name: '20% Off Next Purchase', description: 'A hefty 20% discount on any single item.', pointsRequired: 750, imageUrl: 'https://picsum.photos/seed/reward3/300/200' },
  { id: 'reward4', name: 'Exclusive T-Shirt', description: 'Limited edition branded T-shirt.', pointsRequired: 2000, imageUrl: 'https://picsum.photos/seed/reward4/300/200', stock: 20 },
  { id: 'reward5', name: 'Early Access Pass', description: 'Get early access to new product launches.', pointsRequired: 3500, imageUrl: 'https://picsum.photos/seed/reward5/300/200' },
];

// ACTIONS_TO_EARN_POINTS is removed as this functionality is replaced by admin-managed Mechanics.
// Admins will add points manually, potentially referencing these mechanics in transaction descriptions.
