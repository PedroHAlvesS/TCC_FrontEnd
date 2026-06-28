const TOKEN_KEY = "rapidoja_token";
const USER_EMAIL_KEY = "rapidoja_user_email";

export function setToken(token) {
	if (token == null) return;
	try {
		localStorage.setItem(TOKEN_KEY, token);
	} catch (e) {
		// ignore
	}
}

export function getToken() {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch (e) {
		return null;
	}
}

export function setUserEmail(email) {
	if (!email) return;
	try {
		localStorage.setItem(USER_EMAIL_KEY, email);
	} catch (e) {
		// ignore
	}
}

export function getUserEmail() {
	try {
		return localStorage.getItem(USER_EMAIL_KEY);
	} catch (e) {
		return null;
	}
}

export function isAuthenticated() {
	return !!getToken();
}

export function clearToken() {
	try {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_EMAIL_KEY);
	} catch (e) {
		// ignore
	}
}

export default {
	setToken,
	getToken,
	setUserEmail,
	getUserEmail,
	isAuthenticated,
	clearToken,
};
