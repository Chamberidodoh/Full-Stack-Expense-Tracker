import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../../api';
import { categories } from '../../utils/categoryOptions';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const transactions = ['expense', 'income'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest Amount' },
  { value: 'lowest', label: 'Lowest Amount' },
];

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', transactionType: '', startDate: '', endDate: '', sort: 'newest', page: 1, limit: 10 });
  const [totalCount, setTotalCount] = useState(0);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      category: 'Food',
      transactionType: 'expense',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
    },
  });

  const watchAll = watch();

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await fetchExpenses({
        ...filters,
        page: filters.page,
        limit: filters.limit,
      });
      setExpenses(data.expenses);
      setTotalCount(data.total);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [filters]);

  const onSubmit = async (data) => {
    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense._id, data);
        toast.success('Expense updated');
      } else {
        await createExpense(data);
        toast.success('Expense added');
      }
      setSelectedExpense(null);
      reset({ title: '', amount: '', category: 'Food', transactionType: 'expense', date: new Date().toISOString().slice(0, 10), notes: '' });
      loadExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save expense');
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    reset({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      transactionType: expense.transactionType,
      date: new Date(expense.date).toISOString().slice(0, 10),
      notes: expense.notes,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await deleteExpense(id);
      toast.info('Expense deleted');
      loadExpenses();
    } catch (error) {
      toast.error('Unable to delete item');
    }
  };

  const totalPages = Math.ceil(totalCount / filters.limit);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Add / Edit Expense</h2>
        <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm text-slate-400">Title</span>
            <input {...register('title', { required: 'Title is required' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {errors.title && <p className="mt-2 text-sm text-rose-400">{errors.title.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Amount</span>
            <input type="number" step="0.01" {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Enter an amount' } })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {errors.amount && <p className="mt-2 text-sm text-rose-400">{errors.amount.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Category</span>
            <select {...register('category')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none">
              {categories.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Transaction Type</span>
            <select {...register('transactionType')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none">
              {transactions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Date</span>
            <input type="date" {...register('date', { required: 'Date is required' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {errors.date && <p className="mt-2 text-sm text-rose-400">{errors.date.message}</p>}
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm text-slate-400">Notes</span>
            <textarea {...register('notes')} rows="4" className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
          </label>

          <div className="flex items-center gap-4 lg:col-span-2">
            <button type="submit" className="rounded-2xl bg-indigo-500 px-6 py-3 text-white transition hover:bg-indigo-400">{selectedExpense ? 'Update' : 'Add'} Transaction</button>
            {selectedExpense && <button type="button" onClick={() => { setSelectedExpense(null); reset(); }} className="rounded-2xl border border-slate-700 px-6 py-3 text-slate-200">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Transactions</h2>
            <p className="mt-1 text-sm text-slate-400">Search, filter and sort your activity.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              placeholder="Search title"
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
            />
            <select value={filters.category} onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value, page: 1 }))} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none">
              <option value="">All categories</option>
              {categories.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select value={filters.transactionType} onChange={(event) => setFilters((prev) => ({ ...prev, transactionType: event.target.value, page: 1 }))} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none">
              <option value="">All types</option>
              {transactions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select value={filters.sort} onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none">
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <table className="min-w-full divide-y divide-slate-800 text-sm text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {expenses.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-4 font-medium text-white">{item.title}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4 capitalize">{item.transactionType}</td>
                  <td className="px-4 py-4">${item.amount.toFixed(2)}</td>
                  <td className="px-4 py-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => handleEdit(item)} className="rounded-2xl bg-indigo-500 px-3 py-2 text-sm text-white">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="rounded-2xl bg-rose-500 px-3 py-2 text-sm text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <span>{totalCount} transactions found</span>
          <div className="flex items-center gap-2">
            <button disabled={filters.page <= 1} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 disabled:opacity-50">Previous</button>
            <span>Page {filters.page} / {totalPages || 1}</span>
            <button disabled={filters.page >= totalPages} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 disabled:opacity-50">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
};
