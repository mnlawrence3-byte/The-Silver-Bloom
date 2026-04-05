import React from 'react';
import { User } from 'lucide-react';
import { getAvatarIcon } from '../lib/cosmic-icons';

interface UserAvatarProps {
  photoURL?: string;
  avatarIcon?: string;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function UserAvatar({ photoURL, avatarIcon, className = "", iconClassName = "", size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className={`w-full h-full rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg`}>
        {photoURL ? (
          <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <User className={`${iconSizeClasses[size]} text-slate-600`} />
        )}
      </div>
      {avatarIcon && (
        <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-900 border border-white/20 text-silver shadow-md ${iconClassName}`}>
          {React.cloneElement(getAvatarIcon(avatarIcon) as React.ReactElement<any>, { 
            className: size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4' 
          })}
        </div>
      )}
    </div>
  );
}
