import { Doughnut } from 'react-chartjs-2';

export const CategoryChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [{
      data: data.map((item) => item.total),
      backgroundColor: ['#4f46e5','#ec4899','#f97316','#14b8a6','#22c55e','#facc15','#6366f1','#fb7185'],
    }],
  };

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
      <h3 className="text-lg font-semibold text-white">Spending distribution</h3>
      <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
    </div>
  );
};
