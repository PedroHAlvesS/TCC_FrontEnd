export default function LoginComponent({
	title,
	email,
	password,
	error,
	onEmailChange,
	onPasswordChange,
	onSubmit,
	showRegisterLink = false,
	onRegisterClick,
}) {
	return (
		<div className="page-shell">
			<header className="page-header">
				<span className="lock-icon">🚚</span>
				<h1>RapidoJá</h1>
			</header>
			<main className="login-container">
				<div className="login-card">
					<h2>{title}</h2>
					<p className="subtitle">Entre com seu e-mail e senha</p>
					<form onSubmit={onSubmit} className="login-form">
						<label>
							E-mail
							<input
								type="email"
								value={email}
								onChange={onEmailChange}
								placeholder="seu@email.com"
								required
							/>
						</label>
						<label>
							Senha
							<input
								type="password"
								value={password}
								onChange={onPasswordChange}
								placeholder="Digite sua senha"
								required
							/>
						</label>
						{error && <div className="error-message">{error}</div>}
						<button type="submit" className="submit-button">
							Entrar
						</button>
					</form>
					{showRegisterLink && (
						<p className="register-link">
							Não tem conta?{" "}
							<a href="#" className="link-button" onClick={onRegisterClick}>
								Crie sua conta
							</a>
						</p>
					)}
					<footer className="login-footer">2026 RapidoJá.</footer>
				</div>
			</main>
		</div>
	);
}
