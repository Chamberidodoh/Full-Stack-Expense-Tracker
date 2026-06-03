import { useEffect, useState } from 'react';
import { fetchSummary, fetchExpenses } from '../../api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const DashboardPage = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const summaryResponse = await fetchSummary();
        setSummary(summaryResponse.data);
        const expensesResponse = await fetchExpenses({ page: 1, limit: 5, sort: 'newest' });
        setRecent(expensesResponse.data.expenses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm text-slate-400">Total Income</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-400">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm text-slate-400">Total Expenses</p>
          <p className="mt-3 text-3xl font-semibold text-rose-400">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm text-slate-400">Current Balance</p>
          <p className="mt-3 text-3xl font-semibold text-white">${summary.balance.toFixed(2)}</p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent transactions</h2>
            <p className="mt-1 text-sm text-slate-400">Latest activity from your expense history.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {recent.length === 0 ? (
            <p className="text-slate-400">No recent transactions available.</p>
          ) : (
            recent.map((item) => (
              <div key={item._id} className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.category} • {item.transactionType}</p>
                </div>
                <div className="flex items-center justify-between gap-4 text-right">
                  <p className="text-lg font-semibold text-white">${item.amount.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
