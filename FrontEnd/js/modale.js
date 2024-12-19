import { getCategories, addProject,  } from "./api.js";
import {setupDeleteButtons,displayWorks, projects } from "./script.js";

// Creation de la modale principale galerie
export function createModal() 
{
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.classList.add("modal", "hidden");

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modal-wrapper");

    // Bouton de fermeture
    const closeBtn = document.createElement("span");
    closeBtn.classList.add("modal-close");
    closeBtn.innerHTML = "&times;";

    // Titre de la modal
    const title = document.createElement("h2");
    title.classList.add("modal-title");
    title.textContent = "Galerie photo";

    // Liste des projets
    const projectList = document.createElement("div");
    projectList.id = "project-list";
    projectList.classList.add("project-list");

    const separator = document.createElement('hr')
    const addButton = document.createElement('button')
    addButton.classList.add('modal-btn')
    addButton.textContent = 'Ajouter une photo'

    // Ajout des éléments dans le wrapper
    modalWrapper.appendChild(closeBtn);
    modalWrapper.appendChild(title);
    modalWrapper.appendChild(projectList);
    modalWrapper.appendChild(separator)
    modalWrapper.appendChild(addButton)

    // Ajout du wrapper dans la modal
    modal.appendChild(modalWrapper);

    // Ajout de la modal au DOM
    document.body.appendChild(modal);

    const { closeModal } = setupModal(modal);

    // Gestion de l'ouverture de la modal d'ajout
    addButton.addEventListener("click", () => {
        openAddPhotoModal(modal);
        closeModal();
    });

    return modal;
}

// Fonction qui affiche la modale qui permet d'ajouter des Photos
export async function openAddPhotoModal(galleryModal) 
{
    // ferme la modale galerie
    const { closeModal } = setupModal(galleryModal);
    closeModal();

    const addPhotoModal = document.createElement("div");
    addPhotoModal.id = "add-photo-modal";
    addPhotoModal.classList.add("modal", "hidden");

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modal-wrapper");

    const closeBtn = document.createElement("span");
    closeBtn.classList.add("modal-close");
    closeBtn.innerHTML = "&times;";

    const backBtn = document.createElement("span");
    backBtn.classList.add("back-btn");
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>'; 
    

    const form = document.createElement("form");
    form.classList.add("modal-form");

    const uploadSection = document.createElement("div");
    uploadSection.classList.add("upload-section");

    // Icône de téléchargement
    const placeholderIcon = document.createElement("i");
    placeholderIcon.classList.add("fa-solid", "fa-image", "placeholder-icon");

    // Bouton de téléchargement
    const uploadLabel = document.createElement("label");
    uploadLabel.classList.add("upload-button");
    uploadLabel.textContent = "Ajouter une image";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "image";
    fileInput.classList.add("file-input");
    fileInput.accept = "image/*";

    uploadLabel.appendChild(fileInput);

    // Informations sur le fichier
    const fileInfo = document.createElement("p");
    fileInfo.classList.add("file-info");
    fileInfo.textContent = "jpg, png : max 4 Mo";

    // Image de prévisualisation
    const previewImage = document.createElement("img");
    previewImage.classList.add("preview-image");
    previewImage.style.display = "none";

    // Ajout des éléments dans la section
    uploadSection.appendChild(placeholderIcon);
    uploadSection.appendChild(uploadLabel);
    uploadSection.appendChild(fileInfo);
    uploadSection.appendChild(previewImage);

    // Champs de saisie pour le titre
    const titleGroup = document.createElement("div");
    titleGroup.classList.add("form-group");

    // Création de l'élément label
    const titleLabel = document.createElement("label");
    titleLabel.classList.add("form-label");
    titleLabel.textContent = "Titre";

    // Création de l'élément input
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.classList.add("form-input");
    titleInput.placeholder = "";
    titleInput.required = true;

    //label et de l'input à la div form-group
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);


    const categoryGroup = document.createElement("div");
    categoryGroup.classList.add("form-group");

    const categoryLabel = document.createElement("label");
    categoryLabel.classList.add("form-label");
    categoryLabel.textContent = "Catégorie";

    const categorySelect = document.createElement("select");
    categorySelect.name = "category";
    categorySelect.classList.add("form-select");
    categorySelect.required = true;

    //option vide par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";
    defaultOption.selected = true;
    categorySelect.appendChild(defaultOption);

    // Charger les catégories
    try {
        const categories = await getCategories();
        // parcours les categories et creer une option pour chaque categorie avec son id et le nom
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
    }
    // ajoute le label a la categorie et ajoute la liste au groupe
    categoryGroup.appendChild(categoryLabel);
    categoryGroup.appendChild(categorySelect);

    const separator = document.createElement('hr')

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Valider";
    submitButton.classList.add("modal-btn");

    form.appendChild(uploadSection);
    form.appendChild(titleGroup);
    form.appendChild(categoryGroup);
    form.appendChild(separator);
    form.appendChild(submitButton);

    modalWrapper.appendChild(backBtn); 
    modalWrapper.appendChild(closeBtn); 

    modalWrapper.appendChild(form);

    addPhotoModal.appendChild(modalWrapper);
    document.body.appendChild(addPhotoModal);

    addPhotoModal.classList.remove("hidden");

    // Configure la fonction closeModal pour la modale d'ajout de photo
    const { closeModal: closeAddPhotoModal } = setupModal(addPhotoModal);
  
    closeBtn.addEventListener("click", () => {
        closeAddPhotoModal();
        //galleryModal.classList.remove("hidden"); 
    });
    backBtn.addEventListener("click", () => {
        closeAddPhotoModal();
        galleryModal.classList.remove("hidden"); 
    });
    // Ajoute un gestionnaire d'événements pour la soumission du formulaire
    form.addEventListener("submit", async (event) => {
        // Empêche le comportement par défaut du formulaire
        event.preventDefault();

        // Récupère les données du formulaire
        const formData = new FormData(form);
        const fileInput = form.querySelector(".file-input");
        const categorySelect = form.querySelector(".form-select");
    
        // Vérifie si le fichier ou la catégorie n'est pas rempli
        if (!fileInput.files[0] || !categorySelect.value) {
            alert("Veuillez remplir tous les champs !");
            return;
        }
    
        try {
            // Tente de soumettre les données du formulaire
            const response = await addProject(formData);
            //les données du nouveau projet ajouté
            const newProject = await response.json(); 
    
            // Mettre à jour la liste des projets
            projects.push(newProject);
    
            // Mettre à jour les galeries
            displayWorks();
            //modal principale
            const galleryModal = document.querySelector("#modal"); 
            displayProjectsInModal(galleryModal, projects); 
    
            // Reset le formulaire
            form.reset();
            previewImage.style.display = "none";
            uploadSection.classList.remove("hidden-upload");
            alert("Projet ajouté avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            alert("Une erreur s'est produite lors de l'ajout du projet.");
        }
    });
    
    // Previsualisation de l'image
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            // Crée un lecteur de fichier
            const reader = new FileReader();
            reader.onload = () => {

                previewImage.src = reader.result;
                previewImage.style.display = "block";
                uploadSection.classList.add("hidden-upload");
            };
            // lit le fichier comme une URL
            reader.readAsDataURL(file);
        } else {
 
            previewImage.style.display = "none";
            uploadSection.classList.remove("hidden-upload");
        }
    });
}

// Fonction qui setup le comportement de la modale
export function setupModal(modal) 
{
    const closeModalButton = modal.querySelector(".modal-close");

    // ouverture de la modale
    const openModal = async () => {
        try {
            modal.classList.remove("hidden");
            modal.classList.add("visible");
        } catch (error) {
            console.error("Erreur lors de l'ouverture de la modal :", error);
            alert("Une erreur est survenue lors de l'ouverture de la modale.");
        }
    };
    // fermeture de la modale
    const closeModal = () => {
        modal.classList.remove("visible");
        modal.classList.add("hidden");
    };

    // ajout gestionnaire event
    closeModalButton.addEventListener("click", closeModal);


    // Ajoute un gestionnaire d'événement au clic sur la modale.
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    // fermeture touche echap
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("visible")) {
            closeModal();
        }
    });

    return { openModal, closeModal };
}

// Fonction qui affiche les projets dans la modale
export function displayProjectsInModal(modal, projects) 
{
    console.log("Projets affichés dans la modale :", projects);
    const projectList = modal.querySelector("#project-list");

    projectList.innerHTML = "";
    // parcours la liste dse projet et ajoute a la modale l'image et bouton
    projects.forEach(project => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");

        const projectImage = document.createElement("img");
        projectImage.src = project.imageUrl;
        projectImage.alt = project.title;
        projectImage.classList.add("project-image");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.dataset.id = project.id;
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can fa-sm"></i>';

        projectItem.appendChild(projectImage);
        projectItem.appendChild(deleteButton);
        projectList.appendChild(projectItem);
    });

    setupDeleteButtons();
}



