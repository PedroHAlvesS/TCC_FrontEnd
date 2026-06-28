import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminProfile } from "../../services/adminDashboard.service";
import { clearToken, setUserEmail } from "../../services/auth";
import Sidebar from "../../components/Sidebar";
import { updateAdminProfile } from "../../services/editAdminProfile.service";
import { validateProfile } from "../../utils/validators";
import ProfileEditForm from "../../components/ProfileEditForm";
import { ROUTES } from "../../routes/ROUTES";

export default function AdminEditProfilePage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [saving, setSaving] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	async function handleEditProfile() {
		setSaving(true);
		setErrorMessage("");
		setSuccessMessage("");
		// validate email and phone; password validated only if provided
		const { valid, errors } = validateProfile({ email, phone, password });
		if (!valid) {
			const first = errors.email || errors.phone || errors.password;
			setErrorMessage(first);
			setSaving(false);
			return;
		}
		try {
			const payload = {
				email: email || null,
				phoneNumber: phone || null,
				password: password || null,
			};
			await updateAdminProfile(payload);
			setSuccessMessage(
				"Alterado com sucesso. Você será deslogado em 2 segundos...",
			);

			window.setTimeout(() => {
				handleLogout();
			}, 2000);
		} catch (err) {
			setErrorMessage(err?.message || "Erro ao salvar alterações");
		} finally {
			setSaving(false);
		}
	}

	function handleLogout() {
		clearToken();
		navigate(ROUTES.ADMIN_LOGIN, { replace: true });
	}

	if (loading) {
		return (
			<div className="page-shell dashboard-shell">
				<div className="dashboard-main" style={{ padding: 24 }}>
					<h2>Carregando...</h2>
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
			<div className="dashboard-main">
				<section className="edit-profile-card">
					{successMessage && (
						<div className="success-banner">
							<span>{successMessage}</span>
							<button
								className="banner-close"
								onClick={() => setSuccessMessage("")}
							>
								×
							</button>
						</div>
					)}
					{errorMessage && (
						<div className="error-banner">
							<span>{errorMessage}</span>
							<button
								className="banner-close"
								onClick={() => setErrorMessage("")}
							>
								×
							</button>
						</div>
					)}

					<div className="edit-profile-icon">A</div>
					<h2>rapidoJá</h2>
					<div className="edit-profile-form">
						<label>
							E-mail
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="Digite seu novo e-mail"
							/>
						</label>
						<label>
							Telefone
							<input
								type="text"
								value={phone}
								onChange={(event) => setPhone(event.target.value)}
								placeholder="Digite seu novo telefone"
							/>
						</label>
						<label>
							Senha
							<div className="password-field">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									placeholder="Digite sua nova senha"
								/>
								<button
									type="button"
									className="toggle-password"
									onClick={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? "🙈" : "👁️"}
								</button>
							</div>
						</label>
						<div className="edit-profile-actions">
							<button
								type="button"
								className="primary-button"
								onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
							>
								Voltar para o Dashboard
							</button>
							<button
								type="button"
								className="primary-button"
								onClick={handleEditProfile}
								disabled={saving}
								style={{
									opacity: saving ? 0.7 : 1,
									cursor: saving ? "not-allowed" : "pointer",
								}}
							>
								{saving ? "Salvando..." : "Salvar Alterações"}
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
