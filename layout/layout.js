// layout.js
document.addEventListener("DOMContentLoaded", function () {
    // Load Header
    fetch('layout/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        });

    // Load Footer
    fetch('layout/footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
});
