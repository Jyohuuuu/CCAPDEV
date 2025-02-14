document.addEventListener("DOMContentLoaded", function () {
    const propertyList = document.getElementById("property-list");
    const filters = document.querySelectorAll("#availability, #min-price, #max-price, #lister-filter");
    const propertyForm = document.getElementById("property-form");
    const addPropertyButton = document.getElementById("add-property-button");

    function filterProperties() {
        const availability = document.getElementById("availability").value;
        const minPrice = parseInt(document.getElementById("min-price").value) || 0;
        const maxPrice = parseInt(document.getElementById("max-price").value) || Infinity;
        const lister = document.getElementById("lister-filter").value.toLowerCase().trim();

        document.querySelectorAll(".property-card").forEach(card => {
            const cardAvailability = card.getAttribute("data-availability");
            const cardPrice = parseInt(card.getAttribute("data-price"));
            const cardLister = (card.getAttribute("data-lister") || "").toLowerCase().trim();

            const show = (availability === "all" || cardAvailability === availability) &&
                         (cardPrice >= minPrice && cardPrice <= maxPrice) &&
                         (cardLister.includes(lister) || lister === "");

            card.style.display = show ? "block" : "none";
        });
    }

    addPropertyButton.addEventListener("click", function () {
        propertyForm.style.display = propertyForm.style.display === "none" || propertyForm.style.display === "" ? "block" : "none";
    });

    function addProperty(event) {
        event.preventDefault();

        const name = document.getElementById("property-name").value.trim();
        const description = document.getElementById("property-description").value.trim();
        const price = parseInt(document.getElementById("property-price").value);
        const lister = document.getElementById("property-lister").value.trim();
        const availability = document.getElementById("property-availability").value;

        if (!name || !description || isNaN(price) || !lister) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");
        propertyCard.setAttribute("data-availability", availability);
        propertyCard.setAttribute("data-price", price);
        propertyCard.setAttribute("data-lister", lister);

        propertyCard.innerHTML = `
            <img src="https://via.placeholder.com/300" alt="${name}" class="property-image">
            <div class="property-info">
                <span class="property-name">${name}</span>
                <span class="property-reviews">★ 5.0</span>
                <span class="property-location">${description}</span>
                <p class="property-description">${description.substring(0, 50)}...</p>
                <span class="property-price">₱${price}/night</span>
                <p class="property-availability ${availability}">${availability.charAt(0).toUpperCase() + availability.slice(1)}</p>
                <p class="property-lister">👤 ${lister}</p>
            </div>
        `;

        propertyList.appendChild(propertyCard);
        propertyForm.reset();
        propertyForm.style.display = "none";

        filterProperties();
    }

    propertyForm.addEventListener("submit", addProperty);
    filters.forEach(filter => filter.addEventListener("input", filterProperties));
    filterProperties();
});
