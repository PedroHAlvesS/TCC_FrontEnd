import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import BlankPage from '../pages/BlankPage';
import Dashboard from '../pages/Dashboard';
import OrderDetails from '../pages/OrderDetails';
import EditProfile from '../pages/EditProfile';
import CreateProfile from '../pages/CreateProfile';
import RequireAuth from './RequireAuth';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<LoginPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pedidos/:id" element={<OrderDetails />} />
          <Route path="/admin/blank" element={<BlankPage />} />
          <Route path="/admin/edit" element={<EditProfile />} />
          <Route path="/admin/create" element={<CreateProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
