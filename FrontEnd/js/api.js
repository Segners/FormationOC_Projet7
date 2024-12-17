const urlAPIProjects = "http://localhost:5678/api/works";
const urlAPICategories = "http://localhost:5678/api/categories";

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
        

        console.log("Projet supprimé avec succès.");
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression :", error.message);
        throw error;
    }
};