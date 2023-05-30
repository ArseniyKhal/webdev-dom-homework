// import { isPosting } from "./main.js";
import { isPosting } from "./api.js";
import { comments } from "./api.js";
import { initResponsesListeners, initLikeButtonListeners, initEditButtonListeners } from "./main.js";

const formElement = document.getElementById("form");

//Рендер HTML
const renderComments = (element, getListComments) => {
	const commentsHtml = comments.map((comment, index) => getListComments(comment, index)).join("");

	element.innerHTML = commentsHtml;

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