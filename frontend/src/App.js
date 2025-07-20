import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0], // Auto-fill with today's date
    service: ''
  });

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showGdprPage, setShowGdprPage] = useState(false);

  // Form validation states
  const [popupErrors, setPopupErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: ''
  });

  // Handle date picker click outside behavior and prevent cursor bugs
  useEffect(() => {
    // Improved date picker click outside handler
    const handleDocumentClick = (event) => {
      // Find all date inputs
      const dateInputs = document.querySelectorAll('input[type="date"]');
      
      dateInputs.forEach(dateInput => {
        // Check if click was outside the date input
        if (dateInput !== event.target && !dateInput.contains(event.target)) {
          // Close the date picker by removing focus
          if (dateInput === document.activeElement) {
            dateInput.blur();
          }
        }
      });
    };

    // Prevent unwanted cursor behavior on document elements
    const handleFocusCapture = (event) => {
      const target = event.target;
      
      // If body, html, or non-input elements get focus, blur them
      if (target === document.body || 
          target === document.documentElement || 
          (target.tagName !== 'INPUT' && 
           target.tagName !== 'TEXTAREA' && 
           target.tagName !== 'SELECT' &&
           target.tagName !== 'BUTTON' &&
           target.tagName !== 'A')) {
        event.preventDefault();
        target.blur();
      }
    };

    // Handle escape key to close date picker
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.type === 'date') {
          activeElement.blur();
        }
      }
    };

    // Cleanup function to remove contenteditable attributes periodically
    const cleanupContentEditable = () => {
      // Remove any accidentally added contenteditable attributes
      const editableElements = document.querySelectorAll('[contenteditable="true"]');
      editableElements.forEach(el => el.removeAttribute('contenteditable'));
      
      // Ensure body and html don't have tabindex
      document.body.removeAttribute('tabindex');
      document.documentElement.removeAttribute('tabindex');
    };

    // CRITICAL: Ensure all images are visible
    const ensureImagesVisible = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Force images to be visible
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.display = 'block';
        
        // Add loaded class for lazy images
        if (img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy') {
          img.classList.add('loaded');
        }
      });
    };

    // Add event listeners with proper options
    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('focus', handleFocusCapture, true);
    document.addEventListener('keydown', handleKeyDown);
    
    // Initial cleanup and image visibility fix
    cleanupContentEditable();
    ensureImagesVisible();
    
    // Periodic cleanup every 2 seconds
    const cleanupInterval = setInterval(() => {
      cleanupContentEditable();
      ensureImagesVisible(); // Ensure images stay visible
    }, 2000);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('focus', handleFocusCapture, true);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(cleanupInterval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Ensure page is fully loaded
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Popup logic - show when user scrolls 30-50% down
    const handleScrollPopup = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 35 && !hasShownPopup) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    };

    window.addEventListener('scroll', handleScrollPopup);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollPopup);
      clearTimeout(timer);
    };
  }, [hasShownPopup]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Toast notification function
  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    
    // Auto-hide toast after 4.5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  // Form validation functions
  const validateField = (name, value) => {
    if (!value || value.trim() === '') {
      return 'Toto pole je povinné';
    }
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Zadejte platnou e-mailovou adresu';
      }
    }
    
    if (name === 'phone') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
      if (!phoneRegex.test(value)) {
        return 'Zadejte platné telefonní číslo';
      }
    }
    
    return '';
  };

  const validatePopupForm = () => {
    const errors = {};
    const requiredFields = ['name', 'phone', 'email', 'date', 'service'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    
    setPopupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateContactForm = () => {
    const errors = {};
    const requiredFields = ['name', 'email', 'phone', 'eventType', 'message'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, contactFormData[field]);
      if (error) errors[field] = error;
    });
    
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Smooth scroll to top function
  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (popupErrors[name]) {
      setPopupErrors({
        ...popupErrors,
        [name]: ''
      });
    }
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData({
      ...contactFormData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (contactErrors[name]) {
      setContactErrors({
        ...contactErrors,
        [name]: ''
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePopupForm()) {
      return;
    }
    
    // Simulate form submission
    console.log('Popup form submitted:', formData);
    
    // Show success toast
    showToastNotification('Děkujeme za odeslání! Ozveme se vám co nejdříve.');
    
    // Enhanced modal closing animation
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/80');
    if (modal) {
      modal.classList.add('animate-fade-out');
      setTimeout(() => {
        setShowPopup(false);
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          date: '',
          service: ''
        });
        setPopupErrors({});
        
        // Smooth scroll to top after modal closes
        setTimeout(smoothScrollToTop, 200);
      }, 300);
    }
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateContactForm()) {
      return;
    }
    
    // Simulate form submission
    console.log('Contact form submitted:', contactFormData);
    
    // Show success toast
    showToastNotification('Děkujeme za odeslání! Ozveme se vám co nejdříve.');
    
    // Reset form
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      message: ''
    });
    setContactErrors({});
    
    // Smooth scroll to top after brief delay
    setTimeout(smoothScrollToTop, 1000);
  };

  const packages = [
    {
      name: "Lite",
      price: "18 000 Kč",
      description: "Perfektní pro menší akce",
      features: [
        "100 signature koktejlů",
        "1 barman po celou dobu akce",
        "Exkluzivní menu pro vaši akci"
      ],
      image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Classic",
      price: "24 000 Kč",
      description: "Nejoblíbenější volba pro střední akce",
      features: [
        "150 signature koktejlů",
        "2 barmani po celou dobu akce",
        "Flavour Blaster zážitek v ceně",
        "Exkluzivní menu pro vaši akci"
      ],
      discount: "Při objednání tohoto balíčku získáte 20 % slevu na Welcome zónu s ledovým blokem a proseccem",
      image: "https://images.unsplash.com/photo-1705944601084-3d8119490b26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
      featured: true
    },
    {
      name: "Premium",
      price: "30 000 Kč",
      description: "Luxusní zážitek pro velké akce",
      features: [
        "200 signature koktejlů",
        "2 barmani po celou dobu akce",
        "Flavour Blaster zážitek v ceně",
        "Exkluzivní menu pro vaši akci"
      ],
      discount: "Při objednání tohoto balíčku získáte 20 % slevu na Welcome zónu s ledovým blokem a proseccem",
      image: "https://images.unsplash.com/flagged/photo-1571046423953-30c053888852?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiYXJ8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTB8MA&ixlib=rb-4.1.0&q=85"
    }
  ];

  const weddingPackages = [
    {
      name: "Silver",
      guestCapacity: "do 60 osob",
      price: "26 000 Kč",
      features: [
        "100 signature koktejlů",
        "Welcome zóna s ledovým blokem a květinou uvnitř",
        "10 lahví prosecca",
        "1 barman po celou dobu akce",
        "Exkluzivní menu pro vaši akci"
      ],
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcm9tYW50aWN8ZW58MHx8fGJsYWNrfDE3NTI0NTMwMDB8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Gold",
      guestCapacity: "do 100 osob",
      price: "35 000 Kč",
      features: [
        "150 signature koktejlů",
        "Welcome zóna s ledovým blokem a květinou uvnitř",
        "15 lahví prosecca",
        "2 barmani po celou dobu akce",
        "Domácí limonády",
        "Exkluzivní menu pro vaši akci"
      ],
      bonus: "K balíčku Gold získáte 20 % slevu na pyramidu ze sklenic s efektem studené fontány a 15 lahví prosecca.",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcm9tYW50aWN8ZW58MHx8fGJsYWNrfDE3NTI0NTMwMDB8MA&ixlib=rb-4.1.0&q=85",
      featured: true
    },
    {
      name: "Diamond",
      guestCapacity: "100+ osob",
      price: "45 000 Kč",
      features: [
        "200 signature koktejlů",
        "Welcome zóna s ledovým blokem a květinou uvnitř + Aperol",
        "Pyramida ze sklenic s efektem studené fontány",
        "20 lahví prosecca",
        "2 barmani po celou dobu akce",
        "Domácí limonády",
        "Exkluzivní menu pro vaši akci"
      ],
      image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHx3ZWRkaW5nJTIwY29ja3RhaWx8ZW58MHx8fGJsYWNrfDE3NTI0NTMwMDB8MA&ixlib=rb-4.1.0&q=85"
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      event: "Svatba na Pražském hradě",
      rating: 5,
      text: "Absolutně výjimečná obsluha! Koktejly byly dokonalé a ledové sochy s orchidejemi byly úchvatné. Naši hosté o tom ještě po měsících mluví."
    },
    {
      name: "Manažer firemních akcí",
      event: "Spuštění technologické společnosti",
      rating: 5,
      text: "Profesionální, elegantní a přesně to, co jsme potřebovali pro naše významné spuštění. Tým překonal všechna očekávání svou sofistikovanou prezentací."
    },
    {
      name: "Isabella Rodríguez",
      event: "Soukromá oslava narozenin",
      rating: 5,
      text: "THE BAR. změnil naše jednoduché setkání na nezapomenutelný luxusní zážitek. Pozornost věnovaná detailům a prémiová obsluha stála za každou korunu!"
    },
    {
      name: "Viktor & Anna",
      event: "Oslava výročí",
      rating: 5,
      text: "Neuvěřitelné řemeslné umění! Každý koktejl byl uměleckým dílem. Prémiová obsluha a elegantní prezentace učinily naše výročí skutečně výjimečným."
    },
    {
      name: "Pražská skupina hotelů",
      event: "VIP události pro hosty",
      rating: 5,
      text: "THE BAR. se stal naším partnerem pro luxusní zážitky hostů. Konzistentně výjimečná kvalita a služby, které odpovídají našim prémiovým standardům."
    },
    {
      name: "Marie Nováková",
      event: "Firemní gala",
      rating: 5,
      text: "Vynikající profesionalita a kreativita. Personalizované koktejlové menu dokonale doplnilo téma naší akce. Vřele doporučuji pro jakoukoli prémiovou příležitost."
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1526894198609-10b3cdf45c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1619296730225-3963e70354ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1596351992649-8cea3853ba92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXJ8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTB8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwY29ja3RhaWx8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTh8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1650814843722-2498e2aa8e3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY29ja3RhaWx8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTh8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1705944601084-3d8119490b26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
    "https://images.pexels.com/photos/4705928/pexels-photo-4705928.jpeg",
    "https://images.pexels.com/photos/5550310/pexels-photo-5550310.jpeg",
    "https://images.unsplash.com/flagged/photo-1571046423953-30c053888852?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiYXJ8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTB8MA&ixlib=rb-4.1.0&q=85"
  ];

  return (
    <div className="min-h-screen bg-primary text-white overflow-x-hidden relative">
      {/* GDPR Page Modal */}
      {showGdprPage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-primary to-dark-navy border border-gold/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setShowGdprPage(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-gold transition-colors duration-300 z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* GDPR Content */}
            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8 text-gold text-center">
                Zásady ochrany osobních údajů
              </h1>

              <div className="space-y-6 text-white/90 font-sans leading-relaxed">
                <p className="text-lg">
                  <strong className="text-gold">Vladyslav Breslavskyi – THE BAR. PREMIUM COCKTAIL CATERING</strong> (dále jen „provozovatel") se zavazuje chránit vaše osobní údaje a soukromí.
                </p>

                <p>
                  Provozovatel je fyzická osoba podnikající dle živnostenského zákona, <strong>IČO: 23284111</strong>.
                </p>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-medium text-gold">1. Jaké údaje shromažďujeme?</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Jméno a příjmení</li>
                    <li>Telefonní číslo</li>
                    <li>E-mailová adresa</li>
                    <li>Datum plánované akce</li>
                    <li>Vybraná služba</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-medium text-gold">2. Za jakým účelem údaje zpracováváme?</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Vytvoření nezávazné cenové nabídky</li>
                    <li>Komunikace ohledně vaší poptávky</li>
                    <li>Rezervace našich služeb</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-medium text-gold">3. Kdo má k údajům přístup?</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Údaje jsou zpracovávány pouze provozovatelem</li>
                    <li>Nikdy je nepředáváme třetím stranám bez vašeho souhlasu</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-medium text-gold">4. Jak dlouho údaje uchováváme?</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Po dobu nezbytně nutnou pro vyřízení vaší poptávky</li>
                    <li>Maximálně však 12 měsíců</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-medium text-gold">5. Vaše práva</h2>
                  <p>Máte právo:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>na přístup ke svým údajům</li>
                    <li>na opravu nebo výmaz údajů</li>
                    <li>vznést námitku proti zpracování</li>
                    <li>podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-medium text-gold">6. Kontakt</h2>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="mr-2">📧</span>
                      <a href="mailto:thebar.event@gmail.com" className="text-gold hover:text-gold/80 transition-colors">
                        thebar.event@gmail.com
                      </a>
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📞</span>
                      <a href="tel:+420775505805" className="text-gold hover:text-gold/80 transition-colors">
                        +420 775 505 805
                      </a>
                    </p>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <button
                    onClick={() => setShowGdprPage(false)}
                    className="bg-gold hover:bg-gold/90 text-primary px-8 py-3 font-sans font-semibold tracking-wide transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    Zavřít
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[110] animate-slide-down">
          <div className="bg-gradient-to-r from-gold to-gold/90 text-primary px-6 py-4 rounded-lg shadow-2xl border border-gold/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-sans font-medium text-sm">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Premium Frame Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-primary/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/30"></div>
        {/* Elegant Side Lines */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20"></div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            className="bg-gradient-to-b from-primary to-dark-navy border border-gold/20 rounded-xl max-w-lg w-full mx-4 relative animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-gold transition-colors duration-300 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Image */}
            <div className="h-32 bg-cover bg-center rounded-t-xl relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1619296730225-3963e70354ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
                alt="Bartender"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-8 pt-6">
              <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-gold text-center leading-tight">
                VÁŠ KOKTEJLOVÝ ZÁŽITEK NA MÍRU
              </h3>
              <div className="text-center mb-6 space-y-2">
                <p className="text-white/90 font-sans font-normal leading-relaxed text-sm">
                  Nechte si připravit nezávaznou nabídku na míru – zdarma.
                </p>
                <p className="text-white/90 font-sans font-normal leading-relaxed text-sm">
                  Získejte exkluzivní návrh koktejlového zážitku pro vaši akci.
                </p>
                <p className="text-gold/90 font-sans font-medium leading-relaxed text-sm">
                  Při rezervaci navíc až 10 signature drinků zcela zdarma.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jméno"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        popupErrors.name ? 'border-red-500' : 'border-white/20'
                      } rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm md:text-sm text-base min-h-12 md:min-h-auto`}
                    />
                    {popupErrors.name && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{popupErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telefon"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        popupErrors.phone ? 'border-red-500' : 'border-white/20'
                      } rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm md:text-sm text-base min-h-12 md:min-h-auto`}
                    />
                    {popupErrors.phone && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{popupErrors.phone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className={`w-full bg-primary/50 border ${
                      popupErrors.email ? 'border-red-500' : 'border-white/20'
                    } rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm md:text-sm text-base min-h-12 md:min-h-auto`}
                  />
                  {popupErrors.email && (
                    <p className="text-red-400 text-xs mt-1 font-sans">{popupErrors.email}</p>
                  )}
                </div>
                
                <div className="date-picker-container relative">
                  <input
                    type="date"
                    name="date"
                    placeholder="Datum akce"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className={`w-full bg-primary/50 border ${
                      popupErrors.date ? 'border-red-500' : 'border-white/20'
                    } rounded-lg px-4 py-3 pr-16 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm md:text-sm text-base min-h-12 md:min-h-auto date-input`}
                    style={{
                      colorScheme: 'dark'
                    }}
                  />
                  {/* Clear/Reset button for date input */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({...formData, date: ''});
                      setPopupErrors({...popupErrors, date: ''});
                    }}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-red-400 transition-colors duration-200 z-10 p-1"
                    title="Resetovat na dnešní datum"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div className="date-picker-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {popupErrors.date && (
                    <p className="text-red-400 text-xs mt-1 font-sans">{popupErrors.date}</p>
                  )}
                </div>

                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleFormChange}
                    required
                    className={`w-full bg-primary/50 border ${
                      popupErrors.service ? 'border-red-500' : 'border-white/20'
                    } rounded-lg px-4 py-3 pr-12 text-white focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm md:text-sm text-base min-h-12 md:min-h-auto appearance-none bg-no-repeat bg-right-4 bg-center`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundSize: '16px',
                      backgroundPosition: 'right 12px center'
                    }}
                  >
                    <option value="" className="text-white/70 bg-primary">Vyberte si službu</option>
                    <option value="koktejlovy-bar" className="text-white bg-primary">Koktejlový bar</option>
                    <option value="pyramida" className="text-white bg-primary">Elegantní pyramida šampaňského</option>
                    <option value="welcome-zona" className="text-white bg-primary">Welcome zóna s ledovým blokem a květinou uvnitř</option>
                    <option value="bar-welcome" className="text-white bg-primary">Koktejlový bar + Welcome zóna</option>
                    <option value="masterclass" className="text-white bg-primary">MasterClass</option>
                  </select>
                  {popupErrors.service && (
                    <p className="text-red-400 text-xs mt-1 font-sans">{popupErrors.service}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-primary py-3 font-sans font-semibold tracking-wide transition-all duration-300 hover:scale-105 rounded-lg shadow-lg hover:shadow-gold/20"
                >
                  ODESLAT
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-primary/95 backdrop-blur-lg' : 'bg-transparent'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0 -ml-2">
                <h1 className="text-3xl font-serif font-medium text-gold tracking-widest">THE BAR.</h1>
              </div>
            
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-baseline space-x-6">
                  {['Úvod', 'O nás', 'Balíčky', 'Svatební Balíčky', 'Galerie', 'Recenze', 'Kontakt'].map((item, index) => {
                    const sectionIds = ['hero', 'about', 'packages', 'svatebni-balicky', 'gallery', 'reviews', 'contact'];
                    return (
                      <button
                        key={item}
                        onClick={() => scrollToSection(sectionIds[index])}
                        className="text-white/90 hover:text-gold transition-colors duration-300 text-base font-sans font-medium tracking-wide px-2 py-1"
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/80 hover:text-gold transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="bg-primary/95 backdrop-blur-lg border-b border-primary/20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['Úvod', 'O nás', 'Balíčky', 'Svatební Balíčky', 'Galerie', 'Recenze', 'Kontakt'].map((item, index) => {
                  const sectionIds = ['hero', 'about', 'packages', 'svatebni-balicky', 'gallery', 'reviews', 'contact'];
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(sectionIds[index])}
                      className="block px-3 py-2 text-white/80 hover:text-gold transition-colors duration-300 text-base font-sans font-medium tracking-wide w-full text-left"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

        {/* Hero Section */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80 z-10"></div>
          {/* Desktop Background */}
          <div 
            className="hidden md:block absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1526894198609-10b3cdf45c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85')`
            }}
          ></div>
          {/* Mobile Background with Parallax */}
          <div 
            className="md:hidden absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1526894198609-10b3cdf45c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85')`,
              transform: `translateY(${scrollY * 0.5}px)`,
              willChange: 'transform'
            }}
          ></div>
          
          <div className="max-w-6xl mx-auto px-6">
            <div className={`relative z-20 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 text-white tracking-wide leading-tight">
                  {t('hero.title')}<span className="text-gold">.</span>
                </h1>
                <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
                <p className="text-xl md:text-2xl font-serif font-medium mb-8 text-white/95 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
                <p className="text-lg text-white/75 mb-12 max-w-2xl mx-auto font-sans font-normal">
                  {t('hero.description')}
                </p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="bg-gold hover:bg-gold/90 text-primary px-8 py-4 text-lg font-sans font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
                >
                  {t('hero.cta')}
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* About Section - Umění mixologie */}
        <section id="about" className="py-20 bg-gradient-to-b from-primary to-dark-navy">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-white">
                {t('about.title')}
              </h2>
              <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
              <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
                {t('about.subtitle')}
              </p>
            </div>

            {/* Content Layout with Images */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* First Text Block */}
              <div className="lg:col-span-7 space-y-6">
                <p className="text-lg text-white/85 leading-relaxed font-sans font-normal">
                  Sídlící v srdci Prahy, THE BAR. představuje vrchol koktejlového řemesla. Věříme, že každý nápoj vypráví příběh a každá událost si zaslouží dokonalost.
                </p>
              </div>

              {/* First Image */}
              <div className="lg:col-span-5">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551538827-9c037cb4f32a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhcnxlbnwwfHx8fDE3NTIzNTMwMDV8MA&ixlib=rb-4.1.0&q=85"
                    alt="Signature koktejl s květinovou dekorací"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 border border-gold/30 rounded-lg"></div>
                </div>
              </div>

              {/* Second Image */}
              <div className="lg:col-span-5 lg:order-first">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1546171753-97d7676e4602?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxjb2NrdGFpbCUyMGdhcm5pc2h8ZW58MHx8fHwxNzUyMzUzMDA1fDA&ixlib=rb-4.1.0&q=85"
                    alt="Elegantní koktejly s květinami"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/30"></div>
                  <div className="absolute -top-3 -left-3 w-12 h-12 border border-gold/40 rounded-lg"></div>
                </div>
              </div>

              {/* Second Text Block */}
              <div className="lg:col-span-7 space-y-6">
                <p className="text-lg text-white/85 leading-relaxed font-sans font-normal">
                  Naše vášeň pro mixologii jde nad rámec jednoduchých koktejlů. Vytváříme pohlcující zážitky se signature ledovými bloky s květinami, prémiovými destiláty, pyramidou ze sklenic se šumivým vínem a divadelní prezentací, která promění jakékoli setkání na nezapomenutelnou oslavu.
                </p>
                <p className="text-lg text-white/85 leading-relaxed font-sans font-normal">
                  Od soukromých večírků po velkolepé firemní eventy přinášíme luxusní barový zážitek přímo k vám – kompletní s profesionálními barmany, špičkovým vybavením a nekompromisní pozorností k detailům.
                </p>
              </div>

              {/* Third Image */}
              <div className="lg:col-span-12 mt-8">
                <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjb2NrdGFpbCUyMGJhciUyMHNldHVwfGVufDB8fHx8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
                    alt="Luxusní barový setup s koktejly"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/20"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-2xl md:text-3xl font-serif font-semibold text-gold mb-2">25+</div>
                        <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide font-sans font-medium">Prémiových akcí</div>
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-serif font-semibold text-gold mb-2">15+</div>
                        <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide font-sans font-medium">Signature koktejlů</div>
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-serif font-semibold text-gold mb-2">100%</div>
                        <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide font-sans font-medium">Spokojenost klientů</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 border border-gold/25 rounded-lg"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 border border-gold/35 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-20 bg-dark-navy">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
                Hotová <span className="text-gold">řešení</span>
              </h2>
              <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
              <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
                Vyberte si z našich pečlivě sestavených balíčků služeb, z nichž každý je navržen tak, aby poskytl výjimečný koktejlový zážitek přizpůsobený potřebám vaší akce.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div 
                  key={index}
                  className={`relative group ${pkg.featured ? 'lg:scale-105 lg:-mt-4' : ''}`}
                >
                  <div className={`bg-gradient-to-b from-primary/80 to-dark-navy border ${pkg.featured ? 'border-gold/50' : 'border-white/10'} rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-500 hover:scale-105`}>
                    {pkg.featured && (
                      <div className="bg-gold text-primary text-center py-2 text-sm font-medium tracking-wide">
                        NEJOBLÍBENĚJŠÍ
                      </div>
                    )}
                    
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-serif font-light mb-2 text-white">{pkg.name}</h3>
                      <p className="text-3xl font-light text-gold mb-4">{pkg.price}</p>
                      <p className="text-white/75 mb-6 font-light">{pkg.description}</p>
                      
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-white/85 font-light">
                            <svg className="w-4 h-4 text-gold mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {pkg.discount && (
                        <div className="mb-6 p-4 bg-gold/10 border border-gold/20 rounded-lg">
                          <p className="text-gold text-sm font-light italic leading-relaxed">
                            {pkg.discount}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => scrollToSection('contact')}
                        className={`w-full py-3 text-center font-medium tracking-wide transition-all duration-300 ${pkg.featured 
                          ? 'bg-gold hover:bg-gold/90 text-primary' 
                          : 'border border-gold text-gold hover:bg-gold hover:text-primary'
                        }`}
                      >
                        Požádat o nabídku
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wedding Packages Section */}
        <section id="svatebni-balicky" className="py-20 bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-amber-900">
                Svatební <span className="text-amber-700">Balíček</span>
              </h2>
              <div className="h-px w-24 bg-amber-600 mx-auto mb-8"></div>
              <p className="text-xl text-amber-800/80 max-w-3xl mx-auto font-light">
                Speciální svatební nabídky navržené pro váš nejdůležitější den. Každý balíček zahrnuje vše potřebné pro nezapomenutelnou svatební oslavu.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {weddingPackages.map((pkg, index) => (
                <div key={index} className={`relative group ${pkg.featured ? 'lg:scale-105 lg:-mt-4' : ''}`}>
                  <div className={`bg-gradient-to-b from-white/90 to-amber-50/80 border ${pkg.featured ? 'border-amber-400/60' : 'border-amber-300/40'} rounded-xl shadow-lg overflow-hidden hover:border-amber-500/50 transition-all duration-500 hover:scale-105 hover:shadow-xl`}>
                    {pkg.featured && (
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2 text-sm font-semibold tracking-wide">
                        NEJOBLÍBENĚJŠÍ
                      </div>
                    )}
                    
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-serif font-semibold text-white mb-1">{pkg.name}</h3>
                        <p className="text-amber-100 text-sm font-light italic">{pkg.guestCapacity}</p>
                      </div>
                    </div>

                    <div className="p-8">
                      <p className="text-3xl font-bold text-amber-900 mb-6 text-center">{pkg.price}</p>
                      
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-amber-800 font-medium">
                            <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => scrollToSection('contact')}
                        className={`w-full py-3 rounded-lg text-center font-semibold tracking-wide transition-all duration-300 ${pkg.featured 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg' 
                          : 'border-2 border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white'
                        } transform hover:scale-105`}
                      >
                        Požádat o nabídku
                      </button>
                    </div>
                  </div>

                  {pkg.bonus && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-amber-200/80 to-orange-200/80 border border-amber-300/60 rounded-xl shadow-md">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="text-amber-800 text-sm font-medium leading-relaxed italic">
                          <span className="font-semibold text-amber-900">Bonus:</span> {pkg.bonus}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-primary">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
                Naše <span className="text-gold">galerie</span>
              </h2>
              <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
              <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
                Zažijte umění a eleganci, které definují každou akci THE BAR. prostřednictvím naší kurátorské kolekce nezapomenutelných okamžiků.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg aspect-square">
                  <img 
                    src={image}
                    alt={`Galerie obrázek ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-20 bg-gradient-to-b from-dark-navy to-primary">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
                Recenze <span className="text-gold">klientů</span>
              </h2>
              <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
              <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
                Nejen co říkáme my - slyšte, co říkají naši klienti o svých nezapomenutelných zážitcích s THE BAR.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((review, index) => (
                <div key={index} className="bg-gradient-to-b from-primary/60 to-dark-navy/80 border border-white/10 rounded-lg p-8 hover:border-gold/30 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/85 mb-6 italic leading-relaxed font-light">"{review.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.248.713 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">{review.name}</div>
                      <div className="text-gold text-sm font-light">{review.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-primary">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
                Ozvěte se <span className="text-gold">nám</span>
              </h2>
              <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
              <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
                Připraveni posunout vaši akci na vyšší úroveň? Kontaktujte nás, abyste projednali svou vizi a nechte nás vytvořit nezapomenutelný koktejlový zážitek.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="bg-gradient-to-b from-dark-navy/50 to-primary/50 border border-white/10 rounded-lg p-8">
                <h3 className="text-2xl font-serif font-light mb-6 text-white">Pošlete nám zprávu</h3>
                <form onSubmit={handleContactFormSubmit} className="space-y-6">
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Vaše jméno" 
                      value={contactFormData.name}
                      onChange={handleContactFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        contactErrors.name ? 'border-red-500' : 'border-white/20'
                      } rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light`}
                    />
                    {contactErrors.name && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{contactErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="E-mailová adresa" 
                      value={contactFormData.email}
                      onChange={handleContactFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        contactErrors.email ? 'border-red-500' : 'border-white/20'
                      } rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light`}
                    />
                    {contactErrors.email && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{contactErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Telefonní číslo" 
                      value={contactFormData.phone}
                      onChange={handleContactFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        contactErrors.phone ? 'border-red-500' : 'border-white/20'
                      } rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light`}
                    />
                    {contactErrors.phone && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{contactErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <select 
                      name="eventType"
                      value={contactFormData.eventType}
                      onChange={handleContactFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        contactErrors.eventType ? 'border-red-500' : 'border-white/20'
                      } rounded px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors duration-300 font-light appearance-none bg-no-repeat bg-right-4 bg-center`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundSize: '16px',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="" className="text-white/70 bg-primary">Vyberte službu</option>
                      <option value="hotova-reseni" className="text-white bg-primary">Hotová řešení</option>
                      <option value="svatebni-balicky" className="text-white bg-primary">Svatební Balíčky</option>
                      <option value="koktejlovy-bar" className="text-white bg-primary">Koktejlový Bar</option>
                      <option value="pyramida-sampanskeho" className="text-white bg-primary">Elegantní pyramida šampaňského</option>
                      <option value="welcome-zona" className="text-white bg-primary">Welcome zóna s ledovým blokem a květinou uvnitř</option>
                      <option value="bar-welcome-zona" className="text-white bg-primary">Koktejlový Bar + Welcome zóna</option>
                      <option value="masterclass" className="text-white bg-primary">MasterClass</option>
                    </select>
                    {contactErrors.eventType && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{contactErrors.eventType}</p>
                    )}
                  </div>
                  <div>
                    <textarea 
                      rows="4" 
                      name="message"
                      placeholder="Řekněte nám o vaší akci..." 
                      value={contactFormData.message}
                      onChange={handleContactFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        contactErrors.message ? 'border-red-500' : 'border-white/20'
                      } rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 resize-none font-light`}
                    ></textarea>
                    {contactErrors.message && (
                      <p className="text-red-400 text-xs mt-1 font-sans">{contactErrors.message}</p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gold hover:bg-gold/90 text-primary py-3 font-medium tracking-wide transition-all duration-300 hover:scale-105"
                  >
                    Odeslat zprávu
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-serif font-light mb-6 text-white">Kontaktní informace</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white/85 font-light">thebar.event@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a 
                        href="tel:+420775505805"
                        className="text-white/85 hover:text-gold transition-colors duration-300 font-light"
                        title="Zavolejte nám"
                      >
                        +420 775 505 805
                      </a>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white/85 font-light">Praha, Česká republika</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-xl font-serif font-light mb-4 text-white">Sledujte nás</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.instagram.com/thebar.catering?igsh=MWc5YWF2MHBoMjNlZA%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 text-white/85 hover:text-gold transition-colors duration-300 bg-white/5 rounded-lg hover:bg-gold/10 hover:scale-110"
                      title="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61578282090185"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 text-white/85 hover:text-gold transition-colors duration-300 bg-white/5 rounded-lg hover:bg-gold/10 hover:scale-110"
                      title="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.tiktok.com/@thebar.catering?_t=ZN-8yBl7qc90oY&_r=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 text-white/85 hover:text-gold transition-colors duration-300 bg-white/5 rounded-lg hover:bg-gold/10 hover:scale-110"
                      title="TikTok"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005.16 20.5a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.2-.5z"/>
                      </svg>
                    </a>
                  </div>
                  
                  {/* WhatsApp Contact Button */}
                  <div className="mt-6">
                    <a 
                      href="https://wa.me/420775505805"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center w-full bg-gradient-to-r from-gold to-gold/90 text-primary py-3 px-4 rounded-lg hover:from-gold/90 hover:to-gold/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20 font-medium"
                      title="WhatsApp kontakt"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span className="font-sans font-semibold tracking-wide">
                        Napište nám na WhatsApp
                      </span>
                    </a>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-navy border-t border-white/10 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-serif font-light text-gold mb-4">THE BAR.</h3>
                <p className="text-white/75 leading-relaxed font-light">
                  Prémiový koktejlový catering v Praze, vytváří nezapomenutelné okamžiky prostřednictvím umění, přesnosti a nekompromisní kvality.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-4 font-serif">Rychlé odkazy</h4>
                <div className="space-y-2">
                  {['O nás', 'Balíčky', 'Svatební Balíčky', 'Galerie', 'Recenze', 'Kontakt'].map((item, index) => {
                    const sectionIds = ['about', 'packages', 'svatebni-balicky', 'gallery', 'reviews', 'contact'];
                    return (
                      <button
                        key={item}
                        onClick={() => scrollToSection(sectionIds[index])}
                        className="block text-white/75 hover:text-gold transition-colors duration-300 font-light"
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-4 font-serif">Kontakt</h4>
                <div className="space-y-2 text-white/75 font-light">
                  <p>Praha, Česká republika</p>
                  <p>+420 775 505 805</p>
                  <p>thebar.event@gmail.com</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-4 font-serif">Informace o společnosti</h4>
                <div className="space-y-2 text-white/75 font-light">
                  <p>IČO: 23284111</p>
                  <p>Kaprová 42/12</p>
                  <p>Praha 1, 110 00</p>
                  <p>Česká republika</p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8">
              <div className="text-center mb-4">
                <p className="text-white/50 font-light">
                  © 2025 THE BAR. Prémiový koktejlový catering. Všechna práva vyhrazena.
                </p>
              </div>
              {/* GDPR Consent Section */}
              <div className="text-center">
                <p className="text-white/40 font-light text-sm leading-relaxed max-w-4xl mx-auto">
                  *Kliknutím na tlačítko vyjadřujete souhlas se zpracováním osobních údajů a souhlasíte se{' '}
                  <button 
                    onClick={() => setShowGdprPage(true)}
                    className="text-gold hover:text-gold/80 cursor-pointer underline transition-colors duration-300"
                  >
                    zásadami ochrany osobních údajů
                  </button>.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;