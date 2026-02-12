// Theme toggle and UI interactions
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const initial = localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if(initial === 'dark') document.body.classList.add('dark');
  themeToggle && themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    const now = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('site-theme', now);
  });

  // Smooth scroll to sections
  document.querySelectorAll('[data-scroll]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-scroll');
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // Tool card navigation
  document.querySelectorAll('[data-href]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const href = el.getAttribute('data-href');
      if(href) window.location.href = href;
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal, .reveal-animate').forEach(el=>io.observe(el));

  // EmailJS form handling
  // Initialized with the provided EmailJS public key so the contact form can send directly.
  // To change or remove this later, replace the key below.
  try{
    if(window.emailjs){
      emailjs.init('1cx0_XtU9AgB7psEL'); // <-- your public key
    }
  }catch(e){
    console.warn('EmailJS init failed', e);
  }

  const contactForm = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      statusEl.textContent = 'Sending...';
      const serviceID = 'service_fmxln33';
      const templateID = 'template_dcg9xpl';
      // Use emailjs.sendForm for simple form binding
      if(window.emailjs && emailjs.sendForm){
        emailjs.sendForm(serviceID, templateID, this).then(function(){
          statusEl.textContent = 'Message sent — thank you!';
          statusEl.style.color = 'green';
          contactForm.reset();
        }, function(err){
          statusEl.textContent = 'Send failed. Try again later.';
          statusEl.style.color = 'crimson';
          console.error(err);
        });
      } else {
        // Fallback: open mailto if EmailJS not configured
        const formData = new FormData(contactForm);
        const subject = encodeURIComponent(formData.get('subject') || 'Contact');
        const body = encodeURIComponent('From: '+formData.get('from_name')+' ('+formData.get('from_email')+')\n\n'+(formData.get('message')||''));
        window.location.href = `mailto:rahulkota0101@gmail.com?subject=${subject}&body=${body}`;
        statusEl.textContent = 'Opening email client...';
      }
    });
  }
})();
