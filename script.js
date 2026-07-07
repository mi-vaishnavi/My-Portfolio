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
                        <span class="terminal-green">projects</span> - Summarizes featured projects.<br>
                        <span class="terminal-green">clear</span>    - Clears the console output screen.<br>
                        <span class="terminal-green">secret</span>   - Run a secure core authentication sequence. 🚀
                    `;
                    break;
                    
                case 'about':
                    responseBlock.innerHTML = `
                        I am <span class="terminal-yellow" style="font-weight:600;">Majoju Vaishnavi</span>, a final-year Computer Science & Engineering student at the 
                        <span class="terminal-accent">University College of Engineering, Osmania University (UCE, OU)</span>, graduating in 2027 (CGPA: 9.0/10).<br><br>
                        Currently, I am working as a <span class="terminal-pink" style="font-weight:600;">Mobile Application Build Intern at IRA labs</span>, where I build cross-platform mobile application prototypes and integrate AI tooling into mobile build pipelines using Flutter and React Native framework architectures.<br><br>
                        My core focus lies in combining solid Computer Science fundamentals (DSA & OOP) with full-stack and mobile solutions to engineer high-performance, production-grade applications.
                    `;
                    break;
                    
                case 'skills':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Technical Skills:</div>
                        <span class="terminal-yellow">Proficient:</span> Java, Python, JavaScript, React.js, Next.js, DSA & OOP, Git/GitHub, REST APIs<br>
                        <span class="terminal-yellow">Familiar:</span>   Node.js, Express.js, TailwindCSS, MongoDB, MySQL, SQLite, Flask, OS, Networks, Figma<br>
                        <span class="terminal-yellow">Exploring:</span>  Generative AI (Gemini API), RAG Architectures, Flutter, React Native
                    `;
                    break;
                    
                case 'projects':
                    responseBlock.innerHTML = `
                        <div style="font-weight: 600; color: var(--accent-1); margin-bottom: 8px;">Featured Projects:</div>
                        1. <span class="terminal-accent" style="font-weight:600;">NexisAI — Multi-Agent Orchestrator</span> (AI & ML)<br>
                        &nbsp;&nbsp;&nbsp;An orchestrator that coordinates multi-agent LLM teams using Python and Node.js.<br>
                        2. <span class="terminal-accent" style="font-weight:600;">PCOS Tracker & Personalization Platform</span> (AI & ML)<br>
                        &nbsp;&nbsp;&nbsp;Clinical risk evaluation with dynamically generated symptom-driven nutrition and exercise plans. Tech: Python, React, MongoDB.<br>
                        3. <span class="terminal-accent" style="font-weight:600;">SnapLink — URL Shortener</span> (Web Applications)<br>
                        &nbsp;&nbsp;&nbsp;A full-stack URL shortening service features Base62 encoding and token-bucket rate limiting. Tech: Java, Spring Boot, PostgreSQL, JavaScript.<br>
                        4. <span class="terminal-accent" style="font-weight:600;">Women Safety App</span> (Mobile Solutions)<br>
                        &nbsp;&nbsp;&nbsp;Crisis monitor providing voice trigger SOS and background GPS mapping. Tech: Java, Android SDK, Flask.
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
