document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    const currentPage = window.location.pathname.split('/').pop();

    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('bg-[var(--primary-dark-color)]');
        }
    });
});
