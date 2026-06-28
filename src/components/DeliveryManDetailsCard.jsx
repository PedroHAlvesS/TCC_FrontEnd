export default function DeliveryManDetailsCard({
	deliveryMan,
	onEdit,
	onDelete,
}) {
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

	return (
		<div className="delivery-man-info-card">
			<div className="delivery-man-card-header">
				<div>
					<div className="dashboard-title">{deliveryMan.name}</div>
					<div className="dashboard-subtitle">Detalhes do entregador</div>
				</div>
				<div className="delivery-man-actions">
					<button type="button" className="secondary-button" onClick={onEdit}>
						Editar Entregador
					</button>
					<button
						type="button"
						className="secondary-button delete-button"
						onClick={onDelete}
					>
						Excluir Entregador
					</button>
				</div>
			</div>

			<div className="delivery-man-card-body">
				<div>
					<span className="order-details-label">E-mail</span>
					<div>{deliveryMan.email || "-"}</div>
				</div>
				<div>
					<span className="order-details-label">Telefone</span>
					<div>{formatPhone(deliveryMan.phoneNumber)}</div>
				</div>
				<div>
					<span className="order-details-label">Cadastrado em</span>
					<div>{formatDate(deliveryMan.createdAt)}</div>
				</div>
			</div>
		</div>
	);
}
