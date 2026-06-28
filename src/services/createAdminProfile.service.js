import { getToken } from "./auth";

export async function createAdminProfile(profileData) {
	const token = getToken();
	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admins`, {
		method: "POST",
		headers: token
			? {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				}
			: { "Content-Type": "application/json" },
		body: JSON.stringify(profileData),
	});

	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.message || "Erro ao criar perfil de admin");
	}

	return res.json().catch(() => null);
}

export default { createAdminProfile };
