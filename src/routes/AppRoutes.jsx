import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ClientLoginPage from '../pages/ClientLoginPage';
import CreateClientProfile from '../pages/CreateClientProfile';
import ClientDashboard from '../pages/ClientDashboard';
import BlankPage from '../pages/BlankPage';
import Dashboard from '../pages/Dashboard';
import OrderDetails from '../pages/OrderDetails';
import DeliveryManOrders from '../pages/DeliveryManOrders';
import Customers from '../pages/Customers';
import CustomerOrders from '../pages/CustomerOrders';
import EditProfile from '../pages/EditProfile';
import CreateProfile from '../pages/CreateProfile';
import DeliveryMen from '../pages/DeliveryMen';
import RequireAuth from './RequireAuth';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLoginPage />} />
        <Route path="/admin" element={<LoginPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entregadores" element={<DeliveryMen />} />
          <Route path="/entregadores/pedidos/:id" element={<DeliveryManOrders />} />
          <Route path="/clientes" element={<Customers />} />
          <Route path="/clientes/pedidos/:id" element={<CustomerOrders />} />
          <Route path="/pedidos/:id" element={<OrderDetails />} />
          <Route path="/admin/blank" element={<BlankPage />} />
          <Route path="/admin/edit" element={<EditProfile />} />
          <Route path="/admin/create" element={<CreateProfile />} />
          <Route path="/cliente-dashboard" element={<ClientDashboard />} />
        </Route>

        <Route path="/cliente/create" element={<CreateClientProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
