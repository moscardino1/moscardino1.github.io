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

function getRandomProjects(projects, count) {
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function renderRandomProjects(projects) {
    const container = document.querySelector(".works-grid");
    container.innerHTML = ""; // Clear the grid

    projects.forEach(({ title, description, projectLink, githubLink }) => {
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

// Fetch and display random projects in "Personal Projects" section
if (document.querySelector(".works-grid")) {
    fetchProjects()
        .then((projects) => {
            const randomProjects = getRandomProjects(projects, 5); // Get 5 random projects
            renderRandomProjects(randomProjects);
        })
        .catch((error) => console.error("Error rendering random projects:", error));
}
