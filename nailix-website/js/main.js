// Nailix Nail & Spa Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Language switcher
    const languageBtns = document.querySelectorAll('.language-btn');
    
    if (languageBtns.length) {
        languageBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                languageBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get language code
                const lang = this.getAttribute('data-lang');
                
                // Switch language
                switchLanguage(lang);
            });
        });
    }

    // Accordion functionality for Learn More page
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                // Toggle active class on the clicked item
                item.classList.toggle('active');
                
                // Close other accordion items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        });
    }

    // Testimonial slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length && dots.length) {
        // Function to show a specific slide
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                slide.style.display = 'none';
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the current slide and activate the corresponding dot
            slides[index].style.display = 'block';
            dots[index].classList.add('active');
        }
        
        // Initialize the slider
        showSlide(currentSlide);
        
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto slide change
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
});

// Language translation functionality
function switchLanguage(lang) {
    // Get all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        
        // Set the text content based on the language
        if (translations[key] && translations[key][lang]) {
            element.textContent = translations[key][lang];
        }
    });
    
    // Set the lang attribute on the html element
    document.documentElement.setAttribute('lang', lang);
}

// Translations object
const translations = {
    // Navigation
    'home': {
        'en': 'Home',
        'es': 'Inicio'
    },
    'services': {
        'en': 'Services',
        'es': 'Servicios'
    },
    'contact': {
        'en': 'Contact',
        'es': 'Contacto'
    },
    'about': {
        'en': 'About',
        'es': 'Nosotros'
    },
    'blog': {
        'en': 'Blog',
        'es': 'Blog'
    },
    'shop': {
        'en': 'Shop',
        'es': 'Tienda'
    },
    
    // Hero Section
    'hero_title': {
        'en': 'Nail Care, Without The Hussle: Perfectly Polished Perfection!',
        'es': 'Cuidado de Uñas, Sin Complicaciones: ¡Perfección Pulida Perfectamente!'
    },
    
    // Services
    'services_title': {
        'en': 'Our Services',
        'es': 'Nuestros Servicios'
    },
    'service1_title': {
        'en': 'Signature Gel Manicure',
        'es': 'Manicura de Gel Exclusiva'
    },
    'service1_desc': {
        'en': 'Our signature gel manicure provides long-lasting shine and protection for your nails.',
        'es': 'Nuestra manicura de gel exclusiva proporciona brillo duradero y protección para tus uñas.'
    },
    'service2_title': {
        'en': 'Gel Nail Extensions Manicure',
        'es': 'Manicura con Extensiones de Gel'
    },
    'service2_desc': {
        'en': 'Extend your natural nails with our premium gel extensions for added length and strength.',
        'es': 'Extiende tus uñas naturales con nuestras extensiones de gel premium para mayor longitud y resistencia.'
    },
    'service3_title': {
        'en': 'Gel Pedicure',
        'es': 'Pedicura de Gel'
    },
    'service3_desc': {
        'en': 'Treat your feet to our luxurious gel pedicure for beautiful, long-lasting results.',
        'es': 'Consiente tus pies con nuestra lujosa pedicura de gel para resultados hermosos y duraderos.'
    },
    'call_now': {
        'en': 'Call Now',
        'es': 'Llamar Ahora'
    },
    
    // CTA
    'cta_title': {
        'en': 'Unlock Manicure\'s Magic - Click Now for the Reveal!',
        'es': '¡Descubre la Magia de la Manicura - Haz Clic Ahora para Revelarlo!'
    },
    'learn_more': {
        'en': 'Learn More',
        'es': 'Saber Más'
    },
    
    // Footer
    'contact_us': {
        'en': 'Contact Us',
        'es': 'Contáctanos'
    },
    'follow_us': {
        'en': 'Follow Us',
        'es': 'Síguenos'
    },
    'privacy_policy': {
        'en': 'Privacy Policy',
        'es': 'Política de Privacidad'
    },
    'terms_of_service': {
        'en': 'Terms of Service',
        'es': 'Términos de Servicio'
    },
    'copyright': {
        'en': 'Copyright © 2025 Nailix Nail and Spa Inc. All Rights Reserved.',
        'es': 'Copyright © 2025 Nailix Nail and Spa Inc. Todos los Derechos Reservados.'
    },
    
    // Learn More Page
    'what_is_nailix': {
        'en': 'What is Nailix Nail Care?',
        'es': '¿Qué es el Cuidado de Uñas Nailix?'
    },
    'benefits': {
        'en': 'Benefits',
        'es': 'Beneficios'
    },
    'safety': {
        'en': 'Safety',
        'es': 'Seguridad'
    },
    'faq': {
        'en': 'Frequently Asked Questions',
        'es': 'Preguntas Frecuentes'
    },
    'testimonials': {
        'en': 'Testimonials',
        'es': 'Testimonios'
    },
    
    // About Page - Mission & Values
    'mission_values': {
        'en': 'Our Mission & Values',
        'es': 'Nuestra Misión y Valores'
    },
    'mission_statement': {
        'en': 'At Nailix Nail & Spa, our mission is to provide exceptional nail care services that enhance both the appearance and health of our clients\' nails, delivered in a clean, relaxing environment by skilled professionals who genuinely care.',
        'es': 'En Nailix Nail & Spa, nuestra misión es proporcionar servicios excepcionales de cuidado de uñas que mejoren tanto la apariencia como la salud de las uñas de nuestros clientes, en un ambiente limpio y relajante por profesionales capacitados que realmente se preocupan.'
    },
    'value_excellence': {
        'en': 'Excellence',
        'es': 'Excelencia'
    },
    'value_excellence_desc': {
        'en': 'We strive for excellence in every service we provide, from the techniques we use to the products we select.',
        'es': 'Nos esforzamos por la excelencia en cada servicio que brindamos, desde las técnicas que utilizamos hasta los productos que seleccionamos.'
    },
    'value_care': {
        'en': 'Care',
        'es': 'Cuidado'
    },
    'value_care_desc': {
        'en': 'We genuinely care about our clients\' wellbeing and prioritize nail health alongside beauty.',
        'es': 'Nos preocupamos genuinamente por el bienestar de nuestros clientes y priorizamos la salud de las uñas junto con la belleza.'
    },
    'value_safety': {
        'en': 'Safety',
        'es': 'Seguridad'
    },
    'value_safety_desc': {
        'en': 'We maintain the highest standards of cleanliness and safety in all our procedures and salon environment.',
        'es': 'Mantenemos los más altos estándares de limpieza y seguridad en todos nuestros procedimientos y en el entorno del salón.'
    },
    'value_innovation': {
        'en': 'Innovation',
        'es': 'Innovación'
    },
    'value_innovation_desc': {
        'en': 'We continuously learn and adopt new techniques and products to offer the best to our clients.',
        'es': 'Continuamente aprendemos y adoptamos nuevas técnicas y productos para ofrecer lo mejor a nuestros clientes.'
    },
    'value_community': {
        'en': 'Community',
        'es': 'Comunidad'
    },
    'value_community_desc': {
        'en': 'We value building relationships with our clients and being an active part of our local community.',
        'es': 'Valoramos construir relaciones con nuestros clientes y ser una parte activa de nuestra comunidad local.'
    },
    'value_sustainability': {
        'en': 'Sustainability',
        'es': 'Sostenibilidad'
    },
    'value_sustainability_desc': {
        'en': 'We\'re committed to environmentally responsible practices and using eco-friendly products when possible.',
        'es': 'Estamos comprometidos con prácticas ambientalmente responsables y el uso de productos ecológicos cuando es posible.'
    },
    
    // About Page - Team
    'our_team': {
        'en': 'Meet Our Team',
        'es': 'Conoce a Nuestro Equipo'
    },
    'team_description': {
        'en': 'Our talented team of nail technicians brings years of experience, continuous education, and a passion for nail artistry to every service.',
        'es': 'Nuestro talentoso equipo de técnicos de uñas aporta años de experiencia, educación continua y pasión por el arte de las uñas a cada servicio.'
    },
    'role_founder': {
        'en': 'Founder & Master Technician',
        'es': 'Fundadora y Técnica Maestra'
    },
    'bio_lisa': {
        'en': 'With over 15 years of experience, Lisa\'s passion for nail artistry and client care led her to establish Nailix Nail & Spa.',
        'es': 'Con más de 15 años de experiencia, la pasión de Lisa por el arte de las uñas y el cuidado del cliente la llevó a establecer Nailix Nail & Spa.'
    },
    'role_senior': {
        'en': 'Senior Nail Artist',
        'es': 'Artista Senior de Uñas'
    },
    'bio_maria': {
        'en': 'Maria specializes in intricate nail art designs and has won several regional nail art competitions.',
        'es': 'Maria se especializa en diseños intrincados de arte de uñas y ha ganado varios concursos regionales de arte de uñas.'
    },
    'role_specialist': {
        'en': 'Nail Extension Specialist',
        'es': 'Especialista en Extensiones de Uñas'
    },
    'bio_david': {
        'en': 'David\'s expertise in gel and acrylic extensions has made him a favorite among clients seeking length and durability.',
        'es': 'La experiencia de David en extensiones de gel y acrílico lo ha convertido en un favorito entre los clientes que buscan longitud y durabilidad.'
    },
    'role_pedicure': {
        'en': 'Pedicure Specialist',
        'es': 'Especialista en Pedicura'
    },
    'bio_jennifer': {
        'en': 'Jennifer\'s therapeutic pedicure techniques provide both relaxation and rejuvenation for tired feet.',
        'es': 'Las técnicas de pedicura terapéutica de Jennifer proporcionan relajación y rejuvenecimiento para pies cansados.'
    },
    
    // About Page - Journey
    'our_journey': {
        'en': 'Our Journey',
        'es': 'Nuestro Viaje'
    },
    'journey_description': {
        'en': 'From our humble beginnings to where we are today, here are some key milestones in our journey.',
        'es': 'Desde nuestros humildes comienzos hasta donde estamos hoy, aquí hay algunos hitos clave en nuestro viaje.'
    },
    'journey_beginning': {
        'en': 'The Beginning',
        'es': 'El Comienzo'
    },
    'journey_beginning_desc': {
        'en': 'Nailix Nail & Spa opened its doors in Central Islip with just three nail stations and a small team of dedicated technicians.',
        'es': 'Nailix Nail & Spa abrió sus puertas en Central Islip con solo tres estaciones de uñas y un pequeño equipo de técnicos dedicados.'
    },
    'journey_reputation': {
        'en': 'Growing Reputation',
        'es': 'Reputación Creciente'
    },
    'journey_reputation_desc': {
        'en': 'Within our first year, we gained recognition for our quality services and expanded our team to meet growing demand.',
        'es': 'En nuestro primer año, ganamos reconocimiento por nuestros servicios de calidad y expandimos nuestro equipo para satisfacer la creciente demanda.'
    },
    'journey_challenges': {
        'en': 'Adapting to Challenges',
        'es': 'Adaptándonos a los Desafíos'
    },
    'journey_challenges_desc': {
        'en': 'During the pandemic, we implemented enhanced safety protocols and introduced home nail care kits to support our clients.',
        'es': 'Durante la pandemia, implementamos protocolos de seguridad mejorados e introdujimos kits de cuidado de uñas para el hogar para apoyar a nuestros clientes.'
    },
    'journey_expansion': {
        'en': 'Salon Expansion',
        'es': 'Expansión del Salón'
    },
    'journey_expansion_desc': {
        'en': 'We expanded our salon space to accommodate more clients and introduced new premium services.',
        'es': 'Ampliamos el espacio de nuestro salón para acomodar a más clientes e introdujimos nuevos servicios premium.'
    },
    'journey_recognition': {
        'en': 'Community Recognition',
        'es': 'Reconocimiento de la Comunidad'
    },
    'journey_recognition_desc': {
        'en': 'Nailix was voted "Best Nail Salon" in the local community choice awards, a testament to our commitment to excellence.',
        'es': 'Nailix fue votado como "Mejor Salón de Uñas" en los premios de elección de la comunidad local, un testimonio de nuestro compromiso con la excelencia.'
    },
    'journey_sustainability': {
        'en': 'Sustainability Initiative',
        'es': 'Iniciativa de Sostenibilidad'
    },
    'journey_sustainability_desc': {
        'en': 'We launched our sustainability initiative, transitioning to eco-friendly products and reducing waste in our operations.',
        'es': 'Lanzamos nuestra iniciativa de sostenibilidad, haciendo la transición a productos ecológicos y reduciendo los desechos en nuestras operaciones.'
    },
    'journey_training': {
        'en': 'Advanced Training Program',
        'es': 'Programa de Capacitación Avanzada'
    },
    'journey_training_desc': {
        'en': 'We established our in-house training program to ensure all our technicians maintain the highest skill levels.',
        'es': 'Establecimos nuestro programa de capacitación interno para garantizar que todos nuestros técnicos mantengan los niveles de habilidad más altos.'
    },
    'journey_future': {
        'en': 'Looking Forward',
        'es': 'Mirando Hacia el Futuro'
    },
    'journey_future_desc': {
        'en': 'As we continue to grow, we remain committed to our founding principles and to providing exceptional nail care experiences.',
        'es': 'A medida que continuamos creciendo, seguimos comprometidos con nuestros principios fundacionales y con proporcionar experiencias excepcionales de cuidado de uñas.'
    }
};
