import { Line } from 'react-chartjs-2';

export const MonthlyTrendChart = ({ data }) => {
  const labels = data.map((item) => item.month);
  const income = data.map((item) => item.income || 0);
  const expense = data.map((item) => item.expense || 0);

  const chartData = {
    labels,
    datasets: [
      { label: 'Income', data: income, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)', tension: 0.4 },
      { label: 'Expense', data: expense, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.2)', tension: 0.4 },
    ],
  };

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
      <h3 className="text-lg font-semibold text-white">Monthly expense trend</h3>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
};
