function createNavigationScript() {
  return `
  document.addEventListener('DOMContentLoaded', function() {
      const nav = document.querySelector('.sidebar-main-content');
      
      nav.addEventListener('click', function(e) {
          const target = e.target;
          
          // Handle accordion toggles
          if (target.matches('.accordion-heading')) {
              const content = target.nextElementSibling;
              target.classList.toggle('active');
              content.style.display = content.style.display === 'block' ? 'none' : 'block';
              e.preventDefault();
          }
          
          // Handle link clicks
          if (target.matches('a')) {
              // Remove 'active' class from all links
              nav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
              
              // Add 'active' class to clicked link
              target.classList.add('active');
              
              // Don't prevent default here, let the link navigate
          }
      });

      function saveNavState() {
          const activeLinks = Array.from(document.querySelectorAll('.sidebar-main-content a.active'))
              .map(link => link.getAttribute('href'));
          localStorage.setItem('activeNavLinks', JSON.stringify(activeLinks));
      }

      function loadNavState() {
          const activeLinks = JSON.parse(localStorage.getItem('activeNavLinks') || '[]');
          activeLinks.forEach(href => {
              const link = document.querySelector(\`.sidebar-main-content a[href="\${href}"]\`);
              if (link) {
                  link.classList.add('active');
                  // Expand parent accordions if necessary
                  let parent = link.closest('.accordion-content');
                  while (parent) {
                      parent.style.display = 'block';
                      parent.previousElementSibling.classList.add('active');
                      parent = parent.parentElement.closest('.accordion-content');
                  }
              }
          });
      }

      // Call loadNavState when the page loads
      loadNavState();

      // Call saveNavState when a link is clicked
      nav.addEventListener('click', function(e) {
          if (e.target.matches('a')) {
              saveNavState();
          }
      });
  });
  `
}

function createNavigationStyles() {
  return `
  .sidebar-main-content a {
      color: #333;
      text-decoration: none;
  }

  .sidebar-main-content a:visited {
      color: #666;
  }

  .sidebar-main-content a.active {
      font-weight: bold;
      color: #000;
  }

  .accordion-heading {
      cursor: pointer;
  }

  .accordion-content {
      display: none;
  }

  .accordion-heading.active + .accordion-content {
      display: block;
  }
  `
}

module.exports = {
  createNavigationScript,
  createNavigationStyles,
}
