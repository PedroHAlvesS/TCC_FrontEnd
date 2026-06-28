export default function ProfileEditForm({
	title,
	subtitle,
	email,
	phone,
	password,
	showPassword,
	onEmailChange,
	onPhoneChange,
	onPasswordChange,
	onTogglePassword,
	onSave,
	onCancel,
	onClearSuccess = () => {},
	onClearError = () => {},
	saving,
	successMessage,
	errorMessage,
	buttonLabel = "Salvar Alterações",
}) {
	return (
		<section className="edit-profile-card">
			{successMessage && (
				<div className="success-banner">
					<span>{successMessage}</span>
					<button className="banner-close" onClick={onClearSuccess}>
						×
					</button>
				</div>
			)}
			{errorMessage && (
				<div className="error-banner">
					<span>{errorMessage}</span>
					<button className="banner-close" onClick={onClearError}>
						×
					</button>
				</div>
			)}

			<div className="edit-profile-icon">A</div>
			<h2>{title}</h2>
			{subtitle && <p className="subtitle">{subtitle}</p>}
			<div className="edit-profile-form">
				<label>
					E-mail
					<input
						type="email"
						value={email}
						onChange={(event) => onEmailChange(event.target.value)}
						placeholder="Digite seu novo email"
					/>
				</label>
				<label>
					Telefone
					<input
						type="text"
						value={phone}
						onChange={(event) => onPhoneChange(event.target.value)}
						placeholder="Digite seu novo telefone"
					/>
				</label>
				<label>
					Senha
					<div className="password-field">
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(event) => onPasswordChange(event.target.value)}
							placeholder="Digite sua nova senha"
						/>
						<button
							type="button"
							className="toggle-password"
							onClick={onTogglePassword}
						>
							{showPassword ? "🙈" : "👁️"}
						</button>
					</div>
				</label>
				<div className="edit-profile-actions">
					<button type="button" className="secondary-button" onClick={onCancel}>
						Voltar
					</button>
					<button
						type="button"
						className="primary-button"
						onClick={onSave}
						disabled={saving}
						style={{
							opacity: saving ? 0.7 : 1,
							cursor: saving ? "not-allowed" : "pointer",
						}}
					>
						{saving ? "Salvando..." : buttonLabel}
					</button>
				</div>
			</div>
		</section>
	);
}
