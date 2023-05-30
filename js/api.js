


export function getComments() {
	return fetch("https://webdev-hw-api.vercel.app/api/v1/arseniy-khal/comments", {
		method: "GET"
	})
		.then((response) => {
			return response.json()
		})
};

export function postComments({ name, text, date }) {
	return fetch("https://webdev-hw-api.vercel.app/api/v1/arseniy-khal/comments", {
		method: "POST",
		body: JSON.stringify({
			name,
			text,
			date,
			// forceError: true,
		})
	})
};

