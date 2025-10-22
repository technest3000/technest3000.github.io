// src/js/components/Footer.js

class Footer {
  constructor(copyrightText) {
    this.copyrightText = copyrightText;
  }

  render() {
    return `
      <footer class="bg-gray-800 text-white py-4 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; ${new Date().getFullYear()} TechNest. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}

export default Footer;
