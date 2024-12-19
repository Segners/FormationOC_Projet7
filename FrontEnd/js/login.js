const urlLogin = "http://localhost:5678/api/users/login";

// ajout du gestionnaire d'event
document.getElementById("loginForm").addEventListener("submit", async function (event) {
event.preventDefault();
    
// Recup des valeurs email et mdp du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Preparation de l'envoie des donnnés pour se connecter
    const loginData = {
        email: email,
        password: password,
    };

    // Requete à L'API
    try {
        const response = await fetch(urlLogin, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        // Si ok
        if (response.ok) {
            // recupere la reponse
            const data = await response.json();
            // Stock le token d'auth
            localStorage.setItem("authToken", data.token);
            // Envoi sur la page pricipale
            window.location.href = "index.html";

        } else {
            alert(`Erreur : mot de passe ou adresse mail incorrect`);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
});




