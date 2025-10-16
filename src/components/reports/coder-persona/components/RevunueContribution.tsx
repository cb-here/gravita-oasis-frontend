import { Banknote } from "lucide-react";

const RevenueCard = ({ title, value, color }: { 
  title: string; 
  value: string; 
  color: "purple" | "green";
}) => {
  const styles = {
    purple: {
      gradient: "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/30",
      text: "text-purple-600 dark:text-purple-300",
      value: "text-purple-900 dark:text-purple-200"
    },
    green: {
      gradient: "from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
      text: "text-green-600 dark:text-green-300",
      value: "text-green-900 dark:text-green-200"
    }
  };

  const style = styles[color];

  return (
    <div className={`p-4 bg-gradient-to-br ${style.gradient} rounded-lg`}>
      <div className={`text-sm ${style.text} mb-1`}>
        {title}
      </div>
      <div className={`text-2xl font-bold ${style.value}`}>
        {value}
      </div>
    </div>
  );
};

export default function RevenueContribution() {
  const revenueCards = [
    { title: "Avg per Task", value: "$125", color: "purple" as const },
    { title: "Quality Bonus", value: "$1,250", color: "green" as const },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Banknote className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Revenue Contribution
        </h3>
      </div>
      <div className="h-[300px] mb-4">
        <canvas id="revenueChart"></canvas>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {revenueCards.map((card, index) => (
          <RevenueCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}