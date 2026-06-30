// JavaScript Interactivity for Sai Surya Dental Clinic Multi-page website

document.addEventListener("DOMContentLoaded", () => {
  // --- Cinematic Preloader (First Load Only) ---
  const preloader = document.getElementById('logoPreloader');
  if (preloader) {
    const isVisited = sessionStorage.getItem('saisurya_preloader_shown') === 'true';
    if (isVisited) {
      preloader.style.display = 'none';
      document.documentElement.classList.remove('preloader-active-lock');
    } else {
      // Run preloader cinematic sequence, then fade out and open gates
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.documentElement.classList.remove('preloader-active-lock');
        sessionStorage.setItem('saisurya_preloader_shown', 'true');
        
        // Remove from DOM once gates have fully slid away
        setTimeout(() => {
          preloader.remove();
        }, 1500);
      }, 3500);
    }
  }

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  
  if (mobileMenuBtn && mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      const isExpanded = !mobileMenu.classList.contains("hidden");
      mobileMenuBtn.innerHTML = isExpanded 
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
      });
    });
  }

  // --- Scroll Actions (Sticky header & Scroll-to-Top button) ---
  const header = document.querySelector("header");
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  window.addEventListener("scroll", () => {
    // Sticky Header Shadows
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("shadow-lg", "glass-nav");
        header.classList.remove("bg-white/95");
      } else {
        header.classList.remove("shadow-lg", "glass-nav");
        header.classList.add("bg-white/95");
      }
    }

    // Scroll to Top visibility
    if (scrollToTopBtn) {
      if (window.scrollY > 500) {
        scrollToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
        scrollToTopBtn.classList.add("opacity-100", "translate-y-0");
      } else {
        scrollToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
        scrollToTopBtn.classList.remove("opacity-100", "translate-y-0");
      }
    }
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Animated Counters (About page only) ---
  const counterSection = document.getElementById("about");
  const counters = document.querySelectorAll(".counter-value");
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const suffix = counter.getAttribute("data-suffix") || "";
      let count = 0;
      const speed = target / 50;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.floor(count).toLocaleString() + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString() + suffix;
        }
      };
      updateCount();
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
      }
    });
  }, { threshold: 0.2 });

  if (counterSection && counters.length > 0) {
    counterObserver.observe(counterSection);
  }

  // --- FAQ Accordions (FAQ page only) ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-btn");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    questionBtn.addEventListener("click", () => {
      const isOpen = !answer.classList.contains("hidden");
      
      faqItems.forEach(i => {
        i.querySelector(".faq-answer").classList.add("hidden");
        i.querySelector(".faq-icon").classList.remove("rotate-180");
        i.querySelector(".faq-btn").classList.remove("text-sky-600");
      });

      if (!isOpen) {
        answer.classList.remove("hidden");
        icon.classList.add("rotate-180");
        questionBtn.classList.add("text-sky-600");
      }
    });
  });

  // --- Testimonials Carousel & Submission API (Testimonials page only) ---
  const testimonialContainer = document.getElementById("testimonial-container");
  const dotsContainer = document.getElementById("testimonial-dots");
  
  if (testimonialContainer && dotsContainer) {
    let testimonials = [];
    let currentSlide = 0;
    let slideInterval;

    const renderTestimonials = () => {
      testimonialContainer.innerHTML = "";
      dotsContainer.innerHTML = "";

      testimonials.forEach((t, index) => {
        const card = document.createElement("div");
        card.className = "w-full flex-shrink-0 px-4";
        
        let stars = "";
        for (let i = 0; i < 5; i++) {
          stars += `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
        }

        card.innerHTML = `
          <div class="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div class="absolute -right-10 -bottom-10 opacity-[0.03] text-sky-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-40 w-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
            </div>
            <div class="flex-shrink-0">
              <img src="${t.avatar}" alt="${t.name}" class="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover">
            </div>
            <div class="flex-grow text-center md:text-left">
              <div class="flex justify-center md:justify-start gap-1 mb-2">${stars}</div>
              <p class="text-slate-600 italic text-base md:text-lg mb-4 font-body">"${t.text}"</p>
              <div>
                <h4 class="font-bold text-slate-800 text-base md:text-lg">${t.name}</h4>
                <p class="text-xs text-sky-600 font-semibold">${t.date}</p>
              </div>
            </div>
          </div>
        `;
        testimonialContainer.appendChild(card);

        const dot = document.createElement("button");
        dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-sky-500 w-6' : 'bg-slate-300 hover:bg-slate-400'}`;
        dot.addEventListener("click", () => {
          goToSlide(index);
          resetSlideTimer();
        });
        dotsContainer.appendChild(dot);
      });
    };

    const goToSlide = (index) => {
      currentSlide = index;
      testimonialContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      const dots = dotsContainer.querySelectorAll("button");
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add("bg-sky-500", "w-6");
          dot.classList.remove("bg-slate-300");
        } else {
          dot.classList.remove("bg-sky-500", "w-6");
          dot.classList.add("bg-slate-300");
        }
      });
    };

    const nextSlide = () => {
      let next = currentSlide + 1;
      if (next >= testimonials.length) {
        next = 0;
      }
      goToSlide(next);
    };

    const startSlideTimer = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const resetSlideTimer = () => {
      clearInterval(slideInterval);
      startSlideTimer();
    };

    // Load testimonials from Express API
    async function loadTestimonials() {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          testimonials = await response.json();
        } else {
          throw new Error("Failed response status");
        }
      } catch (err) {
        console.warn("Failed to load reviews from API, using default local fallback reviews.", err);
        testimonials = [
          {
            name: "Ravi Kumar",
            rating: 5,
            text: "Sai Surya Dental Clinic provided exceptional care for my dental implant. The doctors are highly professional and explain everything clearly. Highly recommended!",
            date: "June 2026",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          },
          {
            name: "Siri Latha",
            rating: 5,
            text: "I was terrified of root canals, but the treatment here was completely painless! The clinic is extremely hygienic and the staff is very polite. Best dental clinic in Gajuwaka.",
            date: "May 2026",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
          },
          {
            name: "K. Srinivasa Rao",
            rating: 5,
            text: "Very affordable pricing compared to other premium clinics in Visakhapatnam. Dr. Surya is very experienced and did an excellent job with my crowns and bridges.",
            date: "April 2026",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
          },
          {
            name: "Anjali Devi",
            rating: 5,
            text: "I got my invisible aligners done here. The results are amazing! The digital scanning and treatment planning were top-notch. Truly modern and advanced technology.",
            date: "March 2026",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          }
        ];
      }
      renderTestimonials();
      startSlideTimer();
    }

    loadTestimonials();

    // Rating star handler
    const reviewForm = document.getElementById("review-form");
    const reviewStars = document.querySelectorAll(".rating-star");
    let selectedRating = 5;

    reviewStars.forEach(star => {
      star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"), 10);
        reviewStars.forEach(s => {
          const val = parseInt(s.getAttribute("data-value"), 10);
          if (val <= selectedRating) {
            s.classList.add("text-amber-400", "fill-amber-400");
            s.classList.remove("text-slate-300");
          } else {
            s.classList.remove("text-amber-400", "fill-amber-400");
            s.classList.add("text-slate-300");
          }
        });
      });
    });

    // Submit review to API
    if (reviewForm) {
      reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("review-name");
        const textInput = document.getElementById("review-text");

        if (!nameInput.value.trim() || !textInput.value.trim()) {
          alert("Please fill out all fields.");
          return;
        }

        try {
          const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: nameInput.value.trim(),
              rating: selectedRating,
              text: textInput.value.trim()
            })
          });

          if (response.ok) {
            const newReview = await response.json();
            // Prepend new review locally from server
            testimonials.unshift(newReview);
          } else {
            throw new Error("Bad response status");
          }
        } catch (err) {
          console.warn("Failed to submit review to server, adding locally for preview.", err);
          // Fallback: Add to local array anyway so the user sees it immediately in preview!
          const avatarId = Math.floor(Math.random() * 70);
          const localNewReview = {
            name: nameInput.value.trim(),
            rating: selectedRating,
            text: textInput.value.trim(),
            date: "Just now (Preview)",
            avatar: `https://i.pravatar.cc/150?img=${avatarId}`
          };
          testimonials.unshift(localNewReview);
        }

        // Common success UI rendering
        currentSlide = 0;
        renderTestimonials();
        goToSlide(0);
        resetSlideTimer();

        // Reset form
        nameInput.value = "";
        textInput.value = "";
        selectedRating = 5;
        reviewStars.forEach(s => s.classList.add("text-amber-400", "fill-amber-400"));

        // Show Toast Alert
        const successMsg = document.getElementById("review-success-msg");
        successMsg.classList.remove("hidden");
        setTimeout(() => {
          successMsg.classList.add("hidden");
        }, 5000);
      });
    }
  }

  // --- Photo Gallery Lightbox (Gallery page only) ---
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCap = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");
    let activeGalleryIndex = 0;

    const showLightbox = (index) => {
      activeGalleryIndex = index;
      const item = galleryItems[activeGalleryIndex];
      const imgSrc = item.getAttribute("data-src") || item.querySelector("img").src;
      const caption = item.getAttribute("data-caption") || "";

      lightboxImg.src = imgSrc;
      lightboxCap.textContent = caption;
      lightbox.classList.remove("hidden");
      setTimeout(() => {
        lightbox.classList.add("show");
      }, 10);
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("show");
      setTimeout(() => {
        lightbox.classList.add("hidden");
      }, 300);
      document.body.style.overflow = "auto";
    };

    const nextLightboxImg = () => {
      let nextIdx = activeGalleryIndex + 1;
      if (nextIdx >= galleryItems.length) {
        nextIdx = 0;
      }
      showLightbox(nextIdx);
    };

    const prevLightboxImg = () => {
      let prevIdx = activeGalleryIndex - 1;
      if (prevIdx < 0) {
        prevIdx = galleryItems.length - 1;
      }
      showLightbox(prevIdx);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        showLightbox(index);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxNext.addEventListener("click", nextLightboxImg);
    lightboxPrev.addEventListener("click", prevLightboxImg);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-overlay")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("hidden")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextLightboxImg();
        if (e.key === "ArrowLeft") prevLightboxImg();
      }
    });
  }

  // --- Appointment Form Submission API (Home & Contact pages) ---
  const appointmentForm = document.getElementById("appointment-form");
  const formSuccessOverlay = document.getElementById("form-success-overlay");
  const successCloseBtn = document.getElementById("success-close-btn");

  if (appointmentForm) {
    appointmentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("appt-name").value.trim();
      const phone = document.getElementById("appt-phone").value.trim();
      const emailInput = document.getElementById("appt-email");
      const email = emailInput ? emailInput.value.trim() : "";
      const treatment = document.getElementById("appt-treatment").value;
      const message = document.getElementById("appt-message").value.trim();

      if (!name || !phone || !treatment) {
        alert("Please fill in all required fields.");
        return;
      }

      // Mobile check
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }

      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, treatment, message })
        });

        if (!response.ok) {
          throw new Error("Server response not OK");
        }
      } catch (err) {
        console.warn("Failed to submit appointment to server, displaying success mock modal.", err);
      }

      // Prepare WhatsApp and Standard SMS links
      const waNumber = "917893616535";
      const waText = `Hello Sai Surya Dental Clinic,%0A%0A` +
                     `I would like to book a dental appointment. Here are my details:%0A` +
                     `- *Name:* ${encodeURIComponent(name)}%0A` +
                     `- *Phone:* ${encodeURIComponent(phone)}%0A` +
                     `- *Email:* ${encodeURIComponent(email || "Not provided")}%0A` +
                     `- *Treatment:* ${encodeURIComponent(treatment)}%0A` +
                     `- *Message/Symptoms:* ${encodeURIComponent(message || "None")}%0A%0A` +
                     `Please confirm my slot. Thank you!`;
      
      const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

      const smsNumber = "+917893616535";
      const smsText = `Hello Sai Surya Dental Clinic,\n\n` +
                      `I would like to book a dental appointment. Here are my details:\n` +
                      `- Name: ${name}\n` +
                      `- Phone: ${phone}\n` +
                      `- Email: ${email || "Not provided"}\n` +
                      `- Treatment: ${treatment}\n` +
                      `- Message/Symptoms: ${message || "None"}\n\n` +
                      `Please confirm my slot. Thank you!`;
      
      const smsUrl = `sms:${smsNumber}?body=${encodeURIComponent(smsText)}`;

      // Update success modal buttons
      const waBtn = document.getElementById("success-wa-btn");
      const smsBtn = document.getElementById("success-sms-btn");
      if (waBtn) waBtn.href = waUrl;
      if (smsBtn) smsBtn.href = smsUrl;

      // Show success modal
      if (formSuccessOverlay) {
        formSuccessOverlay.classList.remove("hidden");
        formSuccessOverlay.classList.add("flex");
        document.body.style.overflow = "hidden";
      }
      appointmentForm.reset();
    });
  }

  if (successCloseBtn && formSuccessOverlay) {
    successCloseBtn.addEventListener("click", () => {
      formSuccessOverlay.classList.add("hidden");
      formSuccessOverlay.classList.remove("flex");
      document.body.style.overflow = "auto";
    });
  }
});
