import { getWorks, deleteWork } from './api.js';
import { createModal, setupModal, displayProjectsInModal } from './modale.js';

// Variable pour stocker les projets localement
export let projects = [];

// Fonction qui recupere les projets via getWorks et store dans le tableau projet
export const storeProjects = async () => {
    try {
        projects = await getWorks();
        console.log("List des projets:", projects);
    } catch (error) {
        console.error("Error storing projects:", error.message);
    }
};

// Fonction qui affiche les projets dans la galerie de la page principale du site
export const displayWorks = (categoryId = "all") => {
    // Recupere la galerie
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Operateur ternaire pour filtrer le travail, revient a faire un if else
    //const filteredWorks = categoryId === "all" ? projects : projects.filter(work => work.categoryId === parseInt(categoryId));

    let filteredWorks;

    if (categoryId === "all") 
    {
        filteredWorks = projects;
    } else 
    {
        filteredWorks = projects.filter(work => work.categoryId === parseInt(categoryId));
    }
    
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


// Creatiuon du bouton corbeille pour les projets de la modale
export const setupDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    // Définit l'icône de la corbeille pour chaque bouton
    deleteButtons.forEach((button) => {
        button.innerHTML = '<i class="fa-solid fa-trash-can fa-sm"></i>';
        // Ajoute un gestionnaire d'événement au clic pour chaque bouton
        button.addEventListener("click", async (event) => {

            // Récupère l'ID du projet à partir de l'attribut de données du bouton
            const projectId = event.target.closest(".delete-btn").dataset.id;
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
            if (confirmation) {
                // Si confirme, appelle la fonction deleteWork
                const isDeleted = await deleteWork(projectId);
                if (isDeleted) {
                    // Si la suppression est réussie, supprime l'élément HTML correspondant
                    const projectItem = event.target.closest(".project-item");
                    projectItem.remove();
                    initDisplay();
                }
            }
        });
    });
};

// Creation des filtres
function setupFilters() {
    const filterButtons = document.querySelectorAll(".filters button");
    // Parcourt chaque bouton de filtre
    for (let i = 0; i < filterButtons.length; i++) {
        const currentButton = filterButtons[i]; 

        // Ajoute un gestionnaire d'événement au clic pour chaque bouton
        currentButton.addEventListener("click", function() {
            // Supprime la classe "active" de tous les boutons
            for (let j = 0; j < filterButtons.length; j++) {
                filterButtons[j].classList.remove("active");
            }
            // Ajoute la classe "active" au bouton actuellement cliqué
            currentButton.classList.add("active");
            // Récupère l'ID de catégorie depuis l'attribut de données du bouton
            const categoryId = currentButton.getAttribute("data-category");
            // Appelle la fonction displayWorks pour afficher les projets de la categorie
            displayWorks(categoryId);
        });
    }
}

// Quand le HTML est completement chargé 
document.addEventListener("DOMContentLoaded", async () => {
    // Selectionnne les elements titres de la section projet, les filtres et le bouton pour se connecté
    const projectsTitle = document.getElementById("projets");
    const filters = document.querySelector(".filters");
    const authBtn = document.getElementById("authBtn");

    // Si l'utilisateur est connecté 
    if (localStorage.getItem("authToken")) {
        console.log("Utilisateur connecté.");
          // Afficher la bannière "mode édition"
          if (!document.querySelector(".editMode")) {
          
            const editMode = document.createElement("div")  
            const editModeDiv = document.createElement("div")
            editMode.className = "editMode"
            editModeDiv.className = "editModeDiv"
            editMode.innerHTML = '<i class="fa-regular fa-pen-to-square"></i><p>Mode édition</p>'
           
            document.body.prepend(editMode) 
            document.body.prepend(editModeDiv)
        }
        // Cache les filtres
        if (filters) filters.classList.add("hidden");

        // Création et setup de la modale de la modale
        const modal = createModal();
        const { openModal } = setupModal(modal);

        // Ajout du bouton pour modifier
        const editButton = document.createElement("span");
        editButton.className = "edit-projects";
        editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;

        // Gestionnaire d'evenemment quand on clic sur le bouton
        editButton.addEventListener("click", () => {
            //Ajout les projets dans la modale et ouvre
            displayProjectsInModal(modal, projects);
            openModal();
        });
        // Ajout du bouton
        projectsTitle.appendChild(editButton);

        // Modification du bouton pour se connecter
        authBtn.textContent = "Logout";
        authBtn.href = "#";
        authBtn.addEventListener("click", () => {
            // Supprime le tokken d'authentification
            localStorage.removeItem("authToken");
            alert("Vous êtes déconnecté.");
            // reload la page
            window.location.reload();
        });

    } else {
        console.log("Utilisateur non connecté.");
        const editModeBanner = document.querySelector(".editMode")
        const editModeBannerDiv = document.querySelector(".editMode")

        if (editModeBanner) {
            editModeBanner.remove()
            editModeBannerDiv.remove()

         }
        // Filtres affichés
        if (filters) filters.classList.remove("hidden");
    }
});

// Fonction qui attend que les projets soient dans la variable projects et ensuite les affichent grace a displayWork
const initDisplay = async () => {
    await storeProjects();
    displayWorks();
};

// Appel des fomctions
initDisplay();
setupFilters();