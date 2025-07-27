import React from 'react';
import { Card } from '@/components/ui/card';

interface WireframeContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const WireframeContainer: React.FC<WireframeContainerProps> = ({
  title,
  subtitle,
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <Card className="bg-gray-50 border-2 border-gray-300 p-6 min-h-[600px] max-w-sm mx-auto">
        <div className="space-y-4 h-full">
          {children}
        </div>
      </Card>
    </div>
  );
};

// Reusable wireframe elements
export const WireframeBox: React.FC<{ 
  height?: string; 
  label?: string; 
  children?: React.ReactNode;
  className?: string;
}> = ({ height = "h-16", label, children, className = "" }) => (
  <div className={`border-2 border-dashed border-gray-400 bg-gray-100 ${height} flex items-center justify-center text-gray-600 text-sm ${className}`}>
    {children || label || "Content Box"}
  </div>
);

export const WireframeButton: React.FC<{ 
  label: string; 
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}> = ({ label, variant = 'primary', size = 'md' }) => {
  const baseClasses = "border-2 text-center font-medium";
  const variantClasses = {
    primary: "border-gray-800 bg-gray-800 text-white",
    secondary: "border-gray-600 bg-gray-600 text-white", 
    outline: "border-gray-400 bg-white text-gray-800"
  };
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {label}
    </div>
  );
};

export const WireframeInput: React.FC<{ placeholder: string; height?: string }> = ({ 
  placeholder, 
  height = "h-10" 
}) => (
  <div className={`border-2 border-gray-400 bg-white ${height} flex items-center px-3 text-gray-500 text-sm`}>
    {placeholder}
  </div>
);

export const WireframeNav: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="border-t-2 border-gray-400 bg-gray-200 flex justify-around py-3">
    {items.map((item, index) => (
      <div key={index} className="text-center">
        <div className="w-6 h-6 border border-gray-500 bg-gray-300 mx-auto mb-1"></div>
        <span className="text-xs text-gray-600">{item}</span>
      </div>
    ))}
  </div>
);

export const WireframeProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ 
  step, 
  totalSteps 
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs text-gray-600">
      <span>Step {step} of {totalSteps}</span>
    </div>
    <div className="h-2 bg-gray-200 border border-gray-400">
      <div 
        className="h-full bg-gray-600" 
        style={{ width: `${(step / totalSteps) * 100}%` }}
      ></div>
    </div>
  </div>
);