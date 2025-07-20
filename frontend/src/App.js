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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Ensure page is fully loaded
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Popup logic
    const showPopupTimer = setTimeout(() => {
      if (!hasShownPopup) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    }, 5000);

    const handleScrollPopup = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 30 && !hasShownPopup) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    };

    window.addEventListener('scroll', handleScrollPopup);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollPopup);
      clearTimeout(timer);
      clearTimeout(showPopupTimer);
    };
  }, [hasShownPopup]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowPopup(false);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      service: ''
    });
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-primary to-dark-navy border border-gold/20 rounded-xl max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-gold transition-colors duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-serif font-light mb-4 text-gold text-center">
                DÁRKOVÉ KOKTEJLY
              </h3>
              <p className="text-white/85 text-center mb-6 font-light leading-relaxed">
                Nejste si jistí, co si vybrat? Vyplňte krátký formulář a pomohu vám s výběrem. 
                Navíc můžete získat až 10 signature drinků zcela zdarma!
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Jméno"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-primary/50 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light text-sm"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-primary/50 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light text-sm"
                  />
                </div>
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-primary/50 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light text-sm"
                />
                
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    placeholder="Datum akce"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-primary/50 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light text-sm"
                  />
                </div>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-primary/50 border border-white/20 rounded px-3 py-2 text-white focus:border-gold focus:outline-none transition-colors duration-300 font-light text-sm"
                >
                  <option value="">Vyberte si službu</option>
                  <option value="koktejlovy-bar">Koktejlový bar</option>
                  <option value="pyramida">Elegantní pyramida šampaňského</option>
                  <option value="welcome-zona">Welcome zóna s ledovým blokem a květinou uvnitř</option>
                  <option value="bar-welcome">Koktejlový bar + Welcome zóna</option>
                  <option value="masterclass">MasterClass</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-primary py-3 font-medium tracking-wide transition-all duration-300 hover:scale-105 rounded"
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
                <h1 className="text-3xl font-serif font-light text-gold tracking-widest">THE BAR.</h1>
              </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                {['Home', 'About', 'Packages', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                    className="text-white/90 hover:text-gold transition-colors duration-300 text-base font-serif font-light tracking-wide px-2 py-1"
                  >
                    {item}
                  </button>
                ))}
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
                {['Home', 'About', 'Packages', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                    className="block px-3 py-2 text-white/80 hover:text-gold transition-colors duration-300 text-base font-serif font-light tracking-wide w-full text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1526894198609-10b3cdf45c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85')`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        ></div>
        
        <div className={`relative z-20 text-center max-w-4xl mx-auto px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 text-white tracking-wide leading-tight">
              THE BAR<span className="text-gold">.</span>
            </h1>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-serif font-light mb-8 text-white/95 leading-relaxed">
              Signature Cocktails. Mobile Bar. Unforgettable Moments.
            </p>
            <p className="text-lg text-white/75 mb-12 max-w-2xl mx-auto font-light">
              Premium cocktail catering in Prague bringing luxury, artistry, and unforgettable experiences to your most important events.
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-gold hover:bg-gold/90 text-primary px-8 py-4 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
            >
              Book Your Event
            </button>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-white">
                The Art of <span className="text-gold">Mixology</span>
              </h2>
              <div className="h-px w-16 bg-gold mb-8"></div>
              <p className="text-lg text-white/85 mb-6 leading-relaxed font-light">
                Based in the heart of Prague, THE BAR. represents the pinnacle of cocktail craftsmanship. We believe that every drink tells a story, and every event deserves perfection.
              </p>
              <p className="text-lg text-white/85 mb-6 leading-relaxed font-light">
                Our passion for mixology goes beyond simple cocktails. We create immersive experiences with signature ice sculptures, premium spirits, and theatrical presentation that transforms any gathering into an unforgettable celebration.
              </p>
              <p className="text-lg text-white/85 mb-8 leading-relaxed font-light">
                From intimate private parties to grand corporate events, we bring the luxury bar experience directly to you, complete with professional bartenders, premium equipment, and uncompromising attention to detail.
              </p>
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">25+</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide font-light">Premium Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">15+</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide font-light">Signature Cocktails</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">100%</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide font-light">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1619296730225-3963e70354ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
                  alt="Professional bartender crafting cocktails"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Our <span className="text-gold">Packages</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
              Choose from our carefully crafted service packages, each designed to deliver an exceptional cocktail experience tailored to your event's needs.
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
                      MOST POPULAR
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
                      Request Offer
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Our <span className="text-gold">Gallery</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
              Experience the artistry and elegance that defines every THE BAR. event through our curated collection of memorable moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg aspect-square">
                <img 
                  src={image}
                  alt={`Gallery image ${index + 1}`}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Client <span className="text-gold">Reviews</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
              Don't just take our word for it - hear what our clients say about their unforgettable experiences with THE BAR.
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Get In <span className="text-gold">Touch</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/75 max-w-3xl mx-auto font-light">
              Ready to elevate your event? Contact us to discuss your vision and let us create an unforgettable cocktail experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gradient-to-b from-dark-navy/50 to-primary/50 border border-white/10 rounded-lg p-8">
              <h3 className="text-2xl font-serif font-light mb-6 text-white">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full bg-primary/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-primary/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full bg-primary/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Event Type & Date" 
                    className="w-full bg-primary/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>
                <div>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us about your event..." 
                    className="w-full bg-primary/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 resize-none font-light"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-primary py-3 font-medium tracking-wide transition-all duration-300 hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-light mb-6 text-white">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/85 font-light">thebar.catering@gmail.com</span>
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
                    <span className="text-white/85 font-light">Prague, Czech Republic</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-xl font-serif font-light mb-4 text-white">Follow Us</h4>
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
                <h4 className="text-lg font-serif font-light mb-3 text-white text-center">Quick Response</h4>
                <p className="text-white/85 mb-4 font-light text-sm leading-relaxed text-center">Get instant answers via WhatsApp</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-light text-gold mb-4">THE BAR.</h3>
              <p className="text-white/75 leading-relaxed font-light">
                Premium cocktail catering in Prague, creating unforgettable moments through artistry, precision, and uncompromising quality.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4 font-serif">Quick Links</h4>
              <div className="space-y-2">
                {['About', 'Packages', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block text-white/75 hover:text-gold transition-colors duration-300 font-light"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4 font-serif">Contact</h4>
              <div className="space-y-2 text-white/75 font-light">
                <p>Prague, Czech Republic</p>
                <p>+420 775 505 805</p>
                <p>thebar.catering@gmail.com</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4 font-serif">Company Info</h4>
              <div className="space-y-2 text-white/75 font-light">
                <p>IČO: 23284111</p>
                <p>Kaprová 42/12</p>
                <p>Praha 1, 110 00</p>
                <p>Czech Republic</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/50 font-light">
              © 2025 THE BAR. Premium Cocktail Catering. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default App;