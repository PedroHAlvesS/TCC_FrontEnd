export default function OrderDetailsView({
	title,
	subtitle,
	order,
	onBack,
	profileHeader,
	successMessage,
	errorMessage,
	onClearError,
	onClearSuccess,
	assignmentSection,
}) {
	return (
		<>
			<div className="page-actions-row">
				<button type="button" className="secondary-button" onClick={onBack}>
					← Voltar
				</button>
			</div>

			<header className="dashboard-header" style={{ alignItems: "flex-start" }}>
				<div>
					<div className="dashboard-title">{title}</div>
					<div className="dashboard-subtitle">{subtitle}</div>
				</div>
				{profileHeader ? (
					<div className="profile-menu-container">{profileHeader}</div>
				) : null}
			</header>

			{successMessage && (
				<div className="success-banner">
					<span>{successMessage}</span>
					<button
						type="button"
						className="banner-close"
						onClick={onClearSuccess}
					>
						✕
					</button>
				</div>
			)}

			{errorMessage && (
				<div className="error-banner">
					<span>{errorMessage}</span>
					<button type="button" className="banner-close" onClick={onClearError}>
						✕
					</button>
				</div>
			)}

			<div className="order-details-grid">
				<section className="order-details-card">
					<div className="order-details-box">
						<div className="order-details-row">
							<div>
								<span className="order-details-label">Cliente</span>
								<div>{order.customerName}</div>
							</div>
							<div>
								<span className="order-details-label">Data do Pedido</span>
								<div>
									{new Date(order.creationDate).toLocaleString("pt-BR")}
								</div>
							</div>
						</div>

						<div className="order-details-row">
							<div>
								<span className="order-details-label">Descrição</span>
								<div>{order.description}</div>
							</div>
							<div>
								<span className="order-details-label">Status</span>
								<div>{order.status}</div>
							</div>
						</div>

						<div className="order-details-row">
							<div>
								<span className="order-details-label">Observação</span>
								<div>{order.observation || "Nenhuma observação informada"}</div>
							</div>
							<div>
								<span className="order-details-label">Complemento</span>
								<div>{order.complement || "Nenhum complemento informado"}</div>
							</div>
						</div>

						<div className="order-address-box">
							<div className="order-address-title">Endereço de Entrega</div>
							<div>
								{order.address.street}, {order.address.number}
							</div>
							<div>{order.address.neighborhood}</div>
							<div>{order.address.zipCode}</div>
							<div>{order.address.complement || "Sem complemento"}</div>
						</div>
					</div>
				</section>

				{assignmentSection ? (
					<section className="order-assign-card">
						<div className="order-assign-box">{assignmentSection}</div>
					</section>
				) : null}
			</div>
		</>
	);
}
