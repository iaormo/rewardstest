import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, Tier, Reward, Mechanic } from '../types'; // Added Mechanic
import { TIERS, REWARDS_DATA } from '../constants'; // Removed ACTIONS_TO_EARN_POINTS
import { useAuth } from '../hooks/useAuth';

interface LoyaltyContextType {
  transactions: Transaction[];
  rewards: Reward[];
  mechanics: Mechanic[]; // Added mechanics
  currentTier: Tier;
  // earnPoints: (actionId: string) => Promise<void>; // earnPoints signature will change or be handled differently
  earnPointsAdmin: (userId: string, points: number, description: string) => Promise<void>; // For admin to add points
  redeemReward: (rewardId: string) => Promise<void>; // This will become requestRedemption later
  getTierById: (tierId: string) => Tier | undefined;
  getTransactionsForCurrentUser: () => Transaction[];
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (reward: Reward) => void;
  deleteReward: (rewardId: string) => void;
  addMechanic: (mechanic: Omit<Mechanic, 'id'>) => void; // New
  updateMechanic: (mechanic: Mechanic) => void; // New
  deleteMechanic: (mechanicId: string) => void; // New
}

export const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

interface LoyaltyProviderProps {
  children: ReactNode;
}

export const LoyaltyProvider: React.FC<LoyaltyProviderProps> = ({ children }) => {
  const { currentUser, users, updateUserPoints: updateUserAuthPoints } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTransactions = localStorage.getItem('loyaltyTransactions');
    try {
        return storedTransactions ? JSON.parse(storedTransactions).map((t:Transaction)=>({...t, timestamp: new Date(t.timestamp)})) : [];
    } catch (e) {
        console.error("Failed to parse transactions from localStorage", e);
        return [];
    }
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const storedRewards = localStorage.getItem('loyaltyRewards');
    try {
        return storedRewards ? JSON.parse(storedRewards) : REWARDS_DATA;
    } catch (e) {
        console.error("Failed to parse rewards from localStorage", e);
        return REWARDS_DATA;
    }
  });

  const [mechanics, setMechanics] = useState<Mechanic[]>(() => {
    const storedMechanics = localStorage.getItem('loyaltyMechanics');
    try {
        return storedMechanics ? JSON.parse(storedMechanics) : [];
    } catch (e) {
        console.error("Failed to parse mechanics from localStorage", e);
        return [];
    }
  });
  
  const [currentTier, setCurrentTier] = useState<Tier>(TIERS[0]);

  useEffect(() => {
    localStorage.setItem('loyaltyTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('loyaltyRewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('loyaltyMechanics', JSON.stringify(mechanics));
  }, [mechanics]);

  const getTierById = useCallback((tierId: string) => {
    return TIERS.find(t => t.id === tierId);
  }, []);

  const determineTier = useCallback((points: number): Tier => {
    let determinedTier = TIERS[0];
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (points >= TIERS[i].minPoints) {
        determinedTier = TIERS[i];
        break;
      }
    }
    return determinedTier;
  }, []);

  useEffect(() => {
    if (currentUser) {
      const tier = determineTier(currentUser.points);
      setCurrentTier(tier);
    } else {
      setCurrentTier(TIERS[0]); 
    }
  }, [currentUser, determineTier]);


  const addTransaction = useCallback((userId: string, type: 'earn' | 'redeem', points: number, description: string, rewardId?: string) => {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      type,
      points,
      description,
      timestamp: new Date(),
      rewardId,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  // Admin manually adds points
  const earnPointsAdmin = useCallback(async (userId: string, pointsToEarn: number, description: string): Promise<void> => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      throw new Error("User not found.");
    }

    // Tier multiplier could still be applied if desired, based on targetUser's current points before adding new ones
    const userTier = determineTier(targetUser.points);
    let actualPointsEarned = pointsToEarn;
    if (userTier.pointMultiplier) {
        actualPointsEarned = Math.round(pointsToEarn * userTier.pointMultiplier);
    }

    const newTotalPoints = targetUser.points + actualPointsEarned;
    updateUserAuthPoints(targetUser.id, newTotalPoints);
    addTransaction(targetUser.id, 'earn', actualPointsEarned, description);
  }, [users, updateUserAuthPoints, addTransaction, determineTier]);


  const redeemReward = useCallback(async (rewardId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error("User not logged in.");
    }
    // This function will be modified for request/approval flow in Phase 2.
    // For now, it remains direct redemption for simplicity until Phase 2 is implemented.
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      throw new Error("Reward not found.");
    }
    if (!reward.pointsRequired || currentUser.points < reward.pointsRequired) {
      throw new Error("Not enough points to redeem this reward.");
    }
    if (reward.stock !== undefined && reward.stock <= 0) {
      throw new Error("This reward is out of stock.");
    }

    const newTotalPoints = currentUser.points - reward.pointsRequired;
    updateUserAuthPoints(currentUser.id, newTotalPoints);
    addTransaction(currentUser.id, 'redeem', reward.pointsRequired, `Redeemed: ${reward.name}`, reward.id);

    if (reward.stock !== undefined) {
      setRewards(prevRewards => 
        prevRewards.map(r => r.id === rewardId ? { ...r, stock: (r.stock || 0) - 1 } : r)
      );
    }
  }, [currentUser, rewards, updateUserAuthPoints, addTransaction]);

  const getTransactionsForCurrentUser = useCallback((): Transaction[] => {
    if (!currentUser) return [];
    return transactions.filter(t => t.userId === currentUser.id).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [currentUser, transactions]);

  // Admin functions for rewards
  const addReward = useCallback((newRewardData: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...newRewardData,
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pointsRequired: Number(newRewardData.pointsRequired) || 0,
      stock: newRewardData.stock !== undefined ? Number(newRewardData.stock) : undefined,
    };
    setRewards(prevRewards => [...prevRewards, newReward]);
  }, []);

  const updateReward = useCallback((updatedReward: Reward) => {
    setRewards(prevRewards => 
      prevRewards.map(r => r.id === updatedReward.id ? {...r, ...updatedReward, pointsRequired: Number(updatedReward.pointsRequired) || 0, stock: updatedReward.stock !== undefined ? Number(updatedReward.stock) : undefined} : r)
    );
  }, []);

  const deleteReward = useCallback((rewardId: string) => {
    setRewards(prevRewards => prevRewards.filter(r => r.id !== rewardId));
  }, []);

  // Admin functions for Mechanics
  const addMechanic = useCallback((mechanicData: Omit<Mechanic, 'id'>) => {
    const newMechanic: Mechanic = {
      ...mechanicData,
      id: `mech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isActive: mechanicData.isActive === undefined ? true : mechanicData.isActive,
    };
    setMechanics(prevMechanics => [...prevMechanics, newMechanic]);
  }, []);

  const updateMechanic = useCallback((updatedMechanic: Mechanic) => {
    setMechanics(prevMechanics => 
      prevMechanics.map(m => m.id === updatedMechanic.id ? updatedMechanic : m)
    );
  }, []);

  const deleteMechanic = useCallback((mechanicId: string) => {
    setMechanics(prevMechanics => prevMechanics.filter(m => m.id !== mechanicId));
  }, []);


  return (
    <LoyaltyContext.Provider value={{ 
      transactions, 
      rewards, 
      mechanics, // Added
      currentTier, 
      earnPointsAdmin, // Changed from earnPoints
      redeemReward, 
      getTierById, 
      getTransactionsForCurrentUser,
      addReward,
      updateReward,
      deleteReward,
      addMechanic, // New
      updateMechanic, // New
      deleteMechanic // New
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
};