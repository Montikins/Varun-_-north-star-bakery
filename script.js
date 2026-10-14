
const bakeryProducts = [
    { id: "bread", name: "Fresh Bread" },
    { id: "cookies", name: "Chocolate Cookies" },
    { id: "loaf", name: "Signature Loaf" }
];

const validationRules = {
    nameMinLength: 2,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

function getFavourites() {
    return JSON.parse(localStorage.getItem("bakeryFavourites") || "[]");
}

function saveFavourites(favourites) {
    localStorage.setItem("bakeryFavourites", JSON.stringify(favourites));
}

function updateFavouriteButtons() {
    const favourites = getFavourites();

    document.querySelectorAll("[data-favourite]").forEach(button => {
        const isFavourite = favourites.includes(button.dataset.favourite);
        button.textContent = isFavourite
            ? "♥ Remove Favourite"
            : "♡ Add to Favourites";

        button.setAttribute("aria-pressed", String(isFavourite));
    });

    const count = document.getElementById("favourite-count");

    if (count) {
        count.textContent = favourites.length;
    }
}

function toggleFavourite(productId) {
    let favourites = getFavourites();

    if (favourites.includes(productId)) {
        favourites = favourites.filter(id => id !== productId);
    } else {
        favourites.push(productId);
    }

    saveFavourites(favourites);
    updateFavouriteButtons();
}

function setupFavourites() {
    document.querySelectorAll("[data-favourite]").forEach(button => {
        button.addEventListener("click", () => {
            toggleFavourite(button.dataset.favourite);
        });
    });

    updateFavouriteButtons();
}

function showError(field, message) {
    const error = document.getElementById(`${field.id}-error`);

    if (error) {
        error.textContent = message;
    }

    field.setAttribute("aria-invalid", message ? "true" : "false");
}

function setupContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) return;

    const name = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const message = document.getElementById("contact-message");
    const feedback = document.getElementById("form-feedback");

    name.value = localStorage.getItem("bakeryContactName") || "";
    email.value = localStorage.getItem("bakeryContactEmail") || "";

    form.addEventListener("submit", event => {
        event.preventDefault();

        let valid = true;

        if (name.value.trim().length < validationRules.nameMinLength) {
            showError(name, "Please enter at least 2 characters for your name.");
            valid = false;
        } else {
            showError(name, "");
        }

        if (!validationRules.emailPattern.test(email.value.trim())) {
            showError(email, "Please enter a valid email address.");
            valid = false;
        } else {
            showError(email, "");
        }

        if (message.value.trim().length < 10) {
            showError(message, "Please enter at least 10 characters in your message.");
            valid = false;
        } else {
            showError(message, "");
        }

        if (!valid) {
            feedback.textContent = "Please correct the highlighted fields.";
            return;
        }

        localStorage.setItem("bakeryContactName", name.value.trim());
        localStorage.setItem("bakeryContactEmail", email.value.trim());

        feedback.textContent =
            "Your form passed validation. This demo does not send your message to the bakery.";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupFavourites();
    setupContactForm();
});
