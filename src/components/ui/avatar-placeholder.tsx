'use client';

interface AvatarPlaceholderProps {
  name: string;
  width: number;
  height: number;
  className?: string;
}

export default function AvatarPlaceholder({ 
  name, 
  width, 
  height, 
  className = '' 
}: AvatarPlaceholderProps) {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  // Generate a consistent color based on name
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-red-500'
  ];
  
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div 
      className={`${bgColor} flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width, height }}
    >
      <span style={{ fontSize: Math.min(width, height) * 0.4 }}>
        {initials}
      </span>
    </div>
  );
}
