import { getToken } from "./auth";

export async function updateAdminProfile(profileData) {
	const token = getToken();
	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admins`, {
		method: "PUT",
		headers: token
			? {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				}
			: {},
		body: JSON.stringify(profileData),
	});

	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.message || "Erro ao atualizar perfil de admin");
	}

	return res.json().catch(() => null);
}

export default { updateAdminProfile };
