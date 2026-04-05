import React from 'react';
import { 
  Sun, Moon, Stars, Sparkles, Compass, Heart, Activity, 
  Eye, Shield, Zap as Bolt, Star, Cloud, Flame, Droplets, Wind, Anchor 
} from 'lucide-react';

export const AVATAR_ICONS = [
  { name: "Sun", icon: <Sun className="w-6 h-6" /> },
  { name: "Moon", icon: <Moon className="w-6 h-6" /> },
  { name: "Stars", icon: <Stars className="w-6 h-6" /> },
  { name: "Sparkles", icon: <Sparkles className="w-6 h-6" /> },
  { name: "Compass", icon: <Compass className="w-6 h-6" /> },
  { name: "Heart", icon: <Heart className="w-6 h-6" /> },
  { name: "Activity", icon: <Activity className="w-6 h-6" /> },
  { name: "Eye", icon: <Eye className="w-6 h-6" /> },
  { name: "Shield", icon: <Shield className="w-6 h-6" /> },
  { name: "Bolt", icon: <Bolt className="w-6 h-6" /> },
  { name: "Star", icon: <Star className="w-6 h-6" /> },
  { name: "Cloud", icon: <Cloud className="w-6 h-6" /> },
  { name: "Flame", icon: <Flame className="w-6 h-6" /> },
  { name: "Droplets", icon: <Droplets className="w-6 h-6" /> },
  { name: "Wind", icon: <Wind className="w-6 h-6" /> },
  { name: "Anchor", icon: <Anchor className="w-6 h-6" /> }
];

export function getAvatarIcon(name: string) {
  return AVATAR_ICONS.find(i => i.name === name)?.icon || <Stars className="w-5 h-5" />;
}
