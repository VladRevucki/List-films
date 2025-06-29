const form = document.querySelector("#film-form")
const filmTableBody = document.querySelector("#film-tbody")
const inputTitle = document.querySelector("#input__title")
const inputGenre = document.querySelector("#input__genre")
const inputReleaseYear = document.querySelector("#input__releaseYear")
const selectFilter = document.querySelector("#select__filter")

function handleFormSubmit(e) {
	e.preventDefault()

	const title = document.getElementById("title").value
	const genre = document.getElementById("genre").value
	const releaseYear = document.getElementById("releaseYear").value
	const isWatched = document.getElementById("isWatched").checked

	const film = {
		title: title,
		genre: genre,
		releaseYear: releaseYear,
		isWatched: isWatched,
	}

	addFilm(film)
}

async function addFilm(film) {
	await fetch("https://sb-film.skillbox.cc/films", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: "ovikdevil@gmail.com",
		},
		body: JSON.stringify(film),
	})
	renderTable()
}

async function renderTable(filters = {}) {
	const queryParams = new URLSearchParams(filters).toString()
	const filmsResponse = await fetch(
		`https://sb-film.skillbox.cc/films?${queryParams}`,
		{
			headers: {
				email: "ovikdevil@gmail.com",
			},
		}
	)
	const films = await filmsResponse.json()

	filmTableBody.innerHTML = ""

	films.forEach((film, index = film.id) => {
		const row = document.createElement("tr")
		row.setAttribute("data-id", index)
		row.innerHTML = `
      <td>${film.title}</td> 
      <td>${film.genre}</td>
      <td>${film.releaseYear}</td>
      <td>${film.isWatched ? "Да" : "Нет"}</td>
      <td><button class='deleteBtn'>Удалить</button></td>
    `
		filmTableBody.appendChild(row)
	})
	resetForm()
}

function resetForm() {
	form.reset()
}

// Фильтрация
function applyFilters() {
	const filters = {}
	if (inputTitle.value) filters.title = inputTitle.value
	if (inputGenre.value) filters.genre = inputGenre.value
	if (inputReleaseYear.value) filters.releaseYear = inputReleaseYear.value
	if (selectFilter.value === "isWatched") filters.isWatched = true

	renderTable(filters)
}

// Удалить
filmTableBody.addEventListener("click", async function (e) {
	if (e.target.classList.contains("deleteBtn")) {
		const row = e.target.closest("tr")
		const id = +row.getAttribute("data-id")

		await fetch(`https://sb-film.skillbox.cc/films/${id}`, {
			method: "DELETE",
			headers: {
				email: "ovikdevil@gmail.com",
			},
		})
		if (confirm("Удалить из списка?")) row.remove()
	}
})

// Удалить все
async function deleteAllFilm() {
	if (confirm("Вы уверены, что хотите удалить все фильмы?")) {
		const response = await fetch("https://sb-film.skillbox.cc/films", {
			method: "DELETE",
			headers: {
				email: "ovikdevil@gmail.com",
			},
		})
		if (response.ok) {
			renderTable()
		}
	}
}

document.querySelector(".deleteAllBtn").addEventListener("click", deleteAllFilm)

inputTitle.addEventListener("input", applyFilters)
inputGenre.addEventListener("input", applyFilters)
inputReleaseYear.addEventListener("input", applyFilters)
selectFilter.addEventListener("change", applyFilters)

form.addEventListener("submit", handleFormSubmit)

// Display films on load
renderTable()

const validator = new JustValidate("#film-form")

validator
	.addField("#title", [
		{
			rule: "required",
			errorMessage: "Введите название",
		},
	])
	.addField("#genre", [
		{
			rule: "required",
			errorMessage: "Введите жанр",
		},
	])
	.addField("#releaseYear", [
		{
			rule: "required",
			errorMessage: "Введите год",
		},
		{
			rule: "number",
			errorMessage: "Вводите только числа",
		},
	])
