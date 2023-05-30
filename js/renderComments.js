import { isPosting, comments, formElement } from "./main.js";
import { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners } from "./main.js";

const listElement = document.getElementById("list");

//Рендер HTML
const renderComments = () => {
	const commentsHtml = comments.map((comment, index) => {
		return `<li class="comment" data-index="${index}">
		<div class="comment-header">
			<div>${comment.name}</div>
			<div>${comment.dataComment}</div>
		</div>
		<div class="comment-body">
			<div class="comment-text ${comment.isEdit ? 'displayNone' : ''}">${comment.commentText} </div>
			<textarea type="textarea" class="add-form-text comment-textarea ${comment.isEdit ? '' : 'displayNone'}" rows="4" data-index="${index}">${comment.commentText}</textarea>
		</div>
		<div class="comment-footer">
			<button class="recommet-button button ${comment.isEdit ? 'active' : ''}" data-index="${index}">${comment.isEdit ? 'Сохранить' : 'Редактировать'}</button>
			<div class="likes">
				<span class="likes-counter">${comment.likes}</span>
				<button id="like-button" class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
			</div>
		</div>
	</li>`
	}).join("");

	listElement.innerHTML = commentsHtml;

	//Скрытие формы добавления при отправке комментария
	if (isPosting) {
		formElement.style.display = "none";
		document.querySelector(".form-loading").style.display = "block";
	} else {
		formElement.style.display = "block";
		document.querySelector(".form-loading").style.display = "none";
	};

	initLikeButtonListeners();
	initEditButtonListeners();
	initResponsesListeners();
};

export { renderComments };