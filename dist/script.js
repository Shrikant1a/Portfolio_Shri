/**
 * Shrikant Aher - Portfolio JavaScript
 * Modern Interactive Features, WebGL/Canvas Particle Mesh, Typewriter, Modals, Filtering & Toast Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initTheme();
  initCanvasParticles();
  initCustomCursor();
  initNavbar();
  initTypewriter();
  initScrollReveals();
  initStatCounters();
  initSkillBars();
  initFilters();
  initProjectModals();
  initContactForm();
  initCopyButtons();
  initScrollTop();
  initWhatsAppBot();
  updateFooterYear();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('sa_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('sa_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

/* --------------------------------------------------------------------------
   2. Dynamic Canvas Particle & Constellation Mesh Network
   -------------------------------------------------------------------------- */
function initCanvasParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.6)`;
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse cursor
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // Update and draw all particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Custom Cursor Follower
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    outline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 350, fill: 'forwards' });
  });

  // Scale cursor over interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1.4)';
      outline.style.borderColor = 'var(--secondary)';
      outline.style.backgroundColor = 'rgba(6, 182, 212, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.borderColor = 'rgba(139, 92, 246, 0.5)';
      outline.style.backgroundColor = 'transparent';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Navbar, Mobile Drawer & Resume Dropdown
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const resumeBtn = document.getElementById('resumeDropdownBtn');
  const resumeDropdown = document.getElementById('resumeDropdown');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on Navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting on scroll
    let currentSectionId = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Resume Dropdown
  if (resumeBtn && resumeDropdown) {
    resumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = resumeDropdown.classList.contains('show');
      resumeDropdown.classList.toggle('show', !isOpen);
      resumeBtn.classList.toggle('active', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!resumeDropdown.contains(e.target) && e.target !== resumeBtn) {
        resumeDropdown.classList.remove('show');
        resumeBtn.classList.remove('active');
      }
    });
  }

  // Mobile Drawer Toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. Dynamic Role Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const textEl = document.getElementById('typewriter');
  if (!textEl) return;

  const roles = [
    'Full-Stack Software Developer',
    'Blockchain & Web3 Engineer',
    'Solidity & Smart Contract Developer',
    'Java & React.js Specialist',
    'DApp & Decentralized Systems Builder'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      textEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      textEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   6. Scroll Entrance Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-fade, .reveal-up');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. Stat Numbers Counter Animation
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statsSection = document.querySelector('.stats-banner-section');
  const counters = document.querySelectorAll('.stat-number');
  if (!statsSection || counters.length === 0) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimal = counter.getAttribute('data-decimal') || '';
        const duration = 1600;
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        let currentStep = 0;

        const timer = setInterval(() => {
          currentStep++;
          const progress = currentStep / totalSteps;
          const currentVal = Math.round(target * progress);

          if (currentStep >= totalSteps) {
            counter.textContent = target + decimal;
            clearInterval(timer);
          } else {
            counter.textContent = currentVal;
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   8. Skill Progress Bars Animation
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillsSection = document.getElementById('skills');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      skillCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animated');
        }, index * 60);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(skillsSection);
}

/* --------------------------------------------------------------------------
   9. Skill & Project Category Filtering
   -------------------------------------------------------------------------- */
function initFilters() {
  // Skills filter
  const skillTabs = document.querySelectorAll('#skillsFilterTabs .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          setTimeout(() => card.classList.add('animated'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Projects filter
  const projectTabs = document.querySelectorAll('#projectFilterTabs .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      projectTabs.forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. Interactive Project Modals
   -------------------------------------------------------------------------- */
const PROJECT_DATABASE = {
  voting: {
    badge: 'Blockchain & Ethereum DApp',
    year: '2025',
    title: 'Decentralized Voting System (DApp)',
    description: 'A tamper-proof electronic voting application powered by Ethereum smart contracts. Designed to solve election transparency, eliminate voter fraud, and provide immutable on-chain tallying.',
    architecture: 'Built using Solidity smart contracts compiled and deployed via Remix IDE with MetaMask integration. The dApp verifies voter eligibility on-chain, issues cryptographic ballot tokens, and prevents double-voting with strict address checks.',
    keyFeatures: [
      'Strict One-Vote-Per-Address cryptographic restriction logic',
      'Gas-optimized state variables and storage mapping structures',
      'Instant verifiable real-time election results directly on Ethereum Sepolia testnet',
      'Comprehensive security modifier layers preventing re-entrancy and unauthorized admin overrides',
      'Intuitive frontend interface seamlessly connected with MetaMask wallet'
    ],
    techStack: ['Solidity', 'Ethereum EVM', 'Remix IDE', 'MetaMask', 'Web3.js', 'JavaScript'],
    githubLink: 'https://github.com/Shrikant1a'
  },
  seed: {
    badge: 'Supply Chain & Anti-Counterfeiting Web3',
    year: '2025',
    title: 'Seed-Tracking DApp (Solidity & Supply Chain)',
    description: 'An enterprise decentralized traceability solution for agricultural seeds to protect farmers against counterfeit seeds and assure seed quality from manufacturer to distributor.',
    architecture: 'Implements smart contracts handling product batch registration, unique cryptographic hashing for physical seed sacks, and multi-signature ownership handoffs along the distribution chain.',
    keyFeatures: [
      'Immutable product registration with batch timestamps and origin certification',
      'Verifiable ownership transfer log preventing black-market duplicate batches',
      'Gas-efficient storage patterns and secure access control matrix',
      'Open public audit log accessible by farmers via QR/address lookup',
      'Tested against common smart contract vulnerabilities with optimized execution gas'
    ],
    techStack: ['Solidity', 'Ethereum', 'Supply Chain Tech', 'Remix IDE', 'Security Testing', 'Web3.js'],
    githubLink: 'https://github.com/Shrikant1a'
  },
  fuel: {
    badge: 'Full Stack Enterprise Management',
    year: '2025',
    title: 'Fuel Management & Booking System',
    description: 'A full-stack commercial petrol pump automation and fleet management web application with real-time fuel inventory tracking and customer booking workflows.',
    architecture: 'Designed with a decoupled full-stack architecture: a dynamic React.js frontend styled with modern responsive components, connecting via REST APIs to a high-throughput Java backend with MySQL relational persistence.',
    keyFeatures: [
      'Dynamic fuel price recalculation engine and automated invoice generator',
      'Fleet booking management with scheduled pickup time slot allocation',
      'Station inventory level alerts and pump maintenance logging',
      'Secure credential authentication and role-based access control',
      'Responsive, high-contrast mobile dashboard for on-site station operators'
    ],
    techStack: ['React.js', 'Java', 'MySQL', 'JDBC', 'REST API', 'Tailwind CSS'],
    githubLink: 'https://github.com/Shrikant1a'
  },
  job: {
    badge: 'Full Stack Web Platform',
    year: '2024',
    title: 'Job Portal Web Application',
    description: 'A comprehensive recruitment platform connecting top talent with hiring managers, featuring resume submission pipelines, real-time application trackers, and employer dashboards.',
    architecture: 'Built using React.js for client-side rendering with Java backend REST services. Database queries and relational indexing in MySQL ensure sub-second response times for job searches and applicant listings.',
    keyFeatures: [
      'Role-based portals for Job Seekers and Corporate Recruiters',
      'Job listing creation, keyword filtering, salary tags, and instant apply',
      'Application tracking pipeline with status notifications (Applied, Review, Shortlisted)',
      'Secure user session management and parameterized SQL queries',
      'Fully responsive UI optimized for desktop, tablet, and mobile browsing'
    ],
    techStack: ['React.js', 'Java', 'MySQL', 'REST APIs', 'HTML5 & CSS3', 'Git'],
    githubLink: 'https://github.com/Shrikant1a'
  }
};

function initProjectModals() {
  const overlay = document.getElementById('projectModalOverlay');
  const contentContainer = document.getElementById('modalDynamicContent');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!overlay || !contentContainer) return;

  function openModal(projectId) {
    const data = PROJECT_DATABASE[projectId];
    if (!data) return;

    contentContainer.innerHTML = `
      <div>
        <span class="modal-header-badge">${data.badge} • ${data.year}</span>
        <h3 class="modal-title" style="margin-top: 10px;">${data.title}</h3>
      </div>

      <div class="modal-body-section">
        <h4>Overview</h4>
        <p>${data.description}</p>
      </div>

      <div class="modal-body-section">
        <h4>Architecture & Implementation</h4>
        <p>${data.architecture}</p>
      </div>

      <div class="modal-body-section">
        <h4>Key Highlights & Features</h4>
        <ul class="modal-list">
          ${data.keyFeatures.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-body-section">
        <h4>Technologies Used</h4>
        <div class="modal-tech-list">
          ${data.techStack.map((t) => `<span>${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color);">
        <a href="${data.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
          <i class="fa-brands fa-github"></i> View on GitHub
        </a>
        <button class="btn btn-secondary" id="modalDismissBtn">
          Close Preview
        </button>
      </div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Hook dismiss button inside dynamic content
    const dismissBtn = document.getElementById('modalDismissBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeModal);
    }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   11. Contact Form Handling & Real Email Delivery
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.userName.value.trim();
    const email = form.userEmail.value.trim();
    const subject = form.userSubject.value.trim();
    const message = form.userMessage.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all required fields.', 'info');
      return;
    }

    // Enter loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Send real email directly to Shrikant's Gmail inbox via FormSubmit API
      const response = await fetch('https://formsubmit.co/ajax/shrikantaher2004@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `New Portfolio Message: ${subject} (from ${name})`,
          message: message,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
        form.reset();
        showToast(`Thank you, ${name}! Your message has been delivered to my Gmail inbox.`, 'success');
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.warn('FormSubmit error, offering mailto fallback:', err);
      // Fallback: Open default mail client if network blocked
      showToast('Sending via direct mail client...', 'info');
      window.location.href = `mailto:shrikantaher2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* --------------------------------------------------------------------------
   12. Copy-to-Clipboard Functionality
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`, 'success');
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.', 'info');
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. Floating Scroll To Top Button
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   14. Toast Notification Engine
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconHtml = type === 'success' 
    ? '<i class="fa-solid fa-circle-check"></i>' 
    : '<i class="fa-solid fa-circle-info"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* --------------------------------------------------------------------------
   15. Current Year Auto Update
   -------------------------------------------------------------------------- */
function updateFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   16. WhatsApp AI Bot Interactive Engine
   -------------------------------------------------------------------------- */
function initWhatsAppBot() {
  const triggerBtn = document.getElementById('whatsappTriggerBtn');
  const chatWindow = document.getElementById('whatsappChatWindow');
  const closeBtn = document.getElementById('whatsappCloseBtn');
  const chatBody = document.getElementById('whatsappChatBody');
  const form = document.getElementById('whatsappChatForm');
  const input = document.getElementById('whatsappInput');
  const chips = document.querySelectorAll('#whatsappQuickChips .chip-btn');
  const statusEl = document.getElementById('whatsappStatus');

  if (!triggerBtn || !chatWindow || !chatBody || !form) return;

  let hasGreeted = false;

  // Toggle chat window
  triggerBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.contains('open');
    if (!isOpen) {
      chatWindow.classList.add('open');
      if (!hasGreeted) {
        hasGreeted = true;
        renderBotGreeting();
      }
      setTimeout(() => input.focus(), 300);
    } else {
      chatWindow.classList.remove('open');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  // Handle Quick Chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg') || chip.textContent;
      handleUserMessage(msg);
    });
  });

  // Handle Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;
    input.value = '';
    handleUserMessage(userText);
  });

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(sender, text, buttons = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    let buttonHtml = '';
    if (buttons.length > 0) {
      buttonHtml = `
        <div class="chat-msg-btn-wrap">
          ${buttons.map(b => `
            <a href="${b.link}" ${b.target ? `target="${b.target}"` : ''} class="chat-action-link" ${b.download ? `download="${b.download}"` : ''}>
              ${b.icon ? `<i class="${b.icon}"></i>` : ''} ${b.label}
            </a>
          `).join('')}
        </div>
      `;
    }

    const checkHtml = sender === 'user' ? '<span class="chat-check">✓✓</span>' : '';

    msgDiv.innerHTML = `
      <div class="chat-msg-text">${text}</div>
      ${buttonHtml}
      <div class="chat-msg-time">
        <span>${formatTime()}</span>
        ${checkHtml}
      </div>
    `;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'chatTypingIndicator';
    typingDiv.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (statusEl) statusEl.textContent = 'typing...';
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('chatTypingIndicator');
    if (typingDiv) typingDiv.remove();
    if (statusEl) statusEl.textContent = 'Online • Powered by AI';
  }

  function renderBotGreeting() {
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      appendMessage('bot', `Hi there! 👋 I am <strong>Shrikant's AI Portfolio Assistant</strong>.<br><br>How can I help you today? You can ask me anything about Shrikant's projects, skills, education, or talk directly on WhatsApp!`, [
        {
          label: 'Chat Directly on WhatsApp',
          link: 'https://wa.me/918149642840?text=Hi%20Shrikant,%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect!',
          target: '_blank',
          icon: 'fa-brands fa-whatsapp'
        }
      ]);
    }, 700);
  }

  function handleUserMessage(userText) {
    appendMessage('user', userText);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateAIResponse(userText);
      appendMessage('bot', botResponse.text, botResponse.buttons);
    }, 750);
  }

  // Knowledge Base & Response Generation
  function generateAIResponse(query) {
    const q = query.toLowerCase();

    // 1. Greetings
    if (/^(hi|hello|hey|hola|namaste|morning|afternoon|evening|sup|yo)/.test(q)) {
      return {
        text: `Hello! 👋 Great to meet you! How can I assist you with Shrikant's portfolio or career profile?`,
        buttons: [
          { label: '🚀 Explore Projects', link: '#projects' },
          { label: '🛠️ View Skills', link: '#skills' }
        ]
      };
    }

    // 2. Who is Shrikant / About / Bio
    if (q.includes('who is') || q.includes('about') || q.includes('bio') || q.includes('profile') || q.includes('introduce')) {
      return {
        text: `<strong>Shrikant Aher</strong> is a motivated Software Developer & Blockchain Specialist based in <strong>Pune, Maharashtra</strong>.<br><br>He holds a <strong>BCS (8.84 CGPA)</strong> and an <strong>Advanced PGD in Blockchain Technology (8.32 CGPA)</strong> from Savitribai Phule Pune University, and builds high-performance DApps and Full-Stack web applications.`,
        buttons: [
          { label: 'Read Full About Me', link: '#about' },
          { label: 'Download Resume', link: 'assets/resume-software-developer.pdf', target: '_blank', download: 'Shrikant_Aher_Resume.pdf', icon: 'fa-solid fa-file-pdf' }
        ]
      };
    }

    // 3. Projects & DApps
    if (q.includes('project') || q.includes('dapp') || q.includes('voting') || q.includes('seed') || q.includes('fuel') || q.includes('job') || q.includes('work')) {
      return {
        text: `Here are Shrikant's key featured projects:<br><br>
        1. 🗳️ <strong>Decentralized Voting System (DApp)</strong>: Secure Ethereum smart contract with one-vote-per-address logic.<br>
        2. 🌱 <strong>Seed-Tracking DApp</strong>: Blockchain supply chain anti-counterfeit traceability.<br>
        3. ⛽ <strong>Fuel Management System</strong>: React, Java, MySQL petrol pump fleet manager.<br>
        4. 💼 <strong>Job Portal Web App</strong>: Role-based recruiter and applicant pipeline.`,
        buttons: [
          { label: 'View Projects Section', link: '#projects' },
          { label: 'View GitHub Profile', link: 'https://github.com/Shrikant1a', target: '_blank', icon: 'fa-brands fa-github' }
        ]
      };
    }

    // 4. Skills & Tech Stack
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('solidity') || q.includes('react') || q.includes('java') || q.includes('mysql') || q.includes('languages')) {
      return {
        text: `Shrikant's core technical toolkit:<br><br>
        • <strong>Blockchain & Web3</strong>: Solidity, Ethereum EVM, Stellar/Soroban, MetaMask, Remix<br>
        • <strong>Frontend</strong>: React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS<br>
        • <strong>Backend & DB</strong>: Java (Core + Advanced), MySQL, JDBC, REST APIs, Golang basics<br>
        • <strong>Testing & Tools</strong>: Selenium Automation, Manual Testing, Git/GitHub, Postman, VS Code`,
        buttons: [
          { label: 'Interactive Skills Matrix', link: '#skills' }
        ]
      };
    }

    // 5. Internships & Experience
    if (q.includes('experience') || q.includes('intern') || q.includes('snp') || q.includes('rise in') || q.includes('company')) {
      return {
        text: `Shrikant has completed 2 specialized industry internships:<br><br>
        1. 🌟 <strong>RISE IN (Stellar Ecosystem)</strong> — Blockchain Intern (March 2026 – May 2026)<br>
        2. 🏢 <strong>SNP Innovation Pvt. Ltd</strong> — Blockchain Developer Intern (Sept 2025 – Feb 2026)`,
        buttons: [
          { label: 'View Work Timeline', link: '#experience' }
        ]
      };
    }

    // 6. Education & CGPA
    if (q.includes('education') || q.includes('cgpa') || q.includes('degree') || q.includes('college') || q.includes('university') || q.includes('sppu') || q.includes('marks')) {
      return {
        text: `Shrikant's academic achievements at <strong>Savitribai Phule Pune University</strong>:<br><br>
        • 🎓 <strong>PGD in Blockchain Technology</strong>: 8.32 / 10.0 CGPA (Distinction)<br>
        • 🎓 <strong>Bachelor of Computer Science (BCS)</strong>: 8.84 / 10.0 CGPA (Top Grade)<br>
        • 🏫 <strong>HSC 12th</strong>: 84.80% (Distinction)`,
        buttons: [
          { label: 'View Education Details', link: '#education' }
        ]
      };
    }

    // 7. Resumes / CV
    if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
      return {
        text: `You can download Shrikant's verified resumes below:`,
        buttons: [
          { label: '📄 Software Developer CV', link: 'assets/resume-software-developer.pdf', target: '_blank', download: 'Shrikant_Aher_Software_Dev_Resume.pdf' },
          { label: '⚡ Blockchain Tech CV', link: 'assets/resume-blockchain.pdf', target: '_blank', download: 'Shrikant_Aher_Blockchain_Resume.pdf' }
        ]
      };
    }

    // 8. Contact / Phone / Email / Hire
    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('whatsapp') || q.includes('reach') || q.includes('location')) {
      return {
        text: `Here is how you can connect with Shrikant directly:<br><br>
        • 📱 <strong>Phone / WhatsApp</strong>: +91 8149642840<br>
        • ✉️ <strong>Email</strong>: shrikantaher2004@gmail.com<br>
        • 📍 <strong>Location</strong>: Pune, Maharashtra 411009`,
        buttons: [
          {
            label: '💬 Chat on WhatsApp (+91 8149642840)',
            link: 'https://wa.me/918149642840?text=Hi%20Shrikant,%20I%20am%20interested%20in%20discussing%20an%20opportunity%20with%20you!',
            target: '_blank',
            icon: 'fa-brands fa-whatsapp'
          },
          { label: 'Send Message via Form', link: '#contact' }
        ]
      };
    }

    // Default Fallback
    const encodedUserQuery = encodeURIComponent(`Hi Shrikant, I visited your portfolio and wanted to ask: "${query}"`);
    return {
      text: `That's a great question! For a detailed answer or direct collaboration, you can chat directly with Shrikant on WhatsApp:`,
      buttons: [
        {
          label: '💬 Ask Shrikant on WhatsApp',
          link: `https://wa.me/918149642840?text=${encodedUserQuery}`,
          target: '_blank',
          icon: 'fa-brands fa-whatsapp'
        },
        { label: 'Send via Contact Form', link: '#contact' }
      ]
    };
  }
}

