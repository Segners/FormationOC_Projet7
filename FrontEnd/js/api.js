const urlAPIProjects = "http://localhost:5678/api/works";
const urlAPICategories = "http://localhost:5678/api/categories";

const getWorks = async () => {
    try {
        const response = await fetch(urlAPIProjects);
        const works = await response.json();
        console.log("Works data:", works); 
        return works;
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const getCategories = async () => {
    try {
        const response = await fetch(urlAPICategories);
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const displayWorks = async (categoryId = "all") => {
    const works = await getWorks();
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    let filteredWorks;

    // Ternaire
    /*
        const filteredWorks = categoryId === "all" 
        ? works 
        : works.filter(work => work.categoryId === parseInt(categoryId));
    */

    if (categoryId === "all") 
    {
        filteredWorks = works;
    } else 
    {
        filteredWorks = works.filter(work => work.categoryId === parseInt(categoryId));
    }

    for (const work of filteredWorks) 
    {
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

document.addEventListener("DOMContentLoaded", () => 
{
    const authBtn = document.getElementById("authBtn");

    if (!authBtn) {
        console.log("authBtn n'est pas trouvé !");
        return;
    }

    if (localStorage.getItem("authToken")) {
        console.log("Utilisateur connecté.");
        authBtn.textContent = "logout";
        authBtn.href = "#";

        authBtn.addEventListener("click", () => {
            localStorage.removeItem("authToken");
            alert("Vous êtes déconnecté.");
            window.location.reload();
        });
    } else {
        console.log("Utilisateur non connecté.");
    }
});

displayWorks(); 
setupFilters();
