"use strict";
import { fetchAndRenderComments, exportEditButton } from "./api.js";
import { renderComments } from "./renderComments.js";
import { getListComments } from "./listComments.js";
import { comments } from "./api.js";

const listElement = document.getElementById("list");
const formElement = document.getElementById("form");
const buttonElement = document.getElementById("add-button");
const areaInputElement = document.getElementById("input-text-area");

export { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners };

fetchAndRenderComments();

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
				renderComments(listElement, getListComments);
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
			renderComments(listElement, getListComments);
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

renderComments(listElement, getListComments);

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

