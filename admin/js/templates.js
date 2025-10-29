document.addEventListener('DOMContentLoaded', async () => {
  const templateList = document.getElementById('template-list');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  // Detect environment
  const baseUrl = window.location.origin;

  for (const userFile of userTemplateFiles) {
    const userId = userFile.replace('.json', '');
    const response = await fetch(`../data/users/${userFile}`);
    const userData = await response.json();
    const title = userData.title || 'Untitled';
    const createdAt = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A';
    const previewUrl = `${baseUrl}/?user-id=${userId}`;

    // Card container
    const card = document.createElement('div');
    card.className = `
      group bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden 
      border border-gray-100 hover:border-primary transition-all duration-300 relative cursor-pointer
    `;

    // Iframe preview
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'relative w-full h-56 bg-gray-100 overflow-hidden';
    const iframe = document.createElement('iframe');
    iframe.src = previewUrl;
    iframe.className = 'w-full h-full';
    // Stop scrolling inside iframe
    iframe.onload = () => {
      iframe.contentWindow.document.body.style.overflow = 'hidden';
    };
    iframeContainer.appendChild(iframe);

    // Overlay for hover
    const overlay = document.createElement('div');
    overlay.className = `
      absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center 
      opacity-0 group-hover:opacity-100 transition-all duration-300
    `;
    overlay.innerHTML = `
      <a href="${previewUrl}" target="_blank" 
        class="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition">
        <i class="fa fa-eye mr-2"></i> View Site
      </a>
    `;
    iframeContainer.appendChild(overlay);

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.className = 'p-4 space-y-2';
    cardBody.innerHTML = `
      <h3 class="text-lg font-bold text-gray-800 flex items-center">
        <i class="fas fa-file-alt text-primary mr-2"></i> ${title}
      </h3>
      <p class="text-sm text-gray-600 flex items-center">
        <i class="far fa-calendar-alt mr-2 text-gray-500"></i> ${createdAt}
      </p>
    `;

    card.appendChild(iframeContainer);
    card.appendChild(cardBody);
    card.addEventListener('click', () => window.open(previewUrl, '_blank'));

    templateList.appendChild(card);
  }

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
  });
});
