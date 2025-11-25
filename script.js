// ====== CONFIG ======
const workerURL = "https://aifoodadvisorworker.ahussienwork.workers.dev";

let menuData = [];

// ====== LOAD MENU DATA ======
async function loadMenu() {
    try {
        const res = await fetch("menu.json");
        menuData = await res.json();

        const restaurants = [...new Set(menuData.map(item => item.restaurant))];

        const dropdown = document.getElementById("restaurant");
        restaurants.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });

    } catch (err) {
        console.error("Error loading menu.json:", err);
        alert("Failed to load menu items.");
    }
}

// ====== AI RECOMMENDATION ======
async function recommend() {
    const user = {
        restaurant: document.getElementById("restaurant").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        budget: document.getElementById("budget").value
    };

    // Validate input
    if (!user.restaurant || !user.height || !user.weight || !user.budget) {
        alert("Please fill all fields.");
        return;
    }

    document.getElementById("result").textContent = "Thinking... 🤔";

    // Filter menu for selected restaurant
    const restaurantMenu = menuData.filter(
        item => item.restaurant === user.restaurant
    );

    // Prompt for AI
    const prompt = `
User Information:
Height: ${user.height} cm
Weight: ${user.weight} kg
Budget: ${user.budget} EGP
Restaurant: ${user.restaurant}

Menu Items Available:
${JSON.stringify(restaurantMenu)}

Please recommend the best meal for this user.
Provide a short, clear answer.
    `;

    try {
        const response = await fetch(workerURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        document.getElementById("result").textContent =
            data.choices[0].message.content;

    } catch (err) {
        console.error("AI Error:", err);
        document.getElementById("result").textContent =
            "Failed to get recommendation 😢";
    }
}

// ====== RUN ON PAGE LOAD ======
window.onload = loadMenu;
