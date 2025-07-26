document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            const navMenu = document.getElementById('nav-menu');
            const menuToggle = document.getElementById('mobile-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Experience Metrics Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Adjust for faster/slower animation

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const textSuffix = counter.textContent.includes('K+') ? 'K+' : (counter.textContent.includes('M+') ? 'M+' : '+');
        const isK = counter.textContent.includes('K+');
        const isM = counter.textContent.includes('M+');

        const updateCount = () => {
            let increment;
            if (isM) {
                increment = target / speed / 100; // Larger steps for millions
            } else if (isK) {
                increment = target / speed / 10; // Larger steps for thousands
            } else {
                increment = target / speed;
            }


            if (current < target) {
                current += increment;
                if (isK) {
                    counter.textContent = Math.ceil(current / 1000) + textSuffix;
                } else if (isM) {
                    counter.textContent = (current / 1000000).toFixed(1) + textSuffix; // Show one decimal for millions
                } else {
                    counter.textContent = Math.ceil(current) + textSuffix;
                }
                setTimeout(updateCount, 1);
            } else {
                if (isK) {
                    counter.textContent = (target / 1000) + textSuffix;
                } else if (isM) {
                    counter.textContent = (target / 1000000).toFixed(1) + textSuffix;
                }
                else {
                    counter.textContent = target + textSuffix;
                }
            }
        };

        updateCount();
    };

    // Intersection Observer for Animations (Skills and Metrics)
    const options = {
        root: null,
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('metric-block')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter && !counter.classList.contains('animated')) {
                        animateCounter(counter);
                        counter.classList.add('animated'); // Mark as animated
                    }
                } else if (entry.target.id === 'skills') { // Observe the skills section
                    document.querySelectorAll('.progress-bar').forEach(bar => {
                        const percentage = bar.getAttribute('data-percentage');
                        bar.style.width = percentage + '%';
                    });
                }
                // If you want to only animate once, uncomment next line for the specific section
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe metrics blocks individually
    document.querySelectorAll('.metric-block').forEach(block => {
        observer.observe(block);
    });

    // Observe the skills section
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Button Functionality ---

    // Placeholder links for Portfolio and Blog sections
    document.querySelectorAll('.btn-link, .btn-read-more').forEach(button => {
        if (button.getAttribute('href') === '#') {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                console.log('This is a placeholder link. Please replace "#" with a real URL for your project/blog post.');
                // You could also display a small message on the page if preferred, instead of console log.
                // For example: showFormMessage("This link is a placeholder. Please update it!", "info");
            });
        }
    });

    // Contact Form Submission (using Formspree)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            // Use FormData to easily get all form data
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree to return JSON
                    }
                });

                if (response.ok) {
                    showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
                    contactForm.reset(); // Clear the form
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showFormMessage(data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showFormMessage('Oops! There was an issue sending your message. Please try again.', 'error');
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showFormMessage('Network error. Please check your internet connection and try again.', 'error');
            }
        });
    }

    // Function to display form messages
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message show'; // Reset classes and add 'show'

        if (type === 'success') {
            formMessage.style.backgroundColor = 'rgba(40, 167, 69, 0.2)'; // Greenish for success
            formMessage.style.borderColor = '#28a745';
        } else if (type === 'error') {
            formMessage.style.backgroundColor = 'rgba(220, 53, 69, 0.2)'; // Reddish for error
            formMessage.style.borderColor = '#dc3545';
        } else {
            formMessage.style.backgroundColor = 'rgba(3, 169, 244, 0.2)'; // Default info blue
            formMessage.style.borderColor = 'var(--neon-blue)';
        }

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    // --- Hamburger Menu Toggle Logic ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // Prevent body scrolling when menu is open
            document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
        });
    }

    // Optional: Add a class to body to prevent scrolling when menu is open
    // Add this to your CSS:
    // body.no-scroll {
    //     overflow: hidden;
    // }
});