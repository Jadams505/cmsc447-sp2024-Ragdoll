const loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", (e) => 
{
	const playerName = document.getElementById("name");
	sessionStorage.setItem("JetName", playerName.value);
});