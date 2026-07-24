/**
 * MAJOJU VAISHNAVI — PORTFOLIO WEBSITE JAVASCRIPT
 * Engineered with clean practices, interactive features, and premium micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GENERAL UTILITIES & SCROLL HANDLER
    // ==========================================
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle logic
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon visual if needed
        });

        // Close menu when links are clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 2. MOUSE-TRACKING GLOW EFFECT
    // ==========================================
    const mouseGlow = document.getElementById('mouse-glow');
    
    if (mouseGlow) {
        document.addEventListener('mousemove', (e) => {
            // Keep the glow spot centered on the cursor
            // Use clientX / clientY and offset with scroll position for absolute positioning
            const posX = e.pageX;
            const posY = e.pageY;
            
            mouseGlow.style.opacity = '1';
            mouseGlow.style.left = `${posX}px`;
            mouseGlow.style.top = `${posY}px`;
        });

        document.addEventListener('mouseleave', () => {
            mouseGlow.style.opacity = '0';
        });
    }


    // ==========================================
    // 3. THEME DRAWER SWITCHER CONTROLLER
    // ==========================================
    const themeBtn = document.getElementById('theme-panel-btn');
    const themeDrawer = document.getElementById('theme-drawer');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeDesc = document.getElementById('theme-desc');

    if (themeBtn && themeDrawer) {
        // Toggle theme drawer open/closed
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDrawer.classList.toggle('active');
        });

        // Close theme drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeDrawer.contains(e.target) && e.target !== themeBtn) {
                themeDrawer.classList.remove('active');
            }
        });

        // Theme switching options
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const themeId = option.getAttribute('data-theme-id');
                
                // Remove active classes
                themeOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked item
                option.classList.add('active');
                
                // Apply theme attribute to html document
                if (themeId === 'oceanic') {
                    document.documentElement.removeAttribute('data-theme');
                    themeDesc.innerText = "Minimal Slate";
                    localStorage.setItem('portfolio-theme', 'oceanic');
                } else {
                    document.documentElement.setAttribute('data-theme', themeId);
                    themeDesc.innerText = option.querySelector('span').innerText;
                    localStorage.setItem('portfolio-theme', themeId);
                }
            });
        });

        // Load saved theme on boot
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme && savedTheme !== 'oceanic') {
            const activeOption = document.querySelector(`.theme-option[data-theme-id="${savedTheme}"]`);
            if (activeOption) {
                activeOption.click();
            }
        }
    }


    // ==========================================
    // 4. AESTHETICS TYPING EFFECT
    // ==========================================
    const typedOutput = document.getElementById('typed-output');
    const greetings = [
        "Software Engineer",
        "Java & Spring Boot Developer",
        "Backend Engineer",
        "Full Stack Developer",
        "AI/ML Enthusiast",
        "FastAPI Developer"
    ];
    let greetIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function handleTyping() {
        if (!typedOutput) return;

        const currentText = greetings[greetIndex];
        
        if (isDeleting) {
            typedOutput.innerText = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30; // backspace faster
        } else {
            typedOutput.innerText = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 60; // typing speed
        }

        // Handle states transition
        if (!isDeleting && charIndex === currentText.length) {
            // Completed typing, pause before deleting
            isDeleting = true;
            typingSpeed = 2200; // Pause at full string
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            greetIndex = (greetIndex + 1) % greetings.length; // move to next greeting
            typingSpeed = 500; // pause before typing next
        }

        setTimeout(handleTyping, typingSpeed);
    }

    // Initialize typing
    if (typedOutput) {
        setTimeout(handleTyping, 1000);
    }


    // ==========================================
    // 5. INTERACTIVE TERMINAL EMULATOR
    // ==========================================
    const termInput = document.getElementById('term-input');
    const termOutput = document.getElementById('term-output');
    const termBody = document.getElementById('term-body');
    const termCaret = document.getElementById('term-caret');

    if (termInput && termOutput && termBody) {
        
        // Focus input field when clicking anywhere in terminal body
        termBody.addEventListener('click', () => {
            termInput.focus();
        });

        // Sync caret position with text length inside input
        const updateCaretPosition = () => {
            if (!termCaret) return;
            const textLength = termInput.value.length;
            // Approximate letter width in mono font
            const charWidth = 8.5; 
            termCaret.style.left = `${textLength * charWidth + 2}px`;
        };

        termInput.addEventListener('input', updateCaretPosition);
        termInput.addEventListener('keydown', updateCaretPosition);

        // Command handler
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = termInput.value.trim().toLowerCase();
                
                // Echo command back to terminal
                echoCommand(termInput.value);
                
                // Process command
                processCommand(command);
                
                // Clear input field & reset caret
                termInput.value = '';
                if (termCaret) termCaret.style.left = '2px';
                
                // Scroll to bottom
                setTimeout(() => {
                    termBody.scrollTop = termBody.scrollHeight;
                }, 20);
            }
        });

        const echoCommand = (rawText) => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `
                <span class="terminal-prompt">vaishnavi@uceou:~$</span>
                <span style="color: #ffffff;">${escapeHTML(rawText)}</span>
            `;
            termOutput.appendChild(line);
        };

        const processCommand = (cmd) => {
            const responseBlock = document.createElement('div');
            responseBlock.style.margin = '5px 0 15px 0';
            
            switch (cmd) {
                case '':
                    // Do nothing for blank line
                    return;
                    
                case 'help':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Available commands:</div>
                        <span class="terminal-green">about</span>       &mdash; Professional introduction<br>
                        <span class="terminal-green">skills</span>      &mdash; Technical skills by category<br>
                        <span class="terminal-green">projects</span>    &mdash; Featured engineering projects<br>
                        <span class="terminal-green">experience</span>  &mdash; Work experience summary<br>
                        <span class="terminal-green">internship</span>  &mdash; Current internship details<br>
                        <span class="terminal-green">education</span>   &mdash; Academic background<br>
                        <span class="terminal-green">opensource</span>  &mdash; Open-source contributions<br>
                        <span class="terminal-green">techstack</span>   &mdash; Full technology stack<br>
                        <span class="terminal-green">resume</span>      &mdash; Open resume PDF<br>
                        <span class="terminal-green">github</span>      &mdash; Open GitHub profile<br>
                        <span class="terminal-green">linkedin</span>    &mdash; Open LinkedIn profile<br>
                        <span class="terminal-green">contact</span>     &mdash; Contact information<br>
                        <span class="terminal-green">clear</span>       &mdash; Clear terminal output<br><br>
                        <span style="color: var(--text-secondary); font-size:0.8rem;">Tip: Try typing <span class="terminal-yellow">secret</span> for a surprise.</span>
                    `;
                    break;
                    
                case 'about':
                    responseBlock.innerHTML = `
                        <span class="terminal-yellow" style="font-weight:600;">$ whoami</span><br><br>
                        <b>Majoju Vaishnavi</b> &mdash; Software Engineering student &amp; Backend-focused Developer.<br><br>
                        I am a final-year BE CSE student at <span class="terminal-accent">University College of Engineering, Osmania University</span> (CGPA: 9.4/10, graduating 2027).<br><br>
                        I am passionate about building <b>scalable backend systems</b>, <b>AI-integrated applications</b>, and <b>modern web interfaces</b>. I enjoy solving algorithmic problems and translating CS fundamentals into production-quality software.<br><br>
                        Currently interning at <span class="terminal-pink" style="font-weight:600;">IRA Labs</span> as a Mobile Application Intern, working with React Native and FastAPI.
                    `;
                    break;
                    
                case 'skills':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Technical Skills</div>
                        <span class="terminal-yellow">[Languages]</span>  Java &middot; Python &middot; JavaScript (ES6+) &middot; SQL<br>
                        <span class="terminal-yellow">[Backend]  </span>  Spring Boot &middot; FastAPI &middot; Node.js &middot; REST APIs<br>
                        <span class="terminal-yellow">[Frontend] </span>  React.js &middot; HTML5 &middot; CSS3 &middot; Tailwind CSS<br>
                        <span class="terminal-yellow">[Databases]</span>  PostgreSQL &middot; MongoDB &middot; MySQL &middot; SQLite<br>
                        <span class="terminal-yellow">[Cloud]    </span>  Docker &middot; Render &middot; AWS (learning) &middot; GCP (learning)<br>
                        <span class="terminal-yellow">[AI/ML]    </span>  Scikit-Learn &middot; XGBoost &middot; Gemini API &middot; RAG<br>
                        <span class="terminal-yellow">[Mobile]   </span>  React Native &middot; Flutter &middot; Android SDK<br>
                        <span class="terminal-yellow">[Tools]    </span>  Git &middot; GitHub &middot; Postman &middot; VS Code &middot; IntelliJ IDEA
                    `;
                    break;
                    
                case 'projects':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Featured Projects</div>
                        1. <span class="terminal-accent" style="font-weight:600;">PCOS Tracker &amp; Personalization Platform</span><br>
                        &nbsp;&nbsp;&nbsp;A full-stack clinical decision support platform that predicts PCOS risk and generates personalized wellness recommendations using AI. Stack: FastAPI &middot; React.js &middot; MongoDB<br><br>
                        2. <span class="terminal-accent" style="font-weight:600;">Women Safety App</span><br>
                        &nbsp;&nbsp;&nbsp;A voice-activated safety application designed to detect keywords in the background and dispatch location tracking details. Stack: Java &middot; Android SDK &middot; Flask &middot; SQLite<br><br>
                        3. <span class="terminal-accent" style="font-weight:600;">Multi-Tenant SaaS Backend</span><br>
                        &nbsp;&nbsp;&nbsp;A production-grade multi-tenant subscription backend engine featuring strict data isolation and scalable billing infrastructure. Stack: Java &middot; Spring Boot &middot; PostgreSQL &middot; Docker &middot; JWT Auth<br><br>
                        4. <span class="terminal-accent" style="font-weight:600;">NexisAI &mdash; Multi-Agent Orchestrator</span><br>
                        &nbsp;&nbsp;&nbsp;A multi-agent framework orchestrator designed to run automated task delegation and context syncing. Stack: Python &middot; RAG &middot; Node.js &middot; LLM APIs<br><br>
                        5. <span class="terminal-accent" style="font-weight:600;">ScribeAI &mdash; Technical Interview Prep</span><br>
                        &nbsp;&nbsp;&nbsp;An interactive browser coaching simulator built to grade user answers during virtual technical practice runs. Stack: JavaScript &middot; HTML5 &middot; CSS Grid &middot; RegEx<br><br>
                        6. <span class="terminal-accent" style="font-weight:600;">SnapLink &mdash; URL Shortener</span><br>
                        &nbsp;&nbsp;&nbsp;A high-performance URL shortener engine equipped with custom aliases and custom rate limit protections. Stack: Java &middot; Spring Boot &middot; PostgreSQL &middot; JavaScript
                    `;
                    break;

                case 'experience':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Work Experience</div>
                        <span class="terminal-yellow" style="font-weight:600;">Mobile Application Intern</span> &mdash; IRA Labs<br>
                        <span style="color: var(--text-secondary);">May 2026 &mdash; Present</span><br><br>
                        &bull; Developing React Native features with AI-assisted workflows.<br>
                        &bull; Building and integrating FastAPI backend endpoints for the mobile client.<br>
                        &bull; Researching cloud deployment strategies on AWS and GCP.<br>
                        &bull; Contributing to Android/iOS deployment and app store submission pipelines.
                    `;
                    break;

                case 'internship':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Current Internship</div>
                        <span class="terminal-yellow">Role       :</span> Mobile Application Intern<br>
                        <span class="terminal-yellow">Company    :</span> IRA Labs<br>
                        <span class="terminal-yellow">Duration   :</span> May 2026 &mdash; Present<br>
                        <span class="terminal-yellow">Stack      :</span> React Native &middot; FastAPI &middot; AWS &middot; GCP &middot; Android &middot; iOS<br><br>
                        <span class="terminal-yellow">Responsibilities:</span><br>
                        &bull; Building mobile UI components in React Native using AI-assisted development.<br>
                        &bull; Designing and integrating FastAPI endpoints for backend-mobile communication.<br>
                        &bull; Researching cloud deployment options for mobile application backends.<br>
                        &bull; Working on Android and iOS deployment pipelines including app signing.
                    `;
                    break;

                case 'education':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Education</div>
                        <span class="terminal-yellow">Degree     :</span> Bachelor of Engineering &mdash; Computer Science & Engineering<br>
                        <span class="terminal-yellow">Institution:</span> University College of Engineering, Osmania University (UCE, OU)<br>
                        <span class="terminal-yellow">Duration   :</span> 2023 &mdash; 2027<br>
                        <span class="terminal-yellow">CGPA       :</span> 9.4 / 10<br><br>
                        <span class="terminal-yellow">Core Subjects:</span><br>
                        Data Structures &middot; Algorithms &middot; Operating Systems &middot; Computer Networks &middot; DBMS &middot; Software Engineering<br><br>
                        Actively building full-stack and AI projects to apply coursework in real engineering contexts.
                    `;
                    break;

                case 'opensource':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Open Source Contributions</div>
                        &bull; <span class="terminal-accent">accordproject/template-playground</span> &mdash; <a href="https://github.com/accordproject/template-playground/pull/702" target="_blank" style="color:var(--accent-1); text-decoration:underline;">PR #702</a><br>
                        &nbsp;&nbsp;&nbsp;Redesigned the default Service Agreement template for a realistic legal use case.<br><br>
                        &bull; <span class="terminal-accent">accordproject/techdocs</span> &mdash; <a href="https://github.com/accordproject/techdocs/pull/485" target="_blank" style="color:var(--accent-1); text-decoration:underline;">PR #485</a><br>
                        &nbsp;&nbsp;&nbsp;Fixed broken VS Code extension links in technical documentation, improving developer onboarding.<br><br>
                        <span style="color: var(--text-secondary); font-size: 0.8rem;">GitHub: <a href="https://github.com/mi-vaishnavi" target="_blank" style="color:var(--accent-1); text-decoration:underline;">github.com/mi-vaishnavi</a></span>
                    `;
                    break;

                case 'techstack':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Full Technology Stack</div>
                        <span class="terminal-green"># Languages</span><br>
                        Java &middot; Python &middot; JavaScript &middot; SQL<br><br>
                        <span class="terminal-green"># Backend</span><br>
                        Spring Boot 3 &middot; FastAPI &middot; Node.js &middot; Express.js &middot; Flask &middot; REST APIs &middot; JWT Auth<br><br>
                        <span class="terminal-green"># Frontend</span><br>
                        React.js &middot; HTML5 &middot; CSS3 &middot; Tailwind CSS<br><br>
                        <span class="terminal-green"># Databases</span><br>
                        PostgreSQL &middot; MongoDB &middot; MySQL &middot; SQLite<br><br>
                        <span class="terminal-green"># Cloud &amp; DevOps</span><br>
                        Docker &middot; Git &middot; GitHub &middot; Render &middot; AWS (learning) &middot; GCP (learning)<br><br>
                        <span class="terminal-green"># AI / ML</span><br>
                        Scikit-Learn &middot; XGBoost &middot; Gemini API &middot; RAG Pipelines<br><br>
                        <span class="terminal-green"># Mobile</span><br>
                        React Native &middot; Flutter &middot; Android SDK
                    `;
                    break;

                case 'resume':
                    window.open('assets/my_resume.pdf', '_blank');
                    responseBlock.innerHTML = `<span class="terminal-green">[OK]</span> Opening resume in a new tab...`;
                    break;

                case 'github':
                    window.open('https://github.com/mi-vaishnavi', '_blank');
                    responseBlock.innerHTML = `<span class="terminal-green">[OK]</span> Opening GitHub profile: <a href="https://github.com/mi-vaishnavi" target="_blank" style="color:var(--accent-1);">github.com/mi-vaishnavi</a>`;
                    break;

                case 'linkedin':
                    window.open('https://www.linkedin.com/in/majoju-vaishnavi-244945299/', '_blank');
                    responseBlock.innerHTML = `<span class="terminal-green">[OK]</span> Opening LinkedIn profile...`;
                    break;

                case 'contact':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Contact Information</div>
                        <span class="terminal-yellow">Email    :</span> <a href="mailto:majojuvaishnavi@gmail.com" style="color:var(--accent-1);">majojuvaishnavi@gmail.com</a><br>
                        <span class="terminal-yellow">GitHub   :</span> <a href="https://github.com/mi-vaishnavi" target="_blank" style="color:var(--accent-1);">github.com/mi-vaishnavi</a><br>
                        <span class="terminal-yellow">LinkedIn :</span> <a href="https://www.linkedin.com/in/majoju-vaishnavi-244945299/" target="_blank" style="color:var(--accent-1);">linkedin.com/in/majoju-vaishnavi</a><br>
                        <span class="terminal-yellow">Location :</span> Hyderabad, Telangana, India<br><br>
                        Open to: SWE roles &middot; Backend internships &middot; Open source &middot; Full-stack collaboration
                    `;
                    break;
                    
                case 'clear':
                    termOutput.innerHTML = '';
                    return;
                    
                case 'secret':
                    responseBlock.innerHTML = `
                        <div class="terminal-yellow">Initializing authentication sequence...</div>
                        <div style="font-family: monospace; font-size: 0.75rem; color: #10b981; margin: 6px 0;">
                            [SYSTEM] Loading candidate profile... OK<br>
                            [SYSTEM] Evaluating technical depth... PASS<br>
                            [SYSTEM] Checking open-source activity... PASS<br>
                            [SYSTEM] Running final assessment... COMPLETE
                        </div>
                        <div style="border: 1px dashed var(--accent-1); padding: 12px; border-radius: 6px; background: rgba(var(--accent-1-rgb), 0.05); text-align: center;">
                            <span class="terminal-pink" style="font-weight:800; font-size: 1.1rem;">EASTER EGG UNLOCKED 🌟</span><br>
                            <span style="color: #fff; font-size: 0.85rem;">Hiring Manager Token:</span><br>
                            <span class="terminal-green" style="font-family:var(--font-mono); font-weight:700; font-size:1rem; letter-spacing:1px;">HIRE_VAISHNAVI_2026</span><br>
                            <span style="color: var(--text-secondary); font-size: 0.75rem; display:block; margin-top:6px;">Result: Strong match for backend and full-stack engineering roles.</span>
                        </div>
                    `;
                    break;
                    
                default:
                    responseBlock.innerHTML = `
                        <span style="color: #ef4444;">Command not found: '${escapeHTML(cmd)}'</span><br>
                        Type <span class="terminal-green">help</span> to check valid terminal instructions.
                    `;
            }
            
            termOutput.appendChild(responseBlock);
        };

        const escapeHTML = (text) => {
            const div = document.createElement('div');
            div.innerText = text;
            return div.innerHTML;
        };
    }


    // ==========================================
    // 6. PROJECTS INTERACTIVE GRID FILTER
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns && projectCards) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active classes
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterVal = btn.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    
                    if (filterVal === 'all' || cardCat === filterVal) {
                        // Show card with smooth animation
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    } else {
                        // Hide card
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px) scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }


    // ==========================================
    // 7. SKILLS DASHBOARD ANIMATE-ON-SCROLL
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    if (skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.getAttribute('data-percentage');
                    bar.style.width = percentage;
                    // Unobserve to keep static after first load
                    observer.unobserve(bar);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        skillBars.forEach(bar => {
            skillsObserver.observe(bar);
        });
    }


    // ==========================================
    // 8. CONTACT FORM DYNAMIC VALIDATION & SUBMIT
    // ==========================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status-msg');

    if (contactForm && formStatus) {
        
        // Handle floating labels dynamic checks
        const formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            // Fallback checking to keep label active if autocomplete inputs are active
            input.addEventListener('change', () => {
                if (input.value.trim() !== "") {
                    input.setAttribute('value', input.value);
                } else {
                    input.removeAttribute('value');
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameField = document.getElementById('form-name');
            const emailField = document.getElementById('form-email');
            const msgField = document.getElementById('form-message');
            const submitBtn = document.getElementById('btn-submit-form');
            
            let isValid = true;
            formStatus.className = 'form-status';
            formStatus.innerText = '';
            
            // Basic Form Checks
            if (nameField.value.trim().length < 2) {
                showFieldError(nameField, "Please provide your full name.");
                isValid = false;
            } else {
                clearFieldError(nameField);
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showFieldError(emailField, "Please provide a valid email address.");
                isValid = false;
            } else {
                clearFieldError(emailField);
            }
            
            if (msgField.value.trim().length < 10) {
                showFieldError(msgField, "Your message should contain at least 10 characters.");
                isValid = false;
            } else {
                clearFieldError(msgField);
            }
            
            if (!isValid) {
                formStatus.classList.add('error');
                formStatus.innerText = "Please correct the highlighted inputs before transmission.";
                return;
            }
            
            // Real email submission using Web3Forms (100% Free & Serverless)
            // Get your free Access Key at: https://web3forms.com/
            const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY_HERE"; 

            submitBtn.disabled = true;
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span class="terminal-prompt" style="animation: cursor-blink 0.6s infinite;">📡 Transmitting packet...</span>
            `;

            const payload = {
                access_key: WEB3FORMS_ACCESS_KEY,
                name: nameField.value.trim(),
                email: emailField.value.trim(),
                message: msgField.value.trim(),
                subject: `Portfolio Contact from ${nameField.value.trim()}`
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    // Success feedback state
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `
                        <strong>Packet Transmitted Successfully!</strong><br>
                        Thank you, ${escapeHTML(nameField.value)}. Your connection request has been securely routed directly to my inbox.
                    `;
                    
                    // Clear fields
                    contactForm.reset();
                    formInputs.forEach(input => input.removeAttribute('value'));
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.innerText = json.message || "Failed to route packet. Please check Web3Forms configuration.";
                }
            })
            .catch(error => {
                formStatus.className = 'form-status error';
                formStatus.innerText = "Network transmission failed. Please check your internet connection.";
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            });
        });

        const showFieldError = (field, message) => {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.2)';
            field.setAttribute('title', message);
        };

        const clearFieldError = (field) => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.removeAttribute('title');
        };
        const escapeHTML = (text) => {
            const div = document.createElement('div');
            div.innerText = text;
            return div.innerHTML;
        };
    }

    // ==========================================
    // 9. CUSTOM EYE CURSOR TRACKING
    // ==========================================
    const customCursor = document.getElementById('custom-cursor');
    const cursorEye = customCursor ? customCursor.querySelector('.cursor-eye') : null;
    const cursorPupil = customCursor ? customCursor.querySelector('.cursor-pupil') : null;

    if (customCursor && cursorEye && cursorPupil) {
        let mouseX = 0;
        let mouseY = 0;
        let eyeX = 0;
        let eyeY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let currentOffsetX = 0;
        let currentOffsetY = 0;
        let targetOffsetX = 0;
        let targetOffsetY = 0;
        let cursorVisible = false;
        let touchDevice = false;

        // Smoothly interpolate position (lerp)
        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

        const updateCursorPosition = () => {
            if (touchDevice) return;

            // Lerp outer eye container towards target mouse position
            eyeX = lerp(eyeX, mouseX, 0.2);
            eyeY = lerp(eyeY, mouseY, 0.2);

            // Apply translation to the main cursor wrapper
            customCursor.style.transform = `translate3d(${eyeX}px, ${eyeY}px, 0)`;

            // Calculate mouse velocity/direction of motion
            const mdx = mouseX - lastMouseX;
            const mdy = mouseY - lastMouseY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            // Only update target offset if there is active mouse movement
            if (mDist > 0.5) {
                const maxOffset = 5; // Maximum offset distance inside the eye
                targetOffsetX = (mdx / mDist) * maxOffset;
                targetOffsetY = (mdy / mDist) * maxOffset;
            }

            // Smoothly interpolate the current pupil offset towards target direction
            currentOffsetX = lerp(currentOffsetX, targetOffsetX, 0.08);
            currentOffsetY = lerp(currentOffsetY, targetOffsetY, 0.08);

            // Move the pupil element relative to its default center position
            cursorPupil.style.transform = `translate(calc(-50% + ${currentOffsetX}px), calc(-50% + ${currentOffsetY}px))`;

            // Save last positions for velocity calculation
            lastMouseX = mouseX;
            lastMouseY = mouseY;

            requestAnimationFrame(updateCursorPosition);
        };

        // Capture mouse moves
        document.addEventListener('mousemove', (e) => {
            // If touch interface was activated, switch back to mouse mode if mouse movement is detected
            if (touchDevice) {
                touchDevice = false;
                document.body.classList.add('has-custom-cursor');
                customCursor.style.opacity = '1';
                requestAnimationFrame(updateCursorPosition);
            }

            // Initialize lastMouse position on first move to prevent velocity spikes
            if (!cursorVisible) {
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                eyeX = e.clientX;
                eyeY = e.clientY;
                customCursor.style.opacity = '1';
                cursorVisible = true;
                document.body.classList.add('has-custom-cursor');
            }

            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Handle page focus/hover entries
        document.addEventListener('mouseenter', () => {
            if (!touchDevice) {
                customCursor.style.opacity = '1';
                cursorVisible = true;
                document.body.classList.add('has-custom-cursor');
            }
        });

        document.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
            cursorVisible = false;
            document.body.classList.remove('has-custom-cursor');
        });

        // Hide custom cursor on mobile touch interactions
        document.addEventListener('touchstart', () => {
            touchDevice = true;
            cursorVisible = false;
            customCursor.style.opacity = '0';
            document.body.classList.remove('has-custom-cursor');
        });

        // Event delegation for cursor hover states (normal interactive vs text inputs)
        document.addEventListener('mouseover', (e) => {
            if (touchDevice) return;

            const target = e.target;
            if (!target) return;

            // Check if hovering over text inputs
            if (target.closest('input[type="text"], input[type="email"], textarea')) {
                customCursor.classList.add('text-hovered');
                customCursor.classList.remove('hovered');
            }
            // Check if hovering over standard links, buttons, and interactive cards
            else if (target.closest('a, button, [role="button"], .theme-option, .project-card, .filter-btn, .logo')) {
                customCursor.classList.add('hovered');
                customCursor.classList.remove('text-hovered');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (touchDevice) return;

            const related = e.relatedTarget;
            
            // Remove text hovered class if we moved out of text input
            if (!related || !related.closest('input[type="text"], input[type="email"], textarea')) {
                customCursor.classList.remove('text-hovered');
            }
            
            // Remove hover class if we moved out of interactive buttons/links
            if (!related || !related.closest('a, button, [role="button"], .theme-option, .project-card, .filter-btn, .logo')) {
                customCursor.classList.remove('hovered');
            }
        });

        // Start render loop
        requestAnimationFrame(updateCursorPosition);
    }

    // ==========================================
    // 10. TECH BACKGROUND CANVAS
    // ==========================================
    const techCanvas = document.getElementById('tech-bg-canvas');
    if (techCanvas) {
        const ctx = techCanvas.getContext('2d');

        // -- Helper: read CSS variable accent color --
        function getAccentRgb() {
            const raw = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-1-rgb').trim();
            if (raw) {
                const parts = raw.split(',').map(v => parseInt(v.trim(), 10));
                if (parts.length === 3) return parts;
            }
            return [37, 99, 235]; // fallback: Slate Blue
        }

        // -- Resize canvas to fill viewport --
        function resizeCanvas() {
            techCanvas.width = window.innerWidth;
            techCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // -- Particle configuration --
        const PARTICLE_COUNT = 55;
        const MAX_CONNECT_DIST = 160;
        const MOUSE_REPEL_DIST = 120;
        let particles = [];
        let mousePos = { x: -9999, y: -9999 };

        document.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        class Particle {
            constructor() { this.reset(true); }
            reset(random) {
                this.x = Math.random() * techCanvas.width;
                this.y = random
                    ? Math.random() * techCanvas.height
                    : -10;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.radius = Math.random() * 1.8 + 0.6;
                this.opacity = Math.random() * 0.5 + 0.25;
                this.pulseSpeed = Math.random() * 0.02 + 0.008;
                this.pulsePhase = Math.random() * Math.PI * 2;
                // Circuit node flag: ~25% of particles are "nodes" (slightly bigger, ring shape)
                this.isNode = Math.random() < 0.25;
                if (this.isNode) this.radius = Math.random() * 1.4 + 1.8;
            }
            update(t) {
                // Gentle drift
                this.x += this.vx;
                this.y += this.vy;

                // Soft mouse repulsion
                const dx = this.x - mousePos.x;
                const dy = this.y - mousePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_REPEL_DIST) {
                    const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
                    this.x += dx / dist * force * 1.2;
                    this.y += dy / dist * force * 1.2;
                }

                // Wrap around edges with a small buffer
                const buf = 40;
                if (this.x < -buf) this.x = techCanvas.width + buf;
                else if (this.x > techCanvas.width + buf) this.x = -buf;
                if (this.y < -buf) this.y = techCanvas.height + buf;
                else if (this.y > techCanvas.height + buf) this.y = -buf;

                // Pulsing opacity
                this.currentOpacity = this.opacity + Math.sin(t * this.pulseSpeed + this.pulsePhase) * 0.12;
            }
            draw(r, g, b) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, this.currentOpacity));
                if (this.isNode) {
                    // Hollow ring node with glow
                    ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
                    ctx.shadowBlur = 8;
                    ctx.strokeStyle = `rgba(${r},${g},${b},${this.currentOpacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    // Small solid inner dot
                    ctx.fillStyle = `rgba(${r},${g},${b},${this.currentOpacity * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * 0.35, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
                    ctx.shadowBlur = 5;
                    ctx.fillStyle = `rgba(${r},${g},${b},${this.currentOpacity})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        // -- Circuit trace path class --
        // Draws an L-shaped or Z-shaped line that slowly crawls across the canvas
        const CIRCUIT_COUNT = 6;
        class CircuitTrace {
            constructor() { this.init(); }
            init() {
                // Starting point
                this.x1 = Math.random() * techCanvas.width;
                this.y1 = Math.random() * techCanvas.height;
                // Random axis-aligned length
                this.len1 = Math.random() * 120 + 60;
                this.len2 = Math.random() * 80 + 40;
                this.horiz = Math.random() < 0.5; // first segment horizontal?
                this.speed = Math.random() * 0.003 + 0.001;
                this.progress = 0; // 0 → 1 draw in, 1 → 2 draw out
                this.opacity = Math.random() * 0.12 + 0.06;
                this.lifetime = Math.random() * 300 + 200; // frames
                this.age = Math.floor(Math.random() * this.lifetime); // stagger
                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = (Math.random() - 0.5) * 0.15;
            }
            update() {
                this.age++;
                this.x1 += this.vx;
                this.y1 += this.vy;
                if (this.age > this.lifetime) this.init();
            }
            draw(r, g, b) {
                const prog = this.age / this.lifetime;
                // Fade in first quarter, solid middle, fade out last quarter
                let alpha = this.opacity;
                if (prog < 0.2) alpha *= prog / 0.2;
                else if (prog > 0.8) alpha *= (1 - prog) / 0.2;

                ctx.save();
                ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.lineCap = 'square';
                ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 1.5})`;
                ctx.shadowBlur = 4;
                ctx.beginPath();
                if (this.horiz) {
                    // Horizontal then vertical
                    ctx.moveTo(this.x1, this.y1);
                    ctx.lineTo(this.x1 + this.len1, this.y1);
                    ctx.lineTo(this.x1 + this.len1, this.y1 + this.len2);
                } else {
                    // Vertical then horizontal
                    ctx.moveTo(this.x1, this.y1);
                    ctx.lineTo(this.x1, this.y1 + this.len1);
                    ctx.lineTo(this.x1 + this.len2, this.y1 + this.len1);
                }
                ctx.stroke();
                // Terminal dot
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 1.8})`;
                ctx.beginPath();
                if (this.horiz) ctx.arc(this.x1 + this.len1, this.y1 + this.len2, 1.5, 0, Math.PI * 2);
                else ctx.arc(this.x1 + this.len2, this.y1 + this.len1, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const circuitTraces = Array.from({ length: CIRCUIT_COUNT }, () => new CircuitTrace());

        // -- Dot grid overlay (very subtle) --
        function drawDotGrid(r, g, b) {
            const spacing = 55;
            const dotR = 0.8;
            ctx.fillStyle = `rgba(${r},${g},${b},0.055)`;
            for (let x = spacing / 2; x < techCanvas.width; x += spacing) {
                for (let y = spacing / 2; y < techCanvas.height; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, dotR, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // -- Main animation loop --
        let animT = 0;
        let lastAccentRgb = getAccentRgb();

        // Re-read accent color when theme changes
        const themeObserver = new MutationObserver(() => {
            lastAccentRgb = getAccentRgb();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        // Also observe body for data-theme attribute
        themeObserver.observe(document.body, { attributes: true });

        function animateCanvas() {
            animT++;
            const [r, g, b] = lastAccentRgb;

            ctx.clearRect(0, 0, techCanvas.width, techCanvas.height);

            // 1. Dot grid (bottom layer)
            drawDotGrid(r, g, b);

            // 2. Update + draw circuit traces
            circuitTraces.forEach(trace => {
                trace.update();
                trace.draw(r, g, b);
            });

            // 3. Update particles
            particles.forEach(p => p.update(animT));

            // 4. Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_CONNECT_DIST) {
                        const lineOpacity = (1 - dist / MAX_CONNECT_DIST) * 0.18;
                        ctx.save();
                        ctx.strokeStyle = `rgba(${r},${g},${b},${lineOpacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            // 5. Draw particles on top
            particles.forEach(p => p.draw(r, g, b));

            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }
});
