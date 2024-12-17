import { getWorks, deleteWork } from './api.js';
import { createModal, setupModal, displayProjectsInModal } from './modale.js';
export let projects = [];


export const storeProjects = async () => {
    try {
        projects = await getWorks();
        console.log("List des projets:", projects);
    } catch (error) {
        console.error("Error storing projects:", error.message);
    }
};


export const displayWorks = (categoryId = "all") => {
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
                    initDisplay();
                }
            }
        });
    });
};

function setupFilters() {
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
}

document.addEventListener("DOMContentLoaded", async () => {
    const projectsTitle = document.getElementById("projets");
    const filters = document.querySelector(".filters");
    const authBtn = document.getElementById("authBtn");

    if (localStorage.getItem("authToken")) {
        console.log("Utilisateur connecté.");
        if (filters) filters.classList.add("hidden");

        const modal = createModal();
        const { openModal } = setupModal(modal);

        const editButton = document.createElement("span");
        editButton.className = "edit-projects";
        editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;

        editButton.addEventListener("click", () => {
            displayProjectsInModal(modal, projects);
            openModal();
        });

        projectsTitle.appendChild(editButton);

        authBtn.textContent = "Logout";
        authBtn.href = "#";
        authBtn.addEventListener("click", () => {
            localStorage.removeItem("authToken");
            alert("Vous êtes déconnecté.");
            window.location.reload();
        });

    } else {
        console.log("Utilisateur non connecté.");
        if (filters) filters.classList.remove("hidden");
    }
});

const initDisplay = async () => {
    await storeProjects();
    displayWorks();
};
initDisplay();
setupFilters();