interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = 'bg-green-500',
  className = '',
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  return (
    <div 
      className={`w-full bg-gray-100 rounded-full overflow-hidden ${className}`} 
      style={{ height: `${height}px` }}
    >
      <div
        className={`${color} transition-all duration-500 ease-out`}
        style={{ 
          width: `${safeProgress}%`,
          height: '100%',
        }}
      />
    </div>
  );
};

export default ProgressBar;