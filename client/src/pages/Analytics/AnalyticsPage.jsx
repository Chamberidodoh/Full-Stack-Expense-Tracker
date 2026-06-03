import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchSummary, fetchMonthly, fetchCategories } from '../../api';
import { CategoryChart } from '../../components/charts/CategoryChart';
import { MonthlyTrendChart } from '../../components/charts/MonthlyTrendChart';
import { ComparisonChart } from '../../components/charts/ComparisonChart';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [{ data: summaryData }, { data: monthlyData }, { data: categoryData }] = await Promise.all([
          fetchSummary(),
          fetchMonthly(),
          fetchCategories(),
        ]);
        setSummary(summaryData);
        setMonthly(monthlyData);
        setCategories(categoryData);
      } catch (error) {
        toast.error('Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
          <p className="text-sm text-slate-400">Total Income</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-400">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
          <p className="text-sm text-slate-400">Total Expenses</p>
          <p className="mt-3 text-3xl font-semibold text-rose-400">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
          <p className="text-sm text-slate-400">Current Balance</p>
          <p className="mt-3 text-3xl font-semibold text-white">${summary.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CategoryChart data={categories} />
        <MonthlyTrendChart data={monthly} />
      </div>

      <ComparisonChart summary={summary} />
    </div>
  );
};
