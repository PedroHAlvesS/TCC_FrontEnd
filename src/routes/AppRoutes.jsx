import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLogin.page";
import CustomerLoginPage from "../pages/customer/CustomerLogin.page";
import CreateCustomerProfilePage from "../pages/CreateCustomerProfile.page";
import DeliveryManLoginPage from "../pages/delivery/DeliveryManLogin.page";
import CustomerDashboardPage from "../pages/customer/CustomerDashboard.page";
import CustomerEditProfilePage from "../pages/customer/CustomerEditProfile.page";
import CustomerOrderDetailsPage from "../pages/customer/CustomerOrderDetails.page";
import DeliveryManDashboardPage from "../pages/delivery/DeliveryManDashboard.page";
import DeliveryManOrderDetailsPage from "../pages/delivery/DeliveryManOrderDetails.page";
import AdminDashboardPage from "../pages/admin/AdminDashboard.page";
import AdminOrderDetailsPage from "../pages/admin/AdminOrderDetails.page";
import AdminDeliveryManOrdersPage from "../pages/admin/AdminDeliveryManOrders.page";
import AdminCustomersListPage from "../pages/admin/AdminCustomersList.page";
import AdminCustomerOrdersPage from "../pages/admin/AdminCustomerOrders.page";
import AdminEditProfilePage from "../pages/admin/AdminEditProfile.page";
import AdminCreateProfilePage from "../pages/admin/AdminCreateProfile.page";
import AdminDeliveryMenPage from "../pages/admin/AdminDeliveryMen.page";
import CustomerCreateOrderPage from "../pages/customer/CustomerCreateOrder.page";
import RequireAuth from "./RequireAuth";
import { ROUTES } from "./ROUTES";

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={ROUTES.ROOT} element={<CustomerLoginPage />} />
				<Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
				<Route
					path={ROUTES.DELIVERY_LOGIN}
					element={<DeliveryManLoginPage />}
				/>

				{/* protected admin routes */}
				<Route element={<RequireAuth redirectTo={ROUTES.ADMIN_LOGIN} />}>
					<Route
						path={ROUTES.ADMIN_DASHBOARD}
						element={<AdminDashboardPage />}
					/>
					<Route
						path={ROUTES.ADMIN_EDIT_PROFILE}
						element={<AdminEditProfilePage />}
					/>
					<Route
						path={ROUTES.ADMIN_CREATE_PROFILE}
						element={<AdminCreateProfilePage />}
					/>
					<Route
						path={ROUTES.ADMIN_DELIVERY_MEN}
						element={<AdminDeliveryMenPage />}
					/>
					<Route
						path={ROUTES.ADMIN_DELIVERY_MEN_ORDERS}
						element={<AdminDeliveryManOrdersPage />}
					/>
					<Route
						path={ROUTES.ADMIN_ORDER_DETAILS}
						element={<AdminOrderDetailsPage />}
					/>
					<Route
						path={ROUTES.ADMIN_CUSTOMERS_LIST}
						element={<AdminCustomersListPage />}
					/>
					<Route
						path={ROUTES.ADMIN_CUSTOMER_ORDERS}
						element={<AdminCustomerOrdersPage />}
					/>
				</Route>

				{/* protected customer routes */}
				<Route element={<RequireAuth redirectTo={ROUTES.ROOT} />}>
					<Route
						path={ROUTES.CUSTOMER_DASHBOARD}
						element={<CustomerDashboardPage />}
					/>
					<Route
						path={ROUTES.CUSTOMER_CREATE_ORDER}
						element={<CustomerCreateOrderPage />}
					/>
					<Route
						path={ROUTES.CUSTOMER_ORDER_DETAILS}
						element={<CustomerOrderDetailsPage />}
					/>
					<Route
						path={ROUTES.CUSTOMER_EDIT_PROFILE}
						element={<CustomerEditProfilePage />}
					/>
				</Route>

				{/* protected delivery man routes */}
				<Route element={<RequireAuth redirectTo={ROUTES.DELIVERY_LOGIN} />}>
					<Route
						path={ROUTES.DELIVERY_DASHBOARD}
						element={<DeliveryManDashboardPage />}
					/>
					<Route
						path={ROUTES.DELIVERY_ORDER_DETAILS}
						element={<DeliveryManOrderDetailsPage />}
					/>
				</Route>

				<Route
					path={ROUTES.CUSTOMER_CREATE}
					element={<CreateCustomerProfilePage />}
				/>
				<Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
			</Routes>
		</BrowserRouter>
	);
}
