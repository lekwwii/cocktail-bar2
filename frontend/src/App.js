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
    date: '',
    service: ''
  });

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

    // Add event listeners with proper options
    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('focus', handleFocusCapture, true);
    document.addEventListener('keydown', handleKeyDown);
    
    // Initial cleanup
    cleanupContentEditable();
    
    // Periodic cleanup every 2 seconds instead of every second for better performance
    const cleanupInterval = setInterval(cleanupContentEditable, 2000);

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
      name: "Signature Experience",
      price: "Od 7.500 Kč",
      description: "Perfektní pro intimní setkání",
      features: [
        "3 klasické koktejly",
        "Stylový přenosný bar",
        "1 profesionální barman",
        "Základní sklenice a nástroje",
        "2-3 hodiny obsluhy"
      ],
      image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Premium Flair",
      price: "Od 15.000 Kč",
      description: "Vyšší úroveň pro speciální příležitosti",
      features: [
        "5 signature koktejlů",
        "Prémiové ledové sochy",
        "2 profesionální barmani", 
        "Luxusní výzdoba baru",
        "Prémiové sklenice",
        "4-5 hodin obsluhy"
      ],
      image: "https://images.unsplash.com/photo-1705944601084-3d8119490b26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
      featured: true
    },
    {
      name: "Ultra Premium Showcase",
      price: "Od 35.000 Kč",
      description: "Vrcholný luxusní koktejlový zážitek",
      features: [
        "Plně personalizované koktejlové menu",
        "LED osvícený prémiový bar",
        "Šampaňská věž",
        "Jedlé květiny a ozdoby",
        "Barmanská show a flair",
        "Personalizované detaily obsluhy",
        "Kompletní event servis"
      ],
      image: "https://images.unsplash.com/flagged/photo-1571046423953-30c053888852?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiYXJ8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTB8MA&ixlib=rb-4.1.0&q=85"
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      event: "Svatba na Pražském hradě",
      rating: 5,
      text: "Absolutně výjimečná obsluha! Koktejly byly dokonalé a ledové sochy s orchidejemi byly úchvatné. Naši hosté o tom ještě po měsících mluví.",
      image: "https://images.unsplash.com/photo-1573830539666-1f96afdf149f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Manažer firemních akcí",
      event: "Spuštění technologické společnosti",
      rating: 5,
      text: "Profesionální, elegantní a přesně to, co jsme potřebovali pro naše významné spuštění. Tým překonal všechna očekávání svou sofistikovanou prezentací.",
      image: "https://images.unsplash.com/photo-1596351992649-8cea3853ba92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXJ8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTB8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Isabella Rodríguez",
      event: "Soukromá oslava narozenin",
      rating: 5,
      text: "THE BAR. změnil naše jednoduché setkání na nezapomenutelný luxusní zážitek. Pozornost věnovaná detailům a prémiová obsluha stála za každou korunu!",
      image: "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwY29ja3RhaWx8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTh8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Viktor & Anna",
      event: "Oslava výročí",
      rating: 5,
      text: "Neuvěřitelné řemeslné umění! Každý koktejl byl uměleckým dílem. Prémiová obsluha a elegantní prezentace učinily naše výročí skutečně výjimečným.",
      image: "https://images.unsplash.com/photo-1650814843722-2498e2aa8e3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY29ja3RhaWx8ZW58MHx8fGJsYWNrfDE3NTIzNTM5NTh8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Pražská skupina hotelů",
      event: "VIP události pro hosty",
      rating: 5,
      text: "THE BAR. se stal naším partnerem pro luxusní zážitky hostů. Konzistentně výjimečná kvalita a služby, které odpovídají našim prémiovým standardům.",
      image: "https://images.pexels.com/photos/4705928/pexels-photo-4705928.jpeg"
    },
    {
      name: "Marie Nováková",
      event: "Firemní gala",
      rating: 5,
      text: "Vynikající profesionalita a kreativita. Personalizované koktejlové menu dokonale doplnilo téma naší akce. Vřele doporučuji pro jakoukoli prémiovou příležitost.",
      image: "https://images.pexels.com/photos/5550310/pexels-photo-5550310.jpeg"
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
          onClick={() => setShowPopup(false)}
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
                      } rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm`}
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
                      } rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm`}
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
                    } rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm`}
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
                    } rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm date-input`}
                    style={{
                      colorScheme: 'dark'
                    }}
                  />
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
                    } rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors duration-300 font-sans font-normal text-sm`}
                  >
                    <option value="" className="text-white/70">Vyberte si službu</option>
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
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-6">
                  {['Úvod', 'O nás', 'Balíčky', 'Galerie', 'Recenze', 'Kontakt'].map((item, index) => {
                    const sectionIds = ['hero', 'about', 'packages', 'gallery', 'reviews', 'contact'];
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
            <div className="md:hidden">
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
                {['Úvod', 'O nás', 'Balíčky', 'Galerie', 'Recenze', 'Kontakt'].map((item, index) => {
                  const sectionIds = ['hero', 'about', 'packages', 'gallery', 'reviews', 'contact'];
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
                  THE BAR<span className="text-gold">.</span>
                </h1>
                <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
                <p className="text-xl md:text-2xl font-serif font-medium mb-8 text-white/95 leading-relaxed">
                  Signature koktejly. Mobilní bar. Nezapomenutelné okamžiky.
                </p>
                <p className="text-lg text-white/75 mb-12 max-w-2xl mx-auto font-sans font-normal">
                  Prémiový koktejlový catering v Praze přináší luxus, umění a nezapomenutelné zážitky na vaše nejdůležitější události.
                </p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="bg-gold hover:bg-gold/90 text-primary px-8 py-4 text-lg font-sans font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
                >
                  Rezervovat akci
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

        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-b from-primary to-dark-navy">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-white">
                  Umění <span className="text-gold">mixologie</span>
                </h2>
                <div className="h-px w-16 bg-gold mb-8"></div>
                <p className="text-lg text-white/85 mb-6 leading-relaxed font-sans font-normal">
                  Sídlící v srdci Prahy, THE BAR. představuje vrchol koktejlového řemesla. Věříme, že každý nápoj vypráví příběh a každá událost si zaslouží dokonalost.
                </p>
                <p className="text-lg text-white/85 mb-6 leading-relaxed font-sans font-normal">
                  Naše vášeň pro mixologii jde nad rámec jednoduchých koktejlů. Vytváříme pohlcující zážitky se signature ledovými sochami, prémiovými destiláty a divadelní prezentací, která přemění jakékoli setkání na nezapomenutelnou oslavu.
                </p>
                <p className="text-lg text-white/85 mb-8 leading-relaxed font-sans font-normal">
                  Od intimních soukromých večírků po velkolepé firemní akce přinášíme luxusní barový zážitek přímo k vám, kompletní s profesionálními barmany, prémiovým vybavením a nekompromisní pozorností k detailům.
                </p>
                <div className="flex space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-serif font-semibold text-gold mb-2">25+</div>
                    <div className="text-sm text-white/60 uppercase tracking-wide font-sans font-medium">Prémiových akcí</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-serif font-semibold text-gold mb-2">15+</div>
                    <div className="text-sm text-white/60 uppercase tracking-wide font-sans font-medium">Signature koktejlů</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-serif font-semibold text-gold mb-2">100%</div>
                    <div className="text-sm text-white/60 uppercase tracking-wide font-sans font-medium">Spokojenost klientů</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1619296730225-3963e70354ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
                    alt="Profesionální barman připravující koktejly"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-gold/30 rounded-lg"></div>
                <div className="absolute -top-6 -right-6 w-16 h-16 border border-gold/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-20 bg-dark-navy">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
                Naše <span className="text-gold">balíčky</span>
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
                    <img 
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      loading="lazy"
                    />
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
                    <input 
                      type="text" 
                      name="eventType"
                      placeholder="Typ akce a datum" 
                      value={contactFormData.eventType}
                      onChange={handleContactFormChange}
                      required
                      className={`w-full bg-primary/50 border ${
                        contactErrors.eventType ? 'border-red-500' : 'border-white/20'
                      } rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light`}
                    />
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
                        href="https://wa.me/420775505805"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/85 hover:text-gold transition-colors duration-300 font-light"
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
                      href="https://instagram.com/thebar.catering"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white/85 hover:text-gold transition-colors duration-300 bg-white/5 rounded-lg p-3 hover:bg-gold/10"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987S24.005 18.607 24.005 11.987C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.977 3.85 13.116 5.127 11.84c1.276-1.276 3.138-1.276 4.414 0s1.276 3.138 0 4.414c-.875.806-2.026 1.297-3.323 1.297-.367 0-.734-.042-1.089-.126z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61578282090185"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white/85 hover:text-gold transition-colors duration-300 bg-white/5 rounded-lg p-3 hover:bg-gold/10"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.tiktok.com/@thebar.catering"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white/85 hover:text-gold transition-colors duration-300 bg-white/5 rounded-lg p-3 hover:bg-gold/10"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.342-1.85-1.342-3.062V1h-3.317v14.138c0 2.104-1.712 3.817-3.817 3.817-2.104 0-3.817-1.712-3.817-3.817s1.712-3.817 3.817-3.817c.394 0 .774.06 1.134.171V8.075a7.094 7.094 0 00-1.134-.092c-3.908 0-7.083 3.175-7.083 7.083S9.358 22.15 13.266 22.15s7.083-3.175 7.083-7.083V8.909a9.496 9.496 0 005.651 1.842V7.434a5.617 5.617 0 01-6.679-1.872z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-gradient-to-br from-gold/15 to-gold/5 rounded-xl p-6 border border-gold/20 shadow-lg">
                  <h4 className="text-lg font-serif font-light mb-3 text-white text-center">Rychlá odpověď</h4>
                  <p className="text-white/85 mb-4 font-light text-sm leading-relaxed text-center">Získejte okamžité odpovědi přes WhatsApp</p>
                  <div className="flex justify-center">
                    <a 
                      href="https://wa.me/420775505805"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 bg-gold text-primary rounded-full flex items-center justify-center hover:bg-gold/90 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gold/30"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  {['O nás', 'Balíčky', 'Galerie', 'Recenze', 'Kontakt'].map((item, index) => {
                    const sectionIds = ['about', 'packages', 'gallery', 'reviews', 'contact'];
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
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-white/50 font-light">
                © 2025 THE BAR. Prémiový koktejlový catering. Všechna práva vyhrazena.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;