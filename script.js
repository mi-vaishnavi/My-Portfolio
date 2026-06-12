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
                    themeDesc.innerText = "Oceanic Depth";
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
        "Crafting intelligent full-stack solutions.",
        "Solving complex algorithmic puzzles.",
        "Bridging AI capability with fluid user experience.",
        "Building robust, production-grade applications."
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
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 6px;">Available Profile Commands:</div>
                        <span class="terminal-green">about</span>    - Prints a detailed professional introduction.<br>
                        <span class="terminal-green">skills</span>   - Displays engineering expertise levels.<br>
                        <span class="terminal-green">projects</span> - Summarizes featured high-end projects.<br>
                        <span class="terminal-green">clear</span>    - Clears the console output screen.<br>
                        <span class="terminal-green">secret</span>   - Run a secure core authentication sequence. 🚀
                    `;
                    break;
                    
                case 'about':
                    responseBlock.innerHTML = `
                        I am <span class="terminal-yellow" style="font-weight:600;">Majoju Vaishnavi</span>, a high-achieving Computer Science & Engineering student at the 
                        <span class="terminal-accent">University College of Engineering, Osmania University (UCE, OU)</span>, graduating in 2027.<br><br>
                        Currently working as a <span class="terminal-pink">Mobile Application Build Intern at IRA labs</span>, building scalable backend APIs, structural React components, 
                        and automated system tests. My core focus lies in merging mathematical algorithms (DSA) with high-efficiency Full-Stack applications 
                        and robust Artificial Intelligence models.
                    `;
                    break;
                    
                case 'skills':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Technical Capability Matrix:</div>
                        <span class="terminal-yellow">Languages:</span>  Java (OOP, DS), Python, JavaScript (ES6+)<br>
                        <span class="terminal-yellow">Frameworks:</span> React.js, Next.js, Express.js, Node.js, Flask, TailwindCSS<br>
                        <span class="terminal-yellow">Databases:</span>  MySQL, MongoDB, SQLite<br>
                        <span class="terminal-yellow">Core CS:</span>    Data Structures, Operating Systems, Computer Networks, OOP Design Patterns<br>
                        <span class="terminal-yellow">Tools:</span>      Git, GitHub, RESTful APIs, Figma, LaTeX, VSCode
                    `;
                    break;
                    
                case 'projects':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Featured Projects:</div>
                        1. <span class="terminal-accent" style="font-weight:600;">NexisAI — Multi-Agent Solver Workspace</span> (AI & ML)<br>
                        &nbsp;&nbsp;&nbsp;Complex task solver orchestrating LLM agents with RAG. Tech: React, Node, Python, MongoDB.<br>
                        2. <span class="terminal-accent" style="font-weight:600;">AI PCOS Tracker & Personalization Platform</span> (AI & ML)<br>
                        &nbsp;&nbsp;&nbsp;Clinical risk modeling with dynamically generated Gemini-3.5 AI diet, yoga & workout programs. Tech: Python, React, Express, MongoDB.<br>
                        3. <span class="terminal-accent" style="font-weight:600;">NexLink — URL Shortener & Analytics Suite</span> (Web Applications)<br>
                        &nbsp;&nbsp;&nbsp;Serverless client-side URL shortener with custom alias hashing, instant QR code rendering, and local analytics dashboard. Tech: HTML5, CSS3, JS, LocalStorage.<br>
                        4. <span class="terminal-accent" style="font-weight:600;">Offline-First Women Safety App</span> (Mobile Solutions)<br>
                        &nbsp;&nbsp;&nbsp;Hands-free voice trigger SOS & background GPS mapping. Tech: Java, Android SDK, Flask APIs.
                    `;
                    break;
                    
                case 'clear':
                    termOutput.innerHTML = '';
                    return;
                    
                case 'secret':
                    responseBlock.innerHTML = `
                        <div class="terminal-yellow">Initializing secure authentication handshakes...</div>
                        <div style="font-family: monospace; font-size: 0.75rem; color: #10b981; margin: 6px 0;">
                            [SYSTEM] Loading core dependencies... OK<br>
                            [SYSTEM] Querying interview selection matrices... 100%<br>
                            [SYSTEM] Injecting high-performance engineering values... COMPLETE
                        </div>
                        <div style="border: 1px dashed var(--accent-1); padding: 12px; border-radius: 6px; background: rgba(var(--accent-1-rgb), 0.05); text-align: center;">
                            <span class="terminal-pink" style="font-weight:800; font-size: 1.1rem;">EASTER EGG DETECTED! 🌟</span><br>
                            <span style="color: #fff; font-size: 0.85rem;">Hiring Manager Access Token:</span><br>
                            <span class="terminal-green" style="font-family:var(--font-mono); font-weight:700; font-size:1rem; letter-spacing:1px;">SELECT_VAISHNAVI_2026</span><br>
                            <span style="color: var(--text-secondary); font-size: 0.75rem; display:block; margin-top:6px;">Result: Perfect match for Software & Full-Stack engineering roles.</span>
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
});
