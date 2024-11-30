const SHEET_ID = "10atXFMmb2pIX83YI-Aq7-P77ywQywFzcPpkMOMLsfMs"; // Your Google Sheet ID
const SHEET_NAME = "Sheet1"; // Update with your sheet name if different
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function fetchProjects() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();

        // Parse the JSONP response
        const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/)[1]);
        const rows = json.table.rows;

        // Map the rows to projects
        return rows.map((row) => {
            const [
                priorityCategory,
                priorityProject,
                category,
                projectName,
                projectLink,
                githubLink,
                description,
            ] = row.c.map((cell) => (cell ? cell.v : ""));

            return {
                category,
                title: projectName,
                description: description || "No description provided.",
                projectLink: projectLink || "",
                githubLink: githubLink || "",
            };
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

function renderProjectsForWorks(projects) {
    const categories = {
        "BI Projects": document.querySelector("#bi-projects .works-grid"),
        "Flask Projects": document.querySelector("#flask-projects .works-grid"),
        "Firebase Projects": document.querySelector("#firebase-projects .works-grid"),
        "Art Project": document.querySelector("#art-project .works-grid"),
    };

    Object.keys(categories).forEach((category) => {
        const container = categories[category];
        const filteredProjects = projects.filter((project) => project.category === category);

        filteredProjects.slice(0, 5).forEach(({ title, description, projectLink, githubLink }) => {
            const projectHTML = `
                <div class="work-item">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="work-links">
                        ${projectLink ? `<a href="${projectLink}" target="_blank">View Project</a>` : ""}
                        ${githubLink ? `<a href="${githubLink}" target="_blank">GitHub</a>` : ""}
                    </div>
                </div>
            `;
            container.innerHTML += projectHTML;
        });

        // Add "View More" if there are more than 5 projects
        if (filteredProjects.length > 5) {
            const viewMoreHTML = `
                <button class="view-more" onclick="viewMore('${category}')">View More</button>
            `;
            container.innerHTML += viewMoreHTML;
        }
    });
}

// View More Functionality
function viewMore(category) {
    const categories = {
        "BI Projects": document.querySelector("#bi-projects .works-grid"),
        "Flask Projects": document.querySelector("#flask-projects .works-grid"),
        "Firebase Projects": document.querySelector("#firebase-projects .works-grid"),
        "Art Project": document.querySelector("#art-project .works-grid"),
    };

    const container = categories[category];
    const allProjects = window.cachedProjects.filter((project) => project.category === category);

    container.innerHTML = ""; // Clear the grid
    allProjects.forEach(({ title, description, projectLink, githubLink }) => {
        const projectHTML = `
            <div class="work-item">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="work-links">
                    ${projectLink ? `<a href="${projectLink}" target="_blank">View Project</a>` : ""}
                    ${githubLink ? `<a href="${githubLink}" target="_blank">GitHub</a>` : ""}
                </div>
            </div>
        `;
        container.innerHTML += projectHTML;
    });
}

// Fetch and render projects for works_dyn.html
if (document.querySelector("#bi-projects")) {
    fetchProjects()
        .then((projects) => {
            window.cachedProjects = projects; // Cache projects for "View More" functionality
            renderProjectsForWorks(projects);
        })
        .catch((error) => console.error("Error rendering projects:", error));
}
