const urlLogin = "http://localhost:5678/api/users/login";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = {
        email: email,
        password: password,
    };

    try {
        const response = await fetch(urlLogin, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const data = await response.json();

            localStorage.setItem("authToken", data.token);
            window.location.href = "index.html";

        } else {
            const errorData = await response.json();
            alert(`Erreur : mot de passe ou adresse mail incorrect`);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
});




