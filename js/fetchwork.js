   // Add event listener to the "Explore Projects" button
   document.getElementById("explore-button").addEventListener("click", function() {
    var projectsSection = document.getElementById("projects");

    // Toggle the visibility of the projects section
    if (projectsSection.style.display === "none" || projectsSection.style.display === "") {
        projectsSection.style.display = "block";  // Show the section
    } else {
        projectsSection.style.display = "none";   // Hide the section
    }
});

// Function to fetch data from Google Sheets and populate the projects
const SHEET_ID = "10atXFMmb2pIX83YI-Aq7-P77ywQywFzcPpkMOMLsfMs"; // Your Google Sheet ID
const SHEET_NAME = "Professional_Projects"; // Update with your sheet name if different
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;


async function fetchProjects() {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Parse the JSONP response
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/)[1]);
    const rows = json.table.rows;
   // Remove the first record
    rows.shift();
    let projectsHTML = '';

    // Loop through the rows and create the HTML for each project
    rows.forEach(row => {
        const project = {
            title: row.c[0].v,
            role: row.c[1].v,
            location: row.c[2].v,
            country: row.c[3].v,
            timeframe: row.c[4].v,
            description: row.c[5].v,
            skills: row.c[6].v
        };

        projectsHTML += `
            <div class="project-card">
                <h3 class="project-title">${project.title}</h3>
                <p><strong>Role:</strong> ${project.role}</p>
                <p><strong>Location:</strong> ${project.location}, ${project.country}</p>
                <p><strong>Timeframe:</strong> ${project.timeframe}</p>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                </div>
            </div>
        `;
    });

    // Insert the generated HTML into the projects section
    document.getElementById('projects-grid').innerHTML = projectsHTML;
}

// Fetch and display the projects when the page loads
fetchProjects();