class Logo {
  constructor(logoPath) {
    this.logoPath = logoPath;
  }

  render() {
    return `<img src="${this.logoPath}" alt="Logo" class="h-10 w-10 rounded-full">`;
  }
}
export default Logo;