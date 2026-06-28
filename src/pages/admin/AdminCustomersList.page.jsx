import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
	fetchCustomers,
	fetchAdminProfile,
} from "../../services/adminDashboard.service";
import { clearToken } from "../../services/auth";
import { ROUTES, buildRoute } from "../../routes/ROUTES";

function formatPhone(phone) {
	if (!phone) return "-";
	const normalized = phone.replace(/\D/g, "");
	return normalized.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

function formatDate(dateString) {
	if (!dateString) return "-";
	return new Date(dateString).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function AdminCustomersListPage() {
	const [customers, setCustomers] = useState(null);
	const [admin, setAdmin] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [error, setError] = useState("");
	const [profileOpen, setProfileOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		let mounted = true;

		Promise.all([fetchAdminProfile(), fetchCustomers()])
			.then(([adminData, customerData]) => {
				if (!mounted) return;
				setAdmin(adminData);
				setCustomers(Array.isArray(customerData) ? customerData : []);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err.message || "Erro ao carregar clientes");
			});

		return () => {
			mounted = false;
		};
	}, []);

	function handleLogout() {
		clearToken();
		navigate(ROUTES.ADMIN_LOGIN, { replace: true });
	}

	const filteredCustomers = (customers || []).filter((customer) =>
		customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (error) {
		return (
			<div className="page-shell dashboard-shell">
				<div className="dashboard-main" style={{ padding: 24 }}>
					<h2>Erro</h2>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	if (!customers || !admin) {
		return (
			<div className="page-shell dashboard-shell">
				<div className="dashboard-main" style={{ padding: 24 }}>
					<h2>Carregando clientes…</h2>
				</div>
			</div>
		);
	}

	return (
		<div className="page-shell dashboard-shell">
			<Sidebar activePath={ROUTES.ADMIN_CUSTOMERS_LIST} />
			<div className="dashboard-main">
				<header className="dashboard-header">
					<div>
						<div className="dashboard-title">Clientes</div>
						<div className="dashboard-subtitle">
							Gerencie os clientes cadastrados no sistema.
						</div>
					</div>

					<div className="profile-menu-container">
						<button
							className="profile-button"
							onClick={() => setProfileOpen((prev) => !prev)}
						>
							<span className="profile-avatar">
								{admin.name?.charAt(0) || "A"}
							</span>
							<div className="profile-info">
								<span>{admin.name}</span>
								<small>Administrador</small>
							</div>
						</button>
						{profileOpen && (
							<div className="profile-dropdown">
								<button
									type="button"
									className="profile-dropdown-item"
									onClick={() => navigate(ROUTES.ADMIN_EDIT)}
								>
									Editar Perfil
								</button>
								<button
									type="button"
									className="profile-dropdown-item"
									onClick={() => navigate(ROUTES.ADMIN_CREATE)}
								>
									Criar Novo Perfil
								</button>
								<button
									type="button"
									className="profile-dropdown-item logout"
									onClick={handleLogout}
								>
									Sair
								</button>
							</div>
						)}
					</div>
				</header>

				<section className="dashboard-orders">
					<div className="dashboard-orders-header">
						<div>
							<h2>Clientes</h2>
							<p>Filtre pelo nome e veja clientes ativos no sistema.</p>
						</div>
					</div>

					<div
						className="dashboard-filter-row"
						style={{ gridTemplateColumns: "1fr 240px" }}
					>
						<label>
							Buscar cliente por nome
							<input
								type="text"
								placeholder="Digite o nome do cliente"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
							/>
						</label>
					</div>

					<div className="dashboard-orders-table-wrapper">
						<table className="dashboard-orders-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Nome</th>
									<th>E-mail</th>
									<th>Telefone</th>
									<th>Data de Cadastro</th>
								</tr>
							</thead>
							<tbody>
								{filteredCustomers.length === 0 ? (
									<tr>
										<td
											colSpan="5"
											style={{
												padding: "24px",
												textAlign: "center",
												color: "#64748b",
											}}
										>
											Nenhum cliente encontrado.
										</td>
									</tr>
								) : (
									filteredCustomers.map((customer) => (
										<tr
											key={customer.id}
											onClick={() =>
												navigate(
													buildRoute(ROUTES.ADMIN_CUSTOMER_ORDERS, {
														id: customer.id,
													}),
												)
											}
											style={{ cursor: "pointer" }}
										>
											<td>#{customer.id}</td>
											<td>{customer.name}</td>
											<td>{customer.email}</td>
											<td>{formatPhone(customer.phoneNumber)}</td>
											<td>{formatDate(customer.createdAt)}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
	);
}
