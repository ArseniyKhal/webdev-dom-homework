import { renderComments } from "./renderComments.js";
import { convertData } from "./main.js";
import { getListComments } from "./listComments.js";

const listElement = document.getElementById("list");
const buttonElement = document.getElementById("add-button");
const nameInputElement = document.getElementById("input-text");
const areaInputElement = document.getElementById("input-text-area");
export let isPosting = false;

export let comments = [];
export { fetchAndRenderComments };


// Запрос в API (GET)
const fetchAndRenderComments = () => {
	fetch("https://webdev-hw-api.vercel.app/api/v1/arseniy-khal/comments", {
		method: "GET"
	})
		.then((response) => {
			return response.json();
		})
		.then((responseData) => {
			comments = responseData.comments.map((comment) => {
				isPosting = false;
				document.querySelector(".text-loading").style.display = "none";
				return {
					name: comment.author.name,
					dataComment: convertData(new Date(comment.date)),
					commentText: comment.text,
					likes: comment.likes,
					isLiked: false,
					isEdit: false,
				};
			});
			renderComments(listElement, getListComments);
		})
};


//Кнопка Написать
buttonElement.addEventListener('click', () => {
	let sendingAttempt = 0;
	isPosting = true;
	let currentDate = convertData(new Date())
	postComments();

	// Запись в API(POST)
	function postComments() {
		fetch("https://webdev-hw-api.vercel.app/api/v1/arseniy-khal/comments", {
			method: "POST",
			body: JSON.stringify({
				name: nameInputElement.value
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;")
					.replaceAll('"', "&quot;"),
				text: areaInputElement.value
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;")
					.replaceAll('"', "&quot;")
					.replaceAll("QUOTE_BEGIN", "<div class='quote'>")
					.replaceAll("QUOTE_END", "</div>")
					.replaceAll("NEW_LINE", "<br>"),
				date: currentDate,
				// forceError: true,
			})
		})
			.then((response) => {
				if (response.status === 500) {
					sendingAttempt++;
					if (sendingAttempt < 3) {
						postComments();
					} else {
						alert("Сервер не отвечает, попробуйте позже");
					}
					throw new Error("Сервер не отвечает");
				} else if (response.status === 400) {
					alert("Имя или текст короче 3 символов");
					nameInputElement.classList.add("error");
					areaInputElement.classList.add("error");
					throw new Error("Имя или текст короче 3 символов");
				} else {
					nameInputElement.classList.remove("error");
					areaInputElement.classList.remove("error");
					return response.json();
				}
			})
			.then(() => {
				return fetchAndRenderComments();
			})
			.then(() => {
				nameInputElement.value = '';
				areaInputElement.value = '';
				renderComments(listElement, getListComments);
			})
			.catch((error) => {
				console.warn(error);
			})
	}
});


//Редактирование комента кнопкой Редактировать
export function exportEditButton(index, comment) {
	comments[index] = comment;
	// postComments();
	//в этом месте не пойму как перезаписать переменную на сервере.
	//ведь существующий метод POST создает новый комментарий.
	//Здесь необходимо либо пользаваться другим методом, либо связку DELETE + POST.

}