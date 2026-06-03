import { Bar } from 'react-chartjs-2';

export const ComparisonChart = ({ summary }) => {
  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      label: 'Amount',
      data: [summary.totalIncome || 0, summary.totalExpenses || 0],
      backgroundColor: ['#22c55e', '#ef4444'],
    }],
  };

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
      <h3 className="text-lg font-semibold text-white">Income vs expenses</h3>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
};
