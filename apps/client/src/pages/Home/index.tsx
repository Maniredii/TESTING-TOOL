import { useAuth } from '../../contexts/AuthContext';

export const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
      <p>Role: {user?.role}</p>
      <button 
        onClick={logout}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};
