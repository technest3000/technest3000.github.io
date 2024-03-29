/**
* Template Name: TechNest - v0.0.1
* Author: Mohamad Aboud
*/

import { Employee, Product, getStarRatingHtml } from './utils.js';


(function() {
  "use strict";

  /**
   * Add Team to
   */
  let employeeList = document.getElementById("employee-list");
  fetch('./assets/data/employee.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(function(sub) {
      const employee = Employee.fromJson(sub);
      let imageUrl = ""; 
      let twitterLink = "";
      let facebookLink = "";
      let instagramLink = "";
      let linkedinLink = "";

      if (employee.imageUrl.trim() !== "") {
        imageUrl = employee.imageUrl;
      }

      if (employee.socialLinks.hasOwnProperty("twitter")) {
        twitterLink = `<a href="${employee.getSocialLink('twitter')}"><i class="bi bi-twitter"></i></a>`;
      }

      if (employee.socialLinks.hasOwnProperty("facebook")) {
        facebookLink = `<a href="${employee.getSocialLink('facebook')}"><i class="bi bi-facebook"></i></a>`;
      }

      if (employee.socialLinks.hasOwnProperty("instagram")) {
        instagramLink = `<a href="${employee.getSocialLink('instagram')}"><i class="bi bi-instagram"></i></a>`;
      }

      if (employee.socialLinks.hasOwnProperty("linkedIn")) {
        linkedinLink = `<a href="${employee.getSocialLink('linkedIn')}"><i class="bi bi-linkedin"></i></a>`;
      }

      const card = `
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in">
            <div class="member">
              <img src="${imageUrl}"  alt="user-image" onerror="this.onerror=null; this.src='assets/img/team/default.jpg';">
              <h4>${employee.name}</h4>
              <span>${employee.jobTitle}</span>
              <p>
                ${employee.about}.
              </p>
              <div class="social">
                ${twitterLink}
                ${facebookLink}
                ${instagramLink}
                ${linkedinLink}
              </div>
            </div>
          </div>`;
      employeeList.innerHTML += card;
    });
  })
  .catch(error => {
    // Handle error
    console.error(error);
  });

  

  /**
   * Add Team to
   */
  let productList = document.getElementById("products-list");
  fetch('./assets/data/products.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(async function(sub) {
      const product = Product.fromJson(sub);

      // <div class="color-price">
      //     <div class="price">
      //         <span class="price_num">$${product.price}</span>
      //     </div>
      //  </div>

      // <div class="button">
      //     <div class="button-layer"></div>
      //      <button>More details</button>
      //     </div>
      //   </div>
      const card = `
      <div class="col-lg-4 col-md-6 product-item filter-${product.type}">
      <div class="product-card">
        <img src="./assets/img/products/${product.images[0]}" class="img-fluid" alt="image">
        <div class="product-details">
          <span style="color:red" class="product-name">${product.title}</span>
          <p> ${product.subtitle} </p>
          <div class="stars">
              ${getStarRatingHtml(product.rating)}
            </div>

            
        </div>
       
        
    </div>`;
      productList.innerHTML += card;
      
    });
  })
  .catch(error => {
    // Handle error
    console.error(error);
  });

  /**
   * Prodeuct color hover
   */

  
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  


  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let productContainer = select('.product-container');
    if (productContainer) {
      let productIsotope = new Isotope(productContainer, {
        itemSelector: '.product-item'
      });

      let productFilters = select('#product-flters li', true);

      on('click', '#product-flters li', function(e) {
        e.preventDefault();
        productFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        productIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        productIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate product lightbox 
   */
  const productLightbox = GLightbox({
    selector: '.product-lightbox'
  });

  /**
   * product details slider
   */
  new Swiper('.product-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()