// layout.js
document.addEventListener("DOMContentLoaded", async function () {
    await Promise.all([
        fetch('layout/header.html').then(r => r.text()),
        fetch('layout/footer.html').then(r => r.text())
    ]).then(([header, footer]) => {
        document.body.insertAdjacentHTML('afterbegin', header);
        document.body.insertAdjacentHTML('beforeend', footer);
        document.dispatchEvent(new Event('layoutLoaded'));
    });
});
