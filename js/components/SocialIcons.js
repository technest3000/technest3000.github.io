// src/js/components/SocialIcons.js

// Templates dictionary
const templates = {
  default: ({ url, iconClass, colorClass, name }) => `
    <a href="${url}" target="_blank" class="hover:opacity-80 transition mx-1 text-xl ${colorClass}">
      <i class="${iconClass}"></i>
    </a>
  `,

  'social-v2': ({ url, iconClass, colorClass, name }) => `
    <a href="${url}" target="_blank"
      class="flex flex-col items-center gap-1 w-20 py-3 bg-white rounded-lg shadow hover:shadow-md transition">
      <i class="${iconClass} ${colorClass} text-xl"></i>
      <span class="text-xs font-semibold text-gray-700 capitalize">${name}</span>
    </a>
  `,

  'social-v3': ({ url, iconClass, colorClass, name }) => {
    const hoverClass = colorClass.replace(/^text-/, 'hover:text-');
    return `
      <a href="${url}" target="_blank" class="flex items-center justify-center gap-2 px-4 py-3 bg-white/80 rounded-xl shadow-md backdrop-blur-sm hover:shadow-lg transition-transform transform hover:scale-105">
        <i class="${iconClass} text-xl text-gray-500 ${hoverClass}"></i>
      </a>
    `},

  'social-v4': ({ url, iconClass, colorClass, name }) => {
    return `
      <a href="${url}" target="_blank" class="p-3 rounded-full bg-gray-700/40 backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center group" title="${name}">
        <i class="${iconClass} text-gray-200 text-xl group-hover:${colorClass} transition-all duration-300"></i>
      </a>
    `;
  }
};

class SocialIcons {
  constructor(links = [], template_id = 'default') {
    this.links = links;
    this.template_id = template_id;
  }

  getPlatform(url) {
    url = url.toLowerCase();
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('github.com')) return 'github';
    if (url.includes('twitter.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('snapchat.com')) return 'snapchat';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('youtube.com')) return 'youtube';
    if (url.includes('wa.me') || url.includes('whatsapp.com')) return 'whatsapp';
    return 'globe';
  }

  getColor(platform) {
    const colors = {
      linkedin: 'text-blue-700',
      github: 'text-gray-800',
      twitter: 'text-sky-500',
      instagram: 'text-pink-600',
      facebook: 'text-blue-600',
      snapchat: 'text-yellow-400',
      tiktok: 'text-black',
      youtube: 'text-red-600',
      whatsapp: 'text-green-500',
      globe: 'text-gray-500'
    };
    return colors[platform] || 'text-gray-500';
  }

  getIcon(platform) {
    const faBrands = ['linkedin', 'github', 'twitter', 'instagram', 'facebook', 'snapchat', 'tiktok', 'youtube', 'whatsapp'];
    return faBrands.includes(platform) ? `fa-brands fa-${platform}` : 'fa-solid fa-globe';
  }

  render() {
    return this.links.map(link => {
      // Determine platform
      const platform = link.platform ? link.platform.toLowerCase() : this.getPlatform(link.url);
      // Get the name if provided, else derive from platform
      const name = link.name || platform;
      // Use icon from JSON if it exists, otherwise generate
      const iconClass = link.iconClass || this.getIcon(platform);
      const colorClass = this.getColor(platform);

      // Pick the template from the dictionary
      const template = templates[this.template_id] || templates['default'];
      return template({ url: link.url, iconClass, colorClass, name });
    }).join('');
  }
}

export default SocialIcons;
