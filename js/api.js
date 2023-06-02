const host = "https://webdev-hw-api.vercel.app/api/v2/arseniy-khal/comments";
const hostLogin = "https://wedev-api.sky.pro/api/user";

// получение списка комментариев
export function getComments({ token }) {
	return fetch(host, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {
			if (response.status === 500) {
				alert("Сервер не отвечает, попробуйте позже");
				throw new Error("Сервер не отвечает");
			}
			return response.json()
		})
};

// отправка комментария
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

// удаление комментария
export function delComment({ id, token }) {
	return fetch(host + "/" + id, {
		method: "DELETE",
		headers: {
			Authorization: token,
		},
	})
};

// лайк комментария
export function likeComment({ id, token }) {
	return fetch(host + "/" + id + "/toggle-like", {
		method: "POST",
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {
			return response.json()
		})
};

//https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md
// авторизация
export function loginUser({ login, password }) {
	console.log('авторизация:    ' + 'login:' + login + "   " + 'name:' + name + "   " + 'password:' + password);
	return fetch(hostLogin + '/login', {
		method: "POST",
		body: JSON.stringify({
			login,
			password,
		}),
	}).then((response) => {
		if (response.status === 400) {
			throw new Error("Неверный логин или пароль")
		}
		return response.json()
	});
};

// регистрация
export function registrationUser({ login, name, password }) {
	console.log('регистрация:    ' + 'login:' + login + "   " + 'name:' + name + "   " + 'password:' + password);
	return fetch(hostLogin, {
		method: "POST",
		body: JSON.stringify({
			login,
			name,
			password,
		}),
	}).then((response) => {
		if (response.status === 400) {
			throw new Error("Пользователь с таким логином уже сущетсвует")
		}
		return response.json()
	});
};