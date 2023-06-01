import { isPosting, comments } from "./main.js";
import { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners } from "./main.js";

const listElement = document.getElementById("list");
const formElement = document.getElementById("form");

//Рендер HTML
const renderComments = () => {
	const appEl = document.getElementById("app")
	const commentsHtml = comments.map((comment, index) => {
		return `<li class="comment" data-index="${index}" data-id="${comment.id}">
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

	const appHtml =
		`<!-- Форма авторизации -->
		<div class="login-form" id="form">
			<div class="login-form-body">
				<h3>Форма входа</h3>
				<input type="text" class="login-form-name" id="login-text" placeholder="Введите логин" />
				<input type="text" class="login-form-name" id="login-text" placeholder="Введите пароль" />
				<button class="login-form-button button" id="login-button">Войти</button>
				<a href="#" class="login-form-toggle">Зарегистрироваться</a>
			</div>
		</div>

		<div class="text-loading">Пожалуйста подождите, загружаю комментарии...</div>
		<ul class="comments" id="list">
			<!-- Список рендерится из JS -->
			${commentsHtml}
		</ul>
		<div class="add-form" id="form">
			<div class="add-form-body">
				<input type="text" class="add-form-name" id="input-text" placeholder="Введите ваше имя" />
				<textarea type="textarea" class="add-form-text" id="input-text-area" placeholder="Введите ваш коментарий"
					rows="4"></textarea>
				<div class="add-form-row">
					<button class="add-form-button button" id="add-button">Написать</button>
				</div>
			</div>
		</div>
		<div class="form-loading" style="display: none;">Коментарий добавляется...</div>
		<button class="del-form-button button" id="del-button">Удалить последний комментарий</button>`;

	appEl.innerHTML = appHtml;



	//Скрытие формы добавления при отправке комментария
	// if (isPosting) {
	// 	formElement.style.display = "none";
	// 	document.querySelector(".form-loading").style.display = "block";
	// } else {
	// 	formElement.style.display = "block";
	// 	document.querySelector(".form-loading").style.display = "none";
	// };

	initLikeButtonListeners();
	initEditButtonListeners();
	initResponsesListeners();



























};

export { renderComments };