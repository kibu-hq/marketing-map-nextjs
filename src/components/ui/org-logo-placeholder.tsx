'use client';

interface OrgLogoPlaceholderProps {
  name: string;
  width: number;
  height: number;
  className?: string;
}

export default function OrgLogoPlaceholder({ 
  name, 
  width, 
  height, 
  className = '' 
}: OrgLogoPlaceholderProps) {
  const words = name.split(' ');
  let effectiveName = words[0];
  if (words.length > 1 && words[0].toLowerCase() === 'the') {
    effectiveName = words[1];
  }
  const initials = effectiveName.charAt(0).toUpperCase();

  return (
    <div 
      className={`bg-gray-200 flex items-center justify-center text-gray-500 font-semibold ${className}`}
      style={{ width, height }}
    >
      <span style={{ fontSize: Math.min(width, height) * 0.4 }}>
        {initials}
      </span>
    </div>
  );
}
