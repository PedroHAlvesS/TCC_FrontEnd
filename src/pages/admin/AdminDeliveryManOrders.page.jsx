import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import DeliveryManDetailsCard from "../../components/DeliveryManDetailsCard";
import { clearToken } from "../../services/auth";
import {
	fetchAdminProfile,
	fetchDeliveryMen,
	fetchDeliveryManOrders,
	deleteDeliveryMan,
} from "../../services/adminDashboard.service";
import { ROUTES, buildRoute } from "../../routes/ROUTES";

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

export default function AdminDeliveryManOrdersPage() {
	const { id } = useParams();
	const [admin, setAdmin] = useState(null);
	const [deliveryMan, setDeliveryMan] = useState(null);
	const [orders, setOrders] = useState([]);
	const [searchClient, setSearchClient] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		let mounted = true;

		Promise.all([
			fetchAdminProfile(),
			fetchDeliveryMen(),
			fetchDeliveryManOrders(id),
		])
			.then(([adminData, deliveryMenData, orderData]) => {
				if (!mounted) return;
				setAdmin(adminData);
				const foundDeliveryMan = (deliveryMenData || []).find(
					(item) => String(item.id) === String(id),
				);
				if (!foundDeliveryMan) {
					setError("Entregador não encontrado.");
					setLoading(false);
					return;
				}
				setDeliveryMan(foundDeliveryMan);
				setOrders(Array.isArray(orderData) ? orderData : []);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err.message || "Erro ao carregar dados do entregador");
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, [id]);

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const matchesName = order.customerName
				.toLowerCase()
				.includes(searchClient.toLowerCase());
			const matchesStatus = statusFilter ? order.status === statusFilter : true;
			return matchesName && matchesStatus;
		});
	}, [orders, searchClient, statusFilter]);

	function handleLogout() {
		clearToken();
		navigate(ROUTES.ADMIN_LOGIN, { replace: true });
	}

	async function handleDeleteCurrentDeliveryMan() {
		if (!deliveryMan) return;
		const confirmed = window.confirm(
			`Deseja realmente excluir ${deliveryMan.name}?`,
		);
		if (!confirmed) return;

		setDeleting(true);
		setError("");
		setSuccessMessage("");

		try {
			await deleteDeliveryMan(deliveryMan.id);
			setSuccessMessage("Entregador excluído com sucesso.");
			setTimeout(() => navigate(ROUTES.ADMIN_DELIVERY_MEN), 700);
		} catch (err) {
			setError(err?.message || "Erro ao excluir entregador");
		} finally {
			setDeleting(false);
		}
	}

	function handleEditCurrentDeliveryMan() {
		navigate(ROUTES.ADMIN_DELIVERY_MEN, {
			state: { editDeliveryManId: deliveryMan?.id },
		});
	}

	if (loading) {
		return (
			<div className="page-shell dashboard-shell">
				<div className="dashboard-main" style={{ padding: 24 }}>
					<h2>Carregando entregador...</h2>
				</div>
			</div>
		);
	}

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

	return (
		<div className="page-shell dashboard-shell">
			<Sidebar activePath="/admin-delivery-men" />
			<div className="dashboard-main">
				<div className="page-actions-row">
					<button
						type="button"
						className="secondary-button"
						onClick={() => navigate(ROUTES.ADMIN_DELIVERY_MEN)}
					>
						← Voltar para entregadores
					</button>
				</div>

				<header className="dashboard-header">
					<div>
						<div className="dashboard-title">Detalhes do Entregador</div>
						<div className="dashboard-subtitle">
							Pedidos atribuídos e informações do entregador.
						</div>
					</div>
				</header>

				{successMessage && (
					<div className="success-banner">
						<span>{successMessage}</span>
						<button
							className="banner-close"
							onClick={() => setSuccessMessage("")}
						>
							✕
						</button>
					</div>
				)}

				{error && (
					<div className="error-banner">
						<span>{error}</span>
						<button className="banner-close" onClick={() => setError("")}>
							✕
						</button>
					</div>
				)}

				<section className="dashboard-orders" style={{ padding: "24px 28px" }}>
					<DeliveryManDetailsCard
						deliveryMan={deliveryMan}
						onEdit={handleEditCurrentDeliveryMan}
						onDelete={handleDeleteCurrentDeliveryMan}
					/>

					<div className="dashboard-orders-header" style={{ marginTop: 32 }}>
						<div>
							<h2>Pedidos do Entregador</h2>
							<p>Busque por cliente ou filtre por status.</p>
						</div>
					</div>

					<div
						className="dashboard-filter-row"
						style={{ gridTemplateColumns: "repeat(3, minmax(240px, 1fr))" }}
					>
						<label>
							Buscar cliente
							<input
								type="text"
								placeholder="Digite o nome do cliente"
								value={searchClient}
								onChange={(event) => setSearchClient(event.target.value)}
							/>
						</label>
						<label>
							Filtrar status
							<select
								value={statusFilter}
								onChange={(event) => setStatusFilter(event.target.value)}
							>
								<option value="">Todos os status</option>
								<option value="Pendente">Pendente</option>
								<option value="Atribuído">Atribuído</option>
								<option value="Em trânsito">Em trânsito</option>
								<option value="Entregue">Entregue</option>
								<option value="Cancelado">Cancelado</option>
							</select>
						</label>
					</div>

					<div className="dashboard-orders-table-wrapper">
						<table className="dashboard-orders-table">
							<thead>
								<tr>
									<th>ID do Pedido</th>
									<th>Cliente</th>
									<th>Endereço de Entrega</th>
									<th>Data do Pedido</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredOrders.length === 0 ? (
									<tr>
										<td
											colSpan="6"
											style={{
												padding: "24px",
												textAlign: "center",
												color: "#64748b",
											}}
										>
											Nenhum pedido encontrado.
										</td>
									</tr>
								) : (
									filteredOrders.map((order) => (
										<tr key={order.id} style={{ cursor: "pointer" }}>
											<td
												onClick={() =>
													navigate(
														buildRoute(ROUTES.ADMIN_ORDER_DETAILS, {
															id: order.id,
														}),
													)
												}
											>
												#{order.id}
											</td>
											<td
												onClick={() =>
													navigate(
														buildRoute(ROUTES.ADMIN_ORDER_DETAILS, {
															id: order.id,
														}),
													)
												}
											>
												{order.customerName}
											</td>
											<td
												onClick={() =>
													navigate(
														buildRoute(ROUTES.ADMIN_ORDER_DETAILS, {
															id: order.id,
														}),
													)
												}
											>
												{order.address?.street}, {order.address?.number}
											</td>
											<td
												onClick={() =>
													navigate(
														buildRoute(ROUTES.ADMIN_ORDER_DETAILS, {
															id: order.id,
														}),
													)
												}
											>
												{formatDate(order.creationDate)}
											</td>
											<td
												onClick={() =>
													navigate(
														buildRoute(ROUTES.ADMIN_ORDER_DETAILS, {
															id: order.id,
														}),
													)
												}
											>
												{order.status}
											</td>
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
