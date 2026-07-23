import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/projects" element={<div>Projects</div>} />
          <Route path="/executions" element={<div>Executions</div>} />
          <Route path="/reports" element={<div>Reports</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
