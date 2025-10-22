// src/js/main.js
import SocialIcons from './components/SocialIcons.js';
import Footer from './components/Footer.js';
import ButtonGroup from './components/ButtonGroup.js';

/**
 * Extracts user ID from the URL path
 * Example: /users/<uuid>
 */
function getUserIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('user-id'); // returns value or null if not found
}

/**
 * Fetches user JSON data
 */
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/data/users/${userId}.json`);
    if (!response.ok) throw new Error(`Failed to fetch user data (status: ${response.status})`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching user data:', err);
    return null;
  }
}

/**
 * Fetches HTML template
 */
async function fetchTemplate(templateId) {
  try {
    const response = await fetch(`/templates/${templateId}.html`);
    if (!response.ok) throw new Error(`Failed to fetch template (status: ${response.status})`);
    return await response.text();
  } catch (err) {
    console.error('Error fetching template:', err);
    return null;
  }
}

/**
 * Renders user data into a loaded template
 */
function renderTemplate(userData) {
  if (!userData) return;

  // Get all elements with the same ID
  const logoImages = document.querySelectorAll('#logo-url');

  // Update each element if userData.logo_url exists
  if (userData.logo_url) {
    logoImages.forEach(img => {
      img.src = userData.logo_url;
    });
  }

  // Header Image
  const headerImage = document.getElementById('header-url');
  if (userData.header_url && headerImage) {
    headerImage.src = userData.header_url;
  }

  // Dynamic fields rendering
  function renderDynamicFields(data) {
    Object.keys(data).forEach(key => {
      if (['social_media_links', 'logo_url', 'buttons', 'header-url'].includes(key)) return;

      const elements = document.querySelectorAll(`#${key}`);
      elements.forEach(el => {
        if (el) {
          if (Array.isArray(data[key])) {
            el.innerHTML = data[key].map(item => `<li>${item}</li>`).join('');
          } else {
            el.textContent = data[key];
          }
        }
      });
    });
  }

  renderDynamicFields(userData);

  // Social Media
  const socialContainers = document.querySelectorAll('#user-socials, #social-links, #social-links-footer');
  socialContainers.forEach(container => {
    if (container && userData.social_media_links) {
      const { links, template_id } = userData.social_media_links;
      const socialIcons = new SocialIcons(links, template_id || 'default');
      container.innerHTML = socialIcons.render();
    }
  });

  // Action Buttons
  const actionContainer = document.getElementById('action-buttons');
  if (actionContainer && userData.buttons) {
    const { items, template_id } = userData.buttons;
    const buttonGroup = new ButtonGroup(items, template_id || 'button-v2');
    actionContainer.innerHTML = buttonGroup.render();
  }

  // Footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    const footer = new Footer({
      username: userData.username,
      year: new Date().getFullYear(),
      social_media_links: userData.social_media_links
    });
    footerContainer.innerHTML = footer.render();
  }
}



/**
 * Main initializer
 */
/**
 * Main initializer
 */
async function initialize() {
  const userId = getUserIdFromUrl();
  const appContainer = document.getElementById('app');

  async function load404Content() {
    try {
      const response = await fetch('/404.html');
      if (!response.ok) throw new Error('Failed to load 404 page.');
      const html = await response.text();
      if (appContainer) appContainer.innerHTML = html;
    } catch (err) {
      console.error('Error loading 404 content:', err);
      if (appContainer)
        appContainer.innerHTML = `<div class="text-red-500 text-center mt-10 text-lg font-semibold">
          Error: Page not found.
        </div>`;
    }
  }

  if (!userId) {
    console.error('User ID not found in URL.');
    await load404Content();
    return;
  }

  const userData = await fetchUserData(userId);
  if (!userData || !userData.template_id) {
    console.error('User data or template_id missing.');
    await load404Content();
    return;
  }

  const templateHtml = await fetchTemplate(userData.template_id);
  if (!templateHtml) {
    console.error('Error loading template.');
    await load404Content();
    return;
  }

  // Inject template and render user data
  if (appContainer) appContainer.innerHTML = templateHtml;
  renderTemplate(userData);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initialize);