import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { label: 'Dashboard', path: '/admin-dashboard' },
  { label: 'Entregadores', path: '/admin-delivery-men' },
  { label: 'Clientes', path: '/admin-clients' },
];

export default function Sidebar({ activePath = '/admin-dashboard' }) {
  const navigate = useNavigate();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">RapidoJá</div>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`sidebar-item ${item.path === activePath ? 'active' : ''}`}
            onClick={() => (item.path === '#' ? undefined : navigate(item.path))}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
