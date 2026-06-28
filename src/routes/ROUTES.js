export const ROUTES = {
  // Public routes
  ROOT: '/',
  ADMIN_LOGIN: '/admin',
  DELIVERY_LOGIN: '/entregador',
  CUSTOMER_CREATE: '/cliente/create',

  // Admin routes
  ADMIN_DASHBOARD: '/admin-dashboard',
  ADMIN_EDIT_PROFILE: '/admin/edit',
  ADMIN_CREATE_PROFILE: '/admin/create',
  ADMIN_DELIVERY_MEN: '/admin-delivery-men',
  ADMIN_DELIVERY_MEN_ORDERS: '/admin-delivery-men/orders/:id',
  ADMIN_ORDER_DETAILS: '/pedidos/:id',
  ADMIN_CUSTOMERS_LIST: '/admin-clients',
  ADMIN_CUSTOMER_ORDERS: '/clientes/pedidos/:id',

  // Customer routes
  CUSTOMER_DASHBOARD: '/cliente-dashboard',
  CUSTOMER_CREATE_ORDER: '/cliente/create-pedido',
  CUSTOMER_ORDER_DETAILS: '/cliente/pedidos/:id',
  CUSTOMER_EDIT_PROFILE: '/cliente/edit',

  // Delivery Man routes
  DELIVERY_DASHBOARD: '/entregador-dashboard',
  DELIVERY_ORDER_DETAILS: '/entregador/pedidos/:id',
};

export function buildRoute(
  route,
  params
) {
  return Object.entries(params).reduce(
    (currentRoute, [key, value]) =>
      currentRoute.replace(`:${key}`, String(value)),
    route
  );
}