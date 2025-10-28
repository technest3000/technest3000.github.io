// src/js/components/Buttons.js

// Templates dictionary
const templates = {
  default: ({ url, iconClass, text, style, center }) => {
    const baseClass = style === 'primary' 
      ? 'bg-blue-600 text-white hover:bg-blue-700' 
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    return `
      <a href="${url}" class="flex items-center justify-center gap-2 ${baseClass} py-2 px-4 rounded-full font-semibold text-sm shadow-md transition">
        <i class="${iconClass}"></i> ${text}
      </a>
    `;
  },

  'button-v2': ({ url, iconClass, text, style, center }) => {
    const baseClass = style === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-50 text-gray-800 hover:bg-gray-100';
    const centerClass = center ? 'justify-center' : '';

    return `
      <a href="${url}" class="flex items-center ${centerClass} gap-3 px-4 py-3 ${baseClass} rounded-lg shadow transition">
      <i class="${iconClass}"></i>
      <span class="font-semibold ${style === 'primary' ? 'text-white' : 'text-gray-700'}">${text}</span>
      </a>
    `;
  },

  'button-v3': ({ url, iconClass, text, style, center }) => {
    const baseClass = style === 'primary'
      ? 'bg-white/80 text-primary hover:bg-white hover:text-primary'
      : 'bg-gray-50/80 text-gray-700 hover:bg-white hover:text-gray-900';

    const centerClass = center ? 'justify-center' : 'justify-start';
    
    return `
      <a href="${url}" class="flex items-center ${centerClass} gap-2 px-6 py-4 ${baseClass} rounded-xl shadow-md backdrop-blur-sm transition-transform transform hover:scale-105">
        <i class="${iconClass} text-lg"></i>
        <span class="font-medium text-base">${text}</span>
      </a>
    `;
  },

  'button-v4': ({ url, iconClass, text, style = 'primary', center = true }) => {
    // Determine classes based on style type
    const baseClass = style === 'primary'
      ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white dark:text-gray-200 hover:from-gray-500 hover:to-gray-400 shadow-md hover:shadow-lg'
      : 'bg-transparent border border-gray-500 text-gray-900 dark:text-gray-400 hover:bg-gray-700/30 hover:border-gray-400 backdrop-blur-sm shadow-md hover:shadow-lg';
    
    const centerClass = center ? 'justify-center' : 'justify-start';
    
    return `
      <a href="${url}" class="flex items-center ${centerClass} gap-2 px-6 py-2.5 ${baseClass} rounded-full transition-all duration-300 transform hover:scale-105">
        ${iconClass ? `<i class="${iconClass} text-lg"></i>` : ''}
        <span class="font-medium text-sm text-gray-900 dark:text-gray-400">${text}</span>
      </a>
    `;
  }
};


class ButtonGroup {
  constructor(items = [], template_id = 'default') {
    this.items = items;
    this.template_id = template_id;
  }

  render() {
    return this.items.map(item => {
      const iconClass = item.iconClass;
      const template = templates[this.template_id] || templates['default'];
      return template({ url: item.url, text: item.text, iconClass, style: item.style, center: item.center });
    }).join('');
  }
}

export default ButtonGroup;
