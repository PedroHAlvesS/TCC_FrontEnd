import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/ROUTES";

const sidebarItems = [
	{ label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD },
	{ label: "Entregadores", path: ROUTES.ADMIN_DELIVERY_MEN },
	{ label: "Clientes", path: ROUTES.ADMIN_CUSTOMERS_LIST },
];

export default function Sidebar({ activePath = ROUTES.ADMIN_DASHBOARD }) {
	const navigate = useNavigate();

	return (
		<aside className="dashboard-sidebar">
			<div className="sidebar-brand">RapidoJá</div>
			<nav className="sidebar-nav">
				{sidebarItems.map((item) => (
					<button
						key={item.label}
						type="button"
						className={`sidebar-item ${item.path === activePath ? "active" : ""}`}
						onClick={() =>
							item.path === "#" ? undefined : navigate(item.path)
						}
					>
						{item.label}
					</button>
				))}
			</nav>
		</aside>
	);
}
