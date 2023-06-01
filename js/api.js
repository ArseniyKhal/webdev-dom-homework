const host = "https://webdev-hw-api.vercel.app/api/v2/arseniy-khal/comments";
const hostLogin = "https://wedev-api.sky.pro/api/user/login";


export function getComments({ token }) {
	return fetch(host, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {
			if (response.status === 401) {
				throw new Error("Нет авторизации")
			}
			return response.json()
		})
};

export function postComment({ token, text }) {
	return fetch(host, {
		method: "POST",
		body: JSON.stringify({
			text,
		}),
		headers: {
			Authorization: token,
		},
	})
};

export function delComment({ id, token }) {
	return fetch(host + "/" + id, {
		method: "DELETE",
		headers: {
			Authorization: token,
		},
	})
};

//https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md
export function login({ login, password }) {
	return fetch(hostLogin, {
		method: "POST",
		body: JSON.stringify({
			login,
			password,
		}),
	}).then((response) => {
		if (response.status === 400) {
			alert("Логин или пароль неверный")
			throw new Error("Логин или пароль неверный")
		}
		return response.json()
	});
};