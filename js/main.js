"use strict";
import { getComments, postComment, delComment, likeComment } from "./api.js";
import { renderApp, token, } from "./renderApp.js";

export { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners };
export let comments = [];


// список багов:
// не работает отправка имени при регистрации
// лайки не доработаны (как изменять существующий комментарий??)
// не гаснет красная обводка поля ПАРОЛЬ при повторном вводе



// Получение списка комментариев с сервера (GET)
export const requestListComments = () => {
	return getComments({ token })
		.then((responseData) => {
			comments = responseData.comments.map((comment) => {
				return {
					name: comment.author.name,
					dataComment: convertData(new Date(comment.date)),
					commentText: comment.text,
					likes: comment.likes,
					isLiked: false,
					isEdit: false,
					id: comment.id,
				};
			});
			renderApp();

			if (!token) {
				return;
			}

			const buttonElement = document.getElementById("add-button");
			const areaInputElement = document.getElementById("input-text-area");
			const formElement = document.getElementById("form");

			//Кнопка Написать 
			buttonElement.addEventListener('click', () => {
				if (areaInputElement.value === '') {
					return areaInputElement.classList.add("error");
				}
				let sendingAttempt = 0;
				entryComment();

				// Отправка комментария (POST)
				function entryComment() {
					return postComment({
						token,
						text: areaInputElement.value
							.replaceAll("&", "&amp;")
							.replaceAll("<", "&lt;")
							.replaceAll(">", "&gt;")
							.replaceAll('"', "&quot;")
							.replaceAll("QUOTE_BEGIN", "<div class='quote'>")
							.replaceAll("QUOTE_END", "</div>")
							.replaceAll("NEW_LINE", "<br>"),
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
								alert("Текст короче 3 символов");
								areaInputElement.classList.add("error");
								throw new Error("Имя или текст короче 3 символов");
							} else if (response.status === 401) {
								alert("Вы не авторизованы");
								throw new Error("Нет авторизации");
							} else {
								areaInputElement.classList.remove("error");
								formElement.style.display = "none";
								document.querySelector(".form-loading").style.display = "block";
								return response.json();
							}
						})
						.then(() => {
							return requestListComments();
						})
						.then(() => {
							areaInputElement.value = '';
						})
						.catch((error) => {
							console.warn(error.message);
						})
				}
			});

			//Удаление последнего комментария (DELETE)
			const buttonDelElement = document.getElementById("del-button");
			buttonDelElement.addEventListener('click', () => {
				const id = comments[comments.length - 1].id;
				delComment({ id, token })
					.then(() => {
						return requestListComments();
					})
					.catch((error) => {
						console.warn(error);
					})
			})

			//Выход из аккаунта (кнопка ВЫХОД)
			const buttonExitElement = document.getElementById("exit-button");
			buttonExitElement.addEventListener('click', () => {
				localStorage.removeItem('token');
				localStorage.removeItem('userName');
				return renderApp();
			})
		})
		.catch((error) => {
			console.warn(error.message);
		})
};

requestListComments();

function removeLocalStorage() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
}




//Кнопка Like
const initLikeButtonListeners = () => {
	const likeButtonsElements = document.querySelectorAll(".like-button");
	for (const likeButtonElement of likeButtonsElements) {
		likeButtonElement.addEventListener('click', (event) => {
			event.stopPropagation();
			const id = comments[likeButtonElement.dataset.index].id;
			likeButtonElement.classList.add("-loading-like");
			likeComment({ id, token })
				.then((responseData) => {
					if (responseData.result.isLiked) { likeButtonElement.classList.add("-active-like") }
				})
				.then(() => {
					return requestListComments();
				})
		})
	}
}

// function delay(interval = 300) {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			resolve();
// 		}, interval);
// 	});
// }



//Ввод клавишей Enter (не работает)
// formElement.addEventListener('keyup', (ev) => {
// 	if (ev.keyCode === 13) {
// 		buttonElement.click();
// 	}
// });



//Редактирование комента кнопкой Редактировать (не работает)
export function exportEditButton(index, comment) {
	comments[index] = comment;
	// postComment();
	//в этом месте не пойму как перезаписать переменную на сервере.
	//ведь существующий метод POST создает новый комментарий.
	//Здесь необходимо либо пользаваться другим методом, либо связку DELETE + POST.
}


// конвертер даты
export const convertData = (date) => {
	return date.toLocaleDateString().slice(0, 6) + date.toLocaleDateString().slice(-2) + ' ' + date.toLocaleTimeString().slice(0, -3);
}

//Кнопка Редактировать (не работает)
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
			renderApp();
		})
	}
}

//Сценарий «Ответы на комментарии» (не работает)
const initResponsesListeners = () => {
	const commentCardsElements = document.querySelectorAll(".comment");
	for (const commentCard of commentCardsElements) {
		commentCard.addEventListener("click", () => {
			const index = commentCard.dataset.index;
			areaInputElement.value = `QUOTE_BEGIN ${comments[index].name}:NEW_LINE${comments[index].commentText} QUOTE_END`;
		})
	}
}



