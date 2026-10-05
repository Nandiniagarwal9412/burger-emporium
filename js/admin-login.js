const API_BASE_URL = "https://burger-emporium-api.onrender.com";
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginError = document.getElementById("adminLoginError");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("adminEmail")
            .value
            .trim();

        const password = document
            .getElementById("adminPassword")
            .value;

        adminLoginError.textContent = "";

        try {

            const response = await fetch(
               `${API_BASE_URL}/api/admin/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    // Allow browser to receive/store the cookie
                    credentials: "include",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                // JWT is now stored in an HTTP-only cookie.
                // We deliberately do NOT store it in localStorage.

                window.location.href = "admin.html";

            } else {

                adminLoginError.textContent =
                    data.message || "Invalid email or password.";
            }

        } catch (error) {

            console.error("Admin Login Error:", error);

            adminLoginError.textContent =
                "Unable to connect to the server. Please try again.";
        }
    });
}