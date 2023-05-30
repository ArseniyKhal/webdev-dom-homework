"use strict";
import { getComments, postComments } from "./api.js";
import { renderComments } from "./renderComments.js";

export { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners };
export const formElement = document.getElementById("form");
const buttonElement = document.getElementById("add-button");
const nameInputElement = document.getElementById("input-text");
const areaInputElement = document.getElementById("input-text-area");
export let comments = [];
export let isPosting = false;

// Получение списка комментариев с сервера (GET)
const requestListComments = () => {
	return getComments()
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
			renderComments();
		})
};
requestListComments();


//Кнопка Написать
buttonElement.addEventListener('click', () => {
	let sendingAttempt = 0;
	isPosting = true;
	let currentDate = convertData(new Date());
	entryComment();

	// Запись в API(POST)
	function entryComment() {
		return postComments({
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
		})
			.then((response) => {
				if (response.status === 500) {
					sendingAttempt++;
					if (sendingAttempt < 3) {
						entryComment();
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
				return requestListComments();
			})
			.then(() => {
				nameInputElement.value = '';
				areaInputElement.value = '';
				renderComments();
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















// конвертер даты
export const convertData = (date) => {
	return date.toLocaleDateString().slice(0, 6) + date.toLocaleDateString().slice(-2) + ' ' + date.toLocaleTimeString().slice(0, -3);
}

//Кнопка Like
const initLikeButtonListeners = () => {
	const likeButtonsElements = document.querySelectorAll(".like-button");
	for (const likeButtonElement of likeButtonsElements) {
		likeButtonElement.addEventListener('click', (event) => {
			event.stopPropagation();
			const comment = comments[likeButtonElement.dataset.index];
			likeButtonElement.classList.add("-loading-like");

			delay(2000).then(() => {
				comment.likes = comment.isLiked ? --comment.likes : ++comment.likes;
				comment.isLiked = !comment.isLiked;
				renderComments();
			});
		})
	}
}

function delay(interval = 300) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, interval);
	});
}

initLikeButtonListeners();

//Кнопка Редактировать
const initEditButtonListeners = () => {
	const editButtonsElements = document.querySelectorAll(".recommet-button");
	const commentTextareaElements = document.querySelectorAll(".comment-textarea");
	for (const editButtonElement of editButtonsElements) {
		editButtonElement.addEventListener('click', (event) => {

			event.stopPropagation();
			const index = editButtonElement.dataset.index;
			const comment = comments[index];
			for (const commentTextareaElement of commentTextareaElements) {
				const indexCom = commentTextareaElement.dataset.index;
				if (comment.isEdit && index === indexCom) {
					comment.commentText = commentTextareaElement.value;
					exportEditButton(index, comment);
				}
			}
			comment.isEdit = !comment.isEdit;
			renderComments();
		})
	}
}

initEditButtonListeners();

//Сценарий «Ответы на комментарии»
const initResponsesListeners = () => {
	const commentCardsElements = document.querySelectorAll(".comment");
	for (const commentCard of commentCardsElements) {
		commentCard.addEventListener("click", () => {
			const index = commentCard.dataset.index;
			areaInputElement.value = `QUOTE_BEGIN ${comments[index].name}:NEW_LINE${comments[index].commentText} QUOTE_END`;
		})
	}
}
initResponsesListeners();

renderComments();

//Ввод клавишей Enter
formElement.addEventListener('keyup', (ev) => {
	if (ev.keyCode === 13) {
		buttonElement.click();
	}
})

//Удаление последнего комментария
// const buttonDelElement = document.getElementById("del-button");
// buttonDelElement.addEventListener('click', () => {
// 	comments.pop()
// 	renderComments();
// })

