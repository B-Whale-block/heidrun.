document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.navbar');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    console.log('Website loaded and interactive!');

    // Initialize Particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 150, // Adjust the number of particles
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff" // Bright white particles
            },
            opacity: {
                value: 0.8, // Higher opacity for visibility
                random: false,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.5,
                    sync: false
                }
            },
            size: {
                value: 4, // Larger particle size
                random: true,
                anim: {
                    enable: true,
                    speed: 3,
                    size_min: 2,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 120,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                }
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 10
                }
            }
        },
        retina_detect: true
    });
});
