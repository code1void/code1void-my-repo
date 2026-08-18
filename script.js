// Smooth nav scrolling + reveal-on-scroll + simple parallax for blobs
document.addEventListener('DOMContentLoaded', () => {
  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('show');
    });
  }, {threshold:0.12});
  reveals.forEach(r=>obs.observe(r));

  // blob parallax / mouse follow
  const blobs = document.querySelectorAll('.blob');
  const hero = document.querySelector('.hero');
  let rx = 0, ry = 0;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    rx = dx;
    ry = dy;
    blobs.forEach((b, i) => {
      const depth = (i+1) * 6;
      const tx = rx * depth;
      const ty = ry * depth;
      b.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });

  // gentle autonomous drift (subtle)
  const drift = () => {
    blobs.forEach((b, i)=>{
      const s = (i+1) * 0.002;
      const t = Date.now() * s;
      const x = Math.sin(t*0.7) * (10 + i*6);
      const y = Math.cos(t*0.6) * (10 + i*4);
      const prev = b.style.transform.replace(/translate3d\(|\)/g,'') || '0px, 0px, 0px';
      // combine mouse transform with drift by appending translate
      b.style.transform = `${b.style.transform} translate3d(${x}px, ${y}px, 0)`;
    });
    requestAnimationFrame(drift);
  };
  requestAnimationFrame(drift);
});
