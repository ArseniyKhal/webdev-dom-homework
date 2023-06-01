import { login } from "../api.js";
export function renderLoginComponent({ appEl, commentsHtml, requestListComments, setToken }) {
	const appHtml =
		`<!-- Список комментариев -->
	<ul class="comments" id="list">
	${commentsHtml}
</ul>
<p class="text-authorization">Что бы добавить комментарий, <a href="#" class="link-authorization" id="link-authorization">авторизуйтесь</a></p>`;

	document.querySelector(".text-loading").style.display = "none";
	appEl.innerHTML = appHtml;
	document.getElementById("link-authorization").addEventListener('click', () => {


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
	</div>`;

		document.querySelector(".text-loading").style.display = "none";
		appEl.innerHTML = appHtml;
		document.getElementById("login-button").addEventListener('click', () => {

			login({
				login: "ArsHal",
				password: "987123",
			}).then((user) => {
				console.log(user);
				setToken(`Bearer ${user.user.token}`);
			})

			requestListComments();
		})

	})
}