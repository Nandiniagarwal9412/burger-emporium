const API_BASE_URL = "http://127.0.0.1:5000";
function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
async function fetchAdminData(endpoint) {

    const response = await fetch(
        `${API_BASE_URL}/api/${endpoint}`,
        {
            method: "GET",

            // Send HTTP-only authentication cookie
            credentials: "include"
        }
    );

    const data = await response.json();

   

    if (response.status === 401) {

        window.location.href = "admin-login.html";

        return null;
    }

    return data;
}



async function loadContacts() {

    const container =
        document.getElementById("contactTable");

    try {

        const data =
            await fetchAdminData("contact");

        if (!data) return;

        const contacts =
            data.contacts || [];

        document.getElementById("contactCount").textContent =
            contacts.length;


        if (contacts.length === 0) {

            container.innerHTML =
                `<p class="admin-loading">
                    No contact messages yet.
                </p>`;

            return;
        }


        let html = `
            <table class="admin-table">

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>
        `;


        contacts.forEach(contact => {

            html += `
                <tr>

                    <td>${escapeHtml(contact.name)}</td>
                    <td>${escapeHtml(contact.email)}</td>

                    <td>
                       <span class="admin-badge">
                        ${escapeHtml(contact.subject)}
                       </span>
                    </td>

                    <td>${escapeHtml(contact.message)}</td>

                    <td>
                        ${new Date(
                            contact.createdAt
                        ).toLocaleDateString()}
                    </td>

                </tr>
            `;
        });


        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;


    } catch (error) {

        console.error(
            "Contact Loading Error:",
            error
        );

        container.innerHTML =
            `<p class="admin-loading">
                Unable to load contact messages.
            </p>`;
    }
}



async function loadFeedback() {

    const container =
        document.getElementById("feedbackTable");

    try {

        const data =
            await fetchAdminData("feedback");

        if (!data) return;

        const feedback =
            data.feedback || [];

        document.getElementById("feedbackCount").textContent =
            feedback.length;


        if (feedback.length === 0) {

            container.innerHTML =
                `<p class="admin-loading">
                    No feedback yet.
                </p>`;

            return;
        }


        let html = `
            <table class="admin-table">

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Recommendation</th>
                        <th>Feedback</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>
        `;


        feedback.forEach(item => {

            html += `
                <tr>

                   <td>${escapeHtml(item.name)}</td>
                   <td>${escapeHtml(item.email)}</td>

                    <td>
                        ⭐ ${item.rating}/5
                    </td>

                    <td>
                       <span class="admin-badge">
                       ${escapeHtml(item.recommendation)}
                       </span>
                    </td>

                    <td>${escapeHtml(item.message)}</td>

                    <td>
                        ${new Date(
                            item.createdAt
                        ).toLocaleDateString()}
                    </td>

                </tr>
            `;
        });


        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;


    } catch (error) {

        console.error(
            "Feedback Loading Error:",
            error
        );

        container.innerHTML =
            `<p class="admin-loading">
                Unable to load feedback.
            </p>`;
    }
}


// ========================================
// LOAD PARTNER ENQUIRIES
// ========================================

async function loadPartners() {

    const container =
        document.getElementById("partnerTable");

    try {

        const data =
            await fetchAdminData("partner");

        if (!data) return;

        const partners =
            data.partners || [];

        document.getElementById("partnerCount").textContent =
            partners.length;


        if (partners.length === 0) {

            container.innerHTML =
                `<p class="admin-loading">
                    No partnership enquiries yet.
                </p>`;

            return;
        }


        let html = `
            <table class="admin-table">

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>City</th>
                        <th>Interest</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>
        `;


        partners.forEach(partner => {

            html += `
                <tr>

                    <td>${escapeHtml(partner.fullName)}</td>
                    <td>${escapeHtml(partner.email)}</td>
                    <td>${escapeHtml(partner.phone)}</td>
                    <td>${escapeHtml(partner.city)}</td>

                    <td>
                       <span class="admin-badge">
                       ${escapeHtml(partner.partnershipInterest)}
                    </span>
                    </td>

                   <td>${escapeHtml(partner.message)}</td>

                    <td>
                        ${new Date(
                            partner.createdAt
                        ).toLocaleDateString()}
                    </td>

                </tr>
            `;
        });


        html += `
                </tbody>
            </table>
        `;

        container.innerHTML = html;


    } catch (error) {

        console.error(
            "Partner Loading Error:",
            error
        );

        container.innerHTML =
            `<p class="admin-loading">
                Unable to load partnership enquiries.
            </p>`;
    }
}


// ========================================
// LOAD EVERYTHING
// ========================================

async function loadAdminDashboard() {

    await Promise.all([
        loadContacts(),
        loadFeedback(),
        loadPartners()
    ]);
}

loadAdminDashboard();




const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");


if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await fetch(
                   `${API_BASE_URL}/api/admin/logout`,
                    {
                        method: "POST",

                        credentials: "include"
                    }
                );

            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );

            } finally {

                window.location.href =
                    "admin-login.html";
            }
        }
    );
}