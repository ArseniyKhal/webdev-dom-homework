import { isPosting, comments } from "./main.js";
import { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners, requestListComments } from "./main.js";
import { renderLoginComponent } from "./components/login-component.js"
export let token = null;

//Рендер HTML
export const renderApp = () => {
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
			<button class="recommet-button button ${comment.isEdit ? 'active' : ''} ${token ? '' : 'displayNone'}" data-index="${index}">${comment.isEdit ? 'Сохранить' : 'Редактировать'}</button>
			<div class="likes">
				<span class="likes-counter">${comment.likes}</span>
				<button id="like-button" class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
			</div>
		</div>
	</li>`
	}).join("");

	// рендер для НЕ авторизованных (меня регистрации и авторизации)
	if (!token) {
		renderLoginComponent({
			appEl, commentsHtml, requestListComments, setToken: (newToken) => {
				token = newToken;
			}
		})
		return;
	}

	// рендер для авторизованных
	const appHtml =
		`<!-- Список комментариев с авторизацией -->
				<ul class="comments" id="list">
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

	document.querySelector(".text-loading").style.display = "none";
	appEl.innerHTML = appHtml;

	//Скрытие формы добавления при отправке комментария (не работает)
	const formElement = document.getElementById("form");
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
