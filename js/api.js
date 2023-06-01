const host = "https://webdev-hw-api.vercel.app/api/v2/arseniy-khal/comments";
const token = "Bearer 78cocs80asc06g6c68645g5k5o6g37k3cw3d03bo3ck3c03c4";

export function getComments() {
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

export function postComment({ text }) {
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

export function delComment({ id }) {
	return fetch(host + "/" + id, {
		method: "DELETE",
		headers: {
			Authorization: token,
		},
	})
};