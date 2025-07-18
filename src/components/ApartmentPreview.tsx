import Image from "next/image";

interface ApartmentPreviewProps {
  leftWallColor: string;
  rightWallColor: string;
  selectedSofa: string;
  selectedMirror: string;
  className?: string;
}

export const ApartmentPreview = ({
  leftWallColor,
  rightWallColor,
  selectedSofa,
  selectedMirror,
  className = "",
}: ApartmentPreviewProps) => {
  // Check if this is a small thumbnail based on className
  const isSmall = className.includes('w-16 h-16');
  // Check if this is a responsive container
  const isResponsive = className.includes('w-full h-full');
  const size = isSmall ? 64 : 500;
  
  let containerClasses = 'relative border rounded-lg overflow-hidden';
  
  if (isSmall) {
    containerClasses += ' w-16 h-16';
  } else if (isResponsive) {
    containerClasses += ' w-full h-full';
  } else {
    containerClasses += ' w-[500px] h-[500px]';
  }
  
  return (
    <div
      className={`${containerClasses} ${className}`}
      style={{
        background: `linear-gradient(to right, ${leftWallColor} 50%, ${rightWallColor} 50%)`,
      }}
    >
      {/* Sofa layer */}
      {selectedSofa && (
        <Image
          src={selectedSofa}
          alt="Selected sofa"
          width={size}
          height={size}
          className="absolute inset-0 object-cover"
          priority
        />
      )}
      
      {/* Mirror layer */}
      {selectedMirror && (
        <Image
          src={selectedMirror}
          alt="Selected mirror"
          width={size}
          height={size}
          className="absolute inset-0 object-cover"
          priority
        />
      )}
    </div>
  );
}; 