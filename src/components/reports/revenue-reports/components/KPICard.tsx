import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning';
}

const variantClasses = {
  primary: 'bg-gradient-primary',
  secondary: 'bg-gradient-to-br from-secondary to-secondary/80',
  accent: 'bg-gradient-accent',
  warning: 'bg-gradient-to-br from-warning to-warning/80',
};

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'primary' 
}: KPICardProps) => {
  return (
    <div className={`${variantClasses[variant]} rounded-xl shadow-lg p-6 text-white transition-all duration-300 hover:shadow-glow hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8 opacity-80" />
        {trend !== undefined && (
          trend > 0 ? (
            <ArrowUpRight className="w-6 h-6 text-success-foreground" />
          ) : (
            <ArrowDownRight className="w-6 h-6 text-destructive-foreground" />
          )
        )}
      </div>
      <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-80">{subtitle}</p>
    </div>
  );
};
