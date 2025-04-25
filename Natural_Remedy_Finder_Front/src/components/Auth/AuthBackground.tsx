import { Leaf } from "lucide-react";

export const LeafBackground = () => {
  const leaves = Array.from({ length: 12 }).map((_, index) => {
    const size = Math.floor(Math.random() * 30) + 20;
    const top = `${Math.floor(Math.random() * 100)}%`;
    const left = `${Math.floor(Math.random() * 100)}%`;
    const rotation = Math.floor(Math.random() * 360);
    const opacity = Math.random() * 0.15 + 0.05;

    return (
      <div
        key={index}
        className="absolute leaf-float"
        style={{
          top,
          left,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <Leaf size={size} className="text-green-500" style={{ opacity }} />
      </div>
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden leaf-pattern">
      {leaves}
      <div className="absolute inset-0 bg-gradient-radial from-green-50/0 to-green-50/30 mix-blend-overlay"></div>
    </div>
  );
};
