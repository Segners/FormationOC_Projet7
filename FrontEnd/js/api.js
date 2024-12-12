import { createModal, setupModal,displayProjectsInModal  } from "./modale.js";

const urlAPIProjects = "http://localhost:5678/api/works";
const urlAPICategories = "http://localhost:5678/api/categories";

export let projects = [];

export const getWorks = async () => {
    try {
        const response = await fetch(urlAPIProjects);
        const works = await response.json();
        console.log("Works data:", works); 
        return works;
    } catch (error) {
        console.error("Error:", error.message);
    }
};

export const getCategories = async () => {
    try {
        const response = await fetch(urlAPICategories);
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Error:", error.message);
    }
};

export const addProject = async (formData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            throw new Error("Utilisateur non authentifié");
        }

        const response = await fetch(urlAPIProjects, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.text(); 
            throw new Error(`Erreur lors de l'ajout du projet: ${errorDetails}`);
        }

        console.log("Projet ajouté avec succès.");
        return response; 
    } catch (error) {
        console.error("Erreur dans addProject :", error);
        throw error; 
    }
};


export const deleteWork = async (id) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            throw new Error("Utilisateur non authentifié");
        }

        const response = await fetch(`${urlAPIProjects}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur API :", errorText);
            throw new Error("Erreur lors de la suppression du projet.");
        }

        // Rafraîchir les projets à partir de l'API
        await storeProjects(); // Maj lle tableau

        console.log("Projets après resynchronisation :", projects);

        // Rafraîchir la galerie principale
        initDisplay(); 

        // Rafraîchir la modal
        const modal = document.querySelector("#modal");
        if (modal) {
            displayProjectsInModal(modal, projects); // Utilise la nouvelle version des projets
            setupDeleteButtons();
        }

        alert("Projet supprimé avec succès !");
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression :", error.message);
        alert("Impossible de supprimer le projet. Veuillez réessayer plus tard.");
        return false;
    }
};


export const setupDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.innerHTML = '<i class="fa-solid fa-trash-can fa-sm"></i>';

        button.addEventListener("click", async (event) => {
            const projectId = event.target.closest(".delete-btn").dataset.id;
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
            if (confirmation) {
                const isDeleted = await deleteWork(projectId);
                if (isDeleted) {
                    const projectItem = event.target.closest(".project-item");
                    projectItem.remove();
                }
            }
        });
    });
};

const storeProjects = async () => {
    try {
        projects = await getWorks();
        console.log("Projects stored locally:", projects);
    } catch (error) {
        console.error("Error storing projects:", error.message);
    }
};

export const displayWorks = (categoryId = "all") => 
{
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";


    const filteredWorks = categoryId === "all" 
        ? projects 
        : projects.filter(work => work.categoryId === parseInt(categoryId));

    
    for (const work of filteredWorks) {
        const workElement = document.createElement("div");
        workElement.classList.add("work");
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}" />
            <p>${work.title}</p>
        `;
        gallery.appendChild(workElement);
    }
};

function setupFilters() 
{
    const filterButtons = document.querySelectorAll(".filters button");
    for (let i = 0; i < filterButtons.length; i++) {
        const currentButton = filterButtons[i];

        currentButton.addEventListener("click", function() {
        for (let j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
        }
            currentButton.classList.add("active");
            const categoryId = currentButton.getAttribute("data-category");
            displayWorks(categoryId);
        });
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const projectsTitle = document.getElementById("projets");
    const filters = document.querySelector(".filters");
    const authBtn = document.getElementById("authBtn");

    // Vérifier si l'utilisateur est authentifié
    if (localStorage.getItem("authToken")) {
        console.log("Utilisateur connecté.");

        if (filters) {
            filters.classList.add("hidden");
        }

        // Créer la modal
        const modal = createModal();
        const { openModal } = setupModal(modal);

        // Créer le bouton "Modifier" et l'ajouter au DOM
        const editButton = document.createElement("span");
        editButton.className = "edit-projects";
        editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;

        editButton.addEventListener("click", () => {
            // Afficher les projets stockés dans la modal
            displayProjectsInModal(modal, projects);//  Utilise le tableau
            openModal();
        });

        projectsTitle.appendChild(editButton);

        // Configuration du bouton de déconnexion
        authBtn.textContent = "Logout";
        authBtn.href = "#";
        authBtn.addEventListener("click", () => {
            localStorage.removeItem("authToken");
            alert("Vous êtes déconnecté.");
            window.location.reload();
        });

    } else {
        console.log("Utilisateur non connecté.");
        if (filters) {
            filters.classList.remove("hidden");
        }
    }
});

const initDisplay = async () => {
    await storeProjects();
    displayWorks();
};

initDisplay();
<<<<<<< HEAD
setupFilters();
=======
setupFilters();
>>>>>>> 10ec87ddde594176302cdb17eb9023cbbc9d261c
