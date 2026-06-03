import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ExpensesPage } from './pages/Expenses/ExpensesPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { Sidebar } from './components/layout/Sidebar';

function AppRoutes() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className={`mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 lg:px-8 ${token ? 'lg:flex-row' : ''}`}>
        {token && <Sidebar />}
        <main className={`flex-1 ${token ? '' : 'mx-auto w-full max-w-xl'}`}>
          <Routes>
            <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
