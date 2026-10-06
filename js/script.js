console.log("BURGER EMPORIUM SCRIPT LOADED");
const API_BASE_URL = "https://burger-emporium-api.onrender.com";
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link, .nav-cta");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        const isOpen = hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", isOpen);
        hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-label", "Open navigation menu");
        }
    });
});

document.addEventListener("click", (event) => {
    if (!hamburger || !navMenu) {
        return;
    }

    const clickedInsideNavbar = event.target.closest(".navbar");

    if (!clickedInsideNavbar && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    }
});

const revealElements = document.querySelectorAll(
    ".menu-card, .menu-heading, .menu-intro, .reveal-menu, .full-menu-bottom-content"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show-reveal");
                entry.target.classList.add("show-menu-reveal");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

const menuPosters = document.querySelectorAll(".menu-poster-image img");
const lightbox = document.getElementById("menuLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

menuPosters.forEach((image) => {
    image.addEventListener("click", () => {
        if (!lightbox || !lightboxImage) {
            return;
        }

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    });
}

if (lightbox) {
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }
});
// ===============================
// CONTACT FORM BACKEND
// ===============================

const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        try {

            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Feedback API response:", data);
            if (data.success) {

                contactSuccess.classList.add("show");

                contactForm.reset();

                setTimeout(() => {
                    contactSuccess.classList.remove("show");
                }, 5000);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Error:", error);

            alert("Unable to connect to the server. Please try again.");

        }

    });

}
// ===============================
// FEEDBACK FORM BACKEND
// ===============================

const feedbackForm = document.getElementById("feedbackForm");
const feedbackSuccess = document.getElementById("feedbackSuccess");
console.log("Feedback form found:", feedbackForm);
if (feedbackForm) {

    feedbackForm.addEventListener("submit", async function (event) {

        event.preventDefault();
        console.log("1. Feedback submit handler started");
        // Get selected recommendation
        const selectedRecommendation = document.querySelector(
            'input[name="recommend"]:checked'
        );

        // Get selected overall rating
        const selectedRating = document.querySelector(
            'input[name="rating"]:checked'
        );

        // Make sure overall rating is selected
        if (!selectedRating) {
            alert("Please select your overall experience rating.");
            return;
        }

        // Make sure recommendation is selected
        if (!selectedRecommendation) {
            alert("Please select whether you would recommend us.");
            return;
        }
        console.log("2. Validation passed");
        // Get form values
        const formData = {
            name: document.getElementById("feedbackName").value,
            email: document.getElementById("feedbackEmail").value,

            rating: Number(selectedRating.value),

            food: Number(document.getElementById("food").value),
            service: Number(document.getElementById("service").value),
            ambience: Number(document.getElementById("ambience").value),
            value: Number(document.getElementById("value").value),

            message: document.getElementById("feedbackMessage").value,

            // HTML uses "recommend", backend expects "recommendation"
            recommendation: selectedRecommendation.value
        };
        console.log("3. About to send API request");
        try {

            const response = await fetch(
                 `${API_BASE_URL}/api/feedback`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {

                // Show success message
                feedbackSuccess.classList.add("show");

                // Clear form
                feedbackForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    feedbackSuccess.classList.remove("show");
                }, 5000);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Feedback Error:", error);

            alert(
                "Unable to connect to the server. Please try again."
            );

        }

    });

}
// ===============================
// PARTNER FORM BACKEND
// ===============================

const partnerForm = document.getElementById("partnerForm");
const partnerSuccess = document.getElementById("partnerSuccess");

if (partnerForm) {

    partnerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get form values
        const formData = {
            fullName: document.getElementById("partnerName").value,
            email: document.getElementById("partnerEmail").value,
            phone: document.getElementById("partnerPhone").value,
            city: document.getElementById("partnerCity").value,
            partnershipInterest: document.getElementById("partnerType").value,
            message: document.getElementById("partnerMessage").value
        };

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/partner`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {

                // Show success message
                partnerSuccess.classList.add("show");

                // Reset form
                partnerForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    partnerSuccess.classList.remove("show");
                }, 5000);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Partner Error:", error);

            alert(
                "Unable to connect to the server. Please try again."
            );

        }

    });

}
