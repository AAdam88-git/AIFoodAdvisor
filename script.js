// ====== CONFIG ======
const workerURL = "https://aifoodadvisorworker.ahussienwork.workers.dev";

let menuData = [];

// ====== LOAD MENU FROM WORKER KV ======
async function loadMenu() {
    try {
        const res = await fetch(workerURL + "/menu");
        menuData = await res.json();

        const restaurants = [...new Set(menuData.map(item => item.restaurant))];

        const dropdown = document.getElementById("restaurant");
        dropdown.innerHTML = ""; // clean

        restaurants.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });

        console.log("Menu loaded:", menuData);

    } catch (err) {
        console.error("Error loading menu from KV:", err);
        alert("Failed to load menu. Check KV or Worker.");
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

    if (!user.restaurant || !user.height || !user.weight || !user.budget) {
        alert("Please fill all fields.");
        return;
    }

    document.getElementById("result").textContent = "Thinking... 🤔";

    const restaurantMenu = menuData.filter(
        item => item.restaurant === user.restaurant
    );

    const prompt = `
User Information:
Height: ${user.height} cm
Weight: ${user.weight} kg
Budget: ${user.budget} EGP
Restaurant: ${user.restaurant}

Menu Items Available:
${JSON.stringify(restaurantMenu)}

Please recommend the best meal for this user.
Give a short clear answer.
    `;

    try {
        const response = await fetch(workerURL + "/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        document.getElementById("result").textContent =
            data.answer || data.choices?.[0]?.message?.content;

    } catch (err) {
        console.error("AI Error:", err);
        document.getElementById("result").textContent =
            "AI failed to respond 😢";
    }
}

// ====== INIT ======
window.onload = loadMenu;
