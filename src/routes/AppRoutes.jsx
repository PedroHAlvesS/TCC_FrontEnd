import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from '../pages/admin/AdminLogin.page';
import CustomerLoginPage from '../pages/customer/CustomerLogin.page';
import CreateClientProfile from '../pages/CreateClientProfile';
import DeliveryManLoginPage from '../pages/delivery/DeliveryManLogin.page';
import CustomerDashboardPage from '../pages/customer/CustomerDashboard.page';
import ClientEditProfile from '../pages/ClientEditProfile';
import ClientOrderDetails from '../pages/ClientOrderDetails';
import DeliveryManDashboard from '../pages/delivery/DeliveryManDashboard';
import DeliveryManOrderDetails from '../pages/DeliveryManOrderDetails';
import BlankPage from '../pages/BlankPage';
import AdminDashboardPage from '../pages/admin/AdminDashboard.page';
import OrderDetails from '../pages/OrderDetails';
import DeliveryManOrders from '../pages/DeliveryManOrders';
import Customers from '../pages/Customers';
import CustomerOrders from '../pages/CustomerOrders';
import EditProfile from '../pages/EditProfile';
import CreateProfile from '../pages/CreateProfile';
import DeliveryMen from '../pages/DeliveryMen';
import CreateOrderPage from '../pages/CreateOrderPage';
import RequireAuth from './RequireAuth';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLoginPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/entregador" element={<DeliveryManLoginPage />} />

        {/* protected admin routes */}
        <Route element={<RequireAuth redirectTo="/admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* protected customer routes */}
        <Route element={<RequireAuth redirectTo="/" />}>
          <Route path="/cliente-dashboard" element={<CustomerDashboardPage />} />
        </Route>

        {/* protected delivery man routes */}
        <Route element={<RequireAuth redirectTo="/entregador" />}>
          <Route path="/entregador-dashboard" element={<DeliveryManDashboard />} />
        </Route>

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/entregadores" element={<DeliveryMen />} />
          <Route path="/entregadores/pedidos/:id" element={<DeliveryManOrders />} />
          <Route path="/clientes" element={<Customers />} />
          <Route path="/clientes/pedidos/:id" element={<CustomerOrders />} />
          <Route path="/pedidos/:id" element={<OrderDetails />} />
          <Route path="/admin/blank" element={<BlankPage />} />
          <Route path="/admin/edit" element={<EditProfile />} />
          <Route path="/admin/create" element={<CreateProfile />} />
          <Route path="/cliente/edit" element={<ClientEditProfile />} />
          <Route path="/cliente/create-pedido" element={<CreateOrderPage />} />
          <Route path="/cliente/pedidos/:id" element={<ClientOrderDetails />} />
          <Route path="/entregador/pedidos/:id" element={<DeliveryManOrderDetails />} />
        </Route>

        <Route path="/cliente/create" element={<CreateClientProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
