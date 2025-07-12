import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const packages = [
    {
      name: "Signature Experience",
      price: "From €299",
      description: "Perfect for intimate gatherings",
      features: [
        "3 classic cocktails",
        "Stylish portable bar setup",
        "1 professional bartender",
        "Basic glassware & tools",
        "2-3 hours service"
      ],
      image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Premium Flair",
      price: "From €599",
      description: "Elevated experience for special occasions",
      features: [
        "5 signature cocktails",
        "Premium ice sculptures",
        "2 professional bartenders", 
        "Luxury bar decoration",
        "Premium glassware",
        "4-5 hours service"
      ],
      image: "https://images.unsplash.com/photo-1705944601084-3d8119490b26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
      featured: true
    },
    {
      name: "Ultra Premium Showcase",
      price: "From €1299",
      description: "The ultimate luxury cocktail experience",
      features: [
        "Full custom cocktail menu",
        "LED-lit premium bar setup",
        "Champagne tower service",
        "Edible flowers & garnishes",
        "Bartender show & flair",
        "Personalized service details",
        "Full event service"
      ],
      image: "https://images.unsplash.com/flagged/photo-1571046423953-30c053888852?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      event: "Wedding in Prague Castle",
      rating: 5,
      text: "Absolutely exceptional service! The cocktails were perfection and the ice sculptures with orchids were breathtaking. Our guests are still talking about it months later.",
      image: "https://images.unsplash.com/photo-1573830539666-1f96afdf149f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      name: "Corporate Event Manager",
      event: "Tech Company Launch",
      rating: 5,
      text: "Professional, elegant, and exactly what we needed for our high-profile launch. The team exceeded all expectations.",
      image: "https://images.pexels.com/photos/4862865/pexels-photo-4862865.jpeg"
    },
    {
      name: "Isabella Rodriguez",
      event: "Private Birthday Celebration",
      rating: 5,
      text: "THE BAR. transformed our simple gathering into an unforgettable luxury experience. Worth every euro!",
      image: "https://images.pexels.com/photos/5550310/pexels-photo-5550310.jpeg"
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1526894198609-10b3cdf45c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1619296730225-3963e70354ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1705944601084-3d8119490b26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1573830539666-1f96afdf149f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85",
    "https://images.pexels.com/photos/4862865/pexels-photo-4862865.jpeg"
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-lg border-b border-gold/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif font-light text-gold tracking-wider">THE BAR.</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Home', 'About', 'Packages', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                    className="text-white/80 hover:text-gold transition-colors duration-300 text-sm font-light tracking-wide"
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
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Home', 'About', 'Packages', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                  className="block px-3 py-2 text-white/80 hover:text-gold transition-colors duration-300 text-sm font-light tracking-wide w-full text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1526894198609-10b3cdf45c52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzc2VzfGVufDB8fHxibGFja3wxNzUyMzUzMDExfDA&ixlib=rb-4.1.0&q=85')`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
        
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <div className="opacity-0 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 text-white tracking-wide leading-tight">
              THE BAR.<span className="text-gold">.</span>
            </h1>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-light mb-8 text-white/90 leading-relaxed">
              Signature Cocktails. Mobile Bar. Unforgettable Moments.
            </p>
            <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
              Premium cocktail catering in Prague bringing luxury, artistry, and unforgettable experiences to your most important events.
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-gold hover:bg-gold/90 text-black px-8 py-4 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
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
      <section id="about" className="py-20 bg-gradient-to-b from-black to-dark-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-white">
                The Art of <span className="text-gold">Mixology</span>
              </h2>
              <div className="h-px w-16 bg-gold mb-8"></div>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Based in the heart of Prague, THE BAR. represents the pinnacle of cocktail craftsmanship. We believe that every drink tells a story, and every event deserves perfection.
              </p>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Our passion for mixology goes beyond simple cocktails. We create immersive experiences with signature ice sculptures, premium spirits, and theatrical presentation that transforms any gathering into an unforgettable celebration.
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                From intimate private parties to grand corporate events, we bring the luxury bar experience directly to you, complete with professional bartenders, premium equipment, and uncompromising attention to detail.
              </p>
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">50+</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Premium Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">15+</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Signature Cocktails</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">100%</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1619296730225-3963e70354ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjb2NrdGFpbHxlbnwwfHx8YmxhY2t8MTc1MjM1MzAwNXww&ixlib=rb-4.1.0&q=85"
                  alt="Professional bartender crafting cocktails"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Choose from our carefully crafted service packages, each designed to deliver an exceptional cocktail experience tailored to your event's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`relative group ${pkg.featured ? 'lg:scale-105 lg:-mt-4' : ''}`}
              >
                <div className={`bg-gradient-to-b from-black/80 to-dark-navy border ${pkg.featured ? 'border-gold/50' : 'border-white/10'} rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-500 hover:scale-105`}>
                  {pkg.featured && (
                    <div className="bg-gold text-black text-center py-2 text-sm font-medium tracking-wide">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-serif font-light mb-2 text-white">{pkg.name}</h3>
                    <p className="text-3xl font-light text-gold mb-4">{pkg.price}</p>
                    <p className="text-white/70 mb-6">{pkg.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-white/80">
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
                        ? 'bg-gold hover:bg-gold/90 text-black' 
                        : 'border border-gold text-gold hover:bg-gold hover:text-black'
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
      <section id="gallery" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Our <span className="text-gold">Gallery</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
      <section id="reviews" className="py-20 bg-gradient-to-b from-dark-navy to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Client <span className="text-gold">Reviews</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Don't just take our word for it - hear what our clients say about their unforgettable experiences with THE BAR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <div key={index} className="bg-gradient-to-b from-black/60 to-dark-navy/80 border border-white/10 rounded-lg p-8 hover:border-gold/30 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic leading-relaxed">"{review.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="text-white font-medium">{review.name}</div>
                    <div className="text-gold text-sm">{review.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-white">
              Get In <span className="text-gold">Touch</span>
            </h2>
            <div className="h-px w-24 bg-gold mx-auto mb-8"></div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Ready to elevate your event? Contact us to discuss your vision and let us create an unforgettable cocktail experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gradient-to-b from-dark-navy/50 to-black/50 border border-white/10 rounded-lg p-8">
              <h3 className="text-2xl font-serif font-light mb-6 text-white">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Event Type & Date" 
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us about your event..." 
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors duration-300 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-black py-3 font-medium tracking-wide transition-all duration-300 hover:scale-105"
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
                    <span className="text-white/80">thebar.catering@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-white/80">+420 775 505 805</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white/80">Prague, Czech Republic</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6">
                <h4 className="text-xl font-medium mb-3 text-white">Quick Response via WhatsApp</h4>
                <p className="text-white/90 mb-4">Get instant answers to your questions and quick quotes for your event.</p>
                <a 
                  href="https://wa.me/420775505805"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded font-medium hover:bg-white/90 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-xl font-serif font-light mb-4 text-white">Follow Us</h4>
                <a 
                  href="https://instagram.com/thebar.catering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white/80 hover:text-gold transition-colors duration-300"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987S24.005 18.607 24.005 11.987C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.977 3.85 13.116 5.127 11.84c1.276-1.276 3.138-1.276 4.414 0s1.276 3.138 0 4.414c-.875.806-2.026 1.297-3.323 1.297-.367 0-.734-.042-1.089-.126z"/>
                  </svg>
                  @thebar.catering
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-navy border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-light text-gold mb-4">THE BAR.</h3>
              <p className="text-white/70 leading-relaxed">
                Premium cocktail catering in Prague, creating unforgettable moments through artistry, precision, and uncompromising quality.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['About', 'Packages', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block text-white/70 hover:text-gold transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Contact</h4>
              <div className="space-y-2 text-white/70">
                <p>Prague, Czech Republic</p>
                <p>+420 775 505 805</p>
                <p>thebar.catering@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/50">
              © 2025 THE BAR. Premium Cocktail Catering. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;