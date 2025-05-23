
export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  tierId: string;
  isAdmin?: boolean;
  phone?: string; 
  registrationDate?: Date; 
  profileImageUrl?: string; // Added to store base64 image
}

export interface Tier {
  id: string;
  name: string;
  minPoints: number;
  pointMultiplier?: number; // Optional: e.g., earn 1.2x points
  icon?: React.ReactElement<{ className?: string }>;
}

export interface Reward {
  id: string;
  name?: string;
  description?: string;
  pointsRequired?: number;
  imageUrl?: string;
  stock?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  timestamp: Date;
  rewardId?: string; // if type is 'redeem'
}

export interface Mechanic { // New interface for earning mechanics
  id: string;
  title: string;
  description: string;
  isActive?: boolean;
}

export interface CardSettings {
  logoUrl?: string;
  coverImageUrl?: string;
  cardTitle: string;
  // numberOfStamps: number; // Removed: Stamps are no longer used.
  primaryColor: string; // Color for the card background if no cover image, and for accents
  secondaryColor: string; // Color for text and icons on the card
}