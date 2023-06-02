import { loginUser } from "../api.js";

export function renderLoginComponent({ appEl, commentsHtml, requestListComments, setToken }) {
	let isLoginMode = true;

	const appHtml =
		`<!-- Список комментариев -->
	<ul class="comments" id="list">
	${commentsHtml}
</ul>
<p class="text-authorization">Что бы добавить комментарий, <a href="#" class="link-authorization" id="link-authorization">авторизуйтесь</a></p>`;

	document.querySelector(".text-loading").style.display = "none";
	appEl.innerHTML = appHtml;

	// нажатие кнопки ПЕРЕЙТИ К АВТОРИЗАЦИИ

	document.getElementById("link-authorization").addEventListener('click', () => {
		return renderForm();
	})

	const renderForm = () => {
		const appHtml =
			`<!-- Форма авторизации/входа -->
	<div class="login-form" id="form">
		<div class="login-form-body">
			<h3>Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
			${isLoginMode ? `` : `<input type="text" class="login-form-name" id="name-input" placeholder="Введите имя" />`}
			<input type="text" class="login-form-name" id="login-input" placeholder="Введите логин" />
			<input type="password" class="login-form-name" id="password-input" placeholder="Введите пароль" />
			<button class="login-form-button button" id="login-button">${isLoginMode ? 'Войти' : 'Зарегестрироваться'}</button>
			<a href="#" class="login-form-toggle">Перейти ${isLoginMode ? 'к регистрации' : 'ко входу'}</a>
		</div>
	</div>`;

		document.querySelector(".text-loading").style.display = "none";
		appEl.innerHTML = appHtml;


		// нажатие кнопки ВХОД/ЗАРАГЕСТРИРОВАТЬСЯ

		const loginButton = document.getElementById("login-button");
		const login = document.getElementById("login-input")
		const password = document.getElementById("password-input")
		loginButton.addEventListener('click', () => {

			if (!isLoginMode) {
				const name = document.getElementById("name-input")
				if (!name.value) {
					alert("Введите имя")
					name.classList.add("error");
					return;
				} else { name.classList.remove("error") }
			}
			if (!login.value) {
				alert("Введите логин");
				login.classList.add("error");
				return;
			} else { login.classList.remove("error") }
			if (!password.value) {
				alert("Введите пароль");
				password.classList.add("error");
				return;
			} else { password.classList.remove("error") }

			loginButton.disabled = true;
			loginButton.textContent = "Подождите";

			loginUser({
				login: login.value,
				name: name.value,
				password: password.value,
			}).then((user) => {
				setToken(`Bearer ${user.user.token}`);
				localStorage.setItem('token', `Bearer ${user.user.token}`);
				localStorage.setItem('userName', user.user.name);
			})
				.then(() => {
					requestListComments();
				})
				.catch(error => {
					alert(error.message);
				})
		})

		// нажатие кнопки toggle
		document.querySelector(".login-form-toggle").addEventListener('click', () => {
			isLoginMode = !isLoginMode;
			renderForm();
		})
	}
}