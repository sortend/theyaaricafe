/*=====================================================================
   script.js – Core UI interactions for the premium café website
   ---------------------------------------------------------------
   Handles:
     • Navbar scroll effect (all pages)
     • Gallery carousel with dot navigation & auto‑advance
     • Add‑to‑cart for ordering page
     • Status toggles for admin & delivery pages
     • Scroll‑indicator bounce (CSS‑only; JS just triggers class)
=====================================================================*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- 1️⃣  Navbar scroll effect (all pages) ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  }

  /* ---------- 2️⃣  Gallery carousel (home page) ---------- */
  const track = document.querySelector('.gallery-track');
  if (track) {
    const slides = Array.from(track.children);
    const dotsNav = document.querySelector('.gallery-dots');
    const dots = Array.from(dotsNav.children);

    // Position slides side‑by‑side
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, idx) => slide.style.left = `${slideWidth * idx}px`);

    // Initialize first slide & dot active
    slides[0].classList.add('current-slide');
    if (dots.length) dots[0].classList.add('active');

    // Helper: move slide
    const moveToSlide = (track, current, target) => {
      const targetPos = parseInt(target.style.left);
      track.style.transform = `translateX(-${targetPos}px)`;
      current.classList.remove('current-slide');
      target.classList.add('current-slide');
    };

    // Update dots
    const updateDots = (current, target) => {
      current.classList.remove('active');
      target.classList.add('active');
    };

    // Auto‑advance
    let interval = setInterval(() => {
      const cur = track.querySelector('.current-slide');
      const next = cur.nextElementSibling || slides[0];
      const curDot = dotsNav.querySelector('.active');
      const nextDot = curDot.nextElementSibling || dots[0];
      moveToSlide(track, cur, next);
      updateDots(curDot, nextDot);
    }, 5000);

    // Pause on hover
    const carousel = document.querySelector('.gallery-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(interval));
      carousel.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
          const c = track.querySelector('.current-slide');
          const n = c.nextElementSibling || slides[0];
          const cd = dotsNav.querySelector('.active');
          const nd = cd.nextElementSibling || dots[0];
          moveToSlide(track, c, n);
          updateDots(cd, nd);
        }, 5000);
      });
    }

    // Dot navigation
    if (dotsNav) {
      dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('.gallery-dot');
        if (!targetDot) return;
        const curSlide = track.querySelector('.current-slide');
        const curDot = dotsNav.querySelector('.active');
        const idx = dots.findIndex(d => d === targetDot);
        const targetSlide = slides[idx];
        moveToSlide(track, curSlide, targetSlide);
        updateDots(curDot, dots[idx]);
      });
    }
  }

  /* ---------- 3️⃣  Add‑to‑cart for ordering page ---------- */
  const addToCartBtns = document.querySelectorAll('.add-to-cart');
  const cartList = document.getElementById('cart-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');

  if (addToCartBtns.length && cartList) {
    let cart = []; // {item, price}

    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.dataset.item;
        const price = parseFloat(btn.dataset.price);
        // push or increment
        const exists = cart.find(c => c.item === item);
        if (exists) exists.qty++;
        else cart.push({item, price, qty: 1});

        renderCart();
      });
    });

    const renderCart = () => {
      if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty</p>';
      } else {
        cartList.innerHTML = cart.map(c =>
          `<div class="cart-item">
             <span>${c.item} × ${c.qty}</span>
             <span>$${(c.price * c.qty).toFixed(2)}</span>
           </div>`
        ).join('');
      }
      const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
      cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
      cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    };
  }

  /* ---------- 4️⃣  Status toggles for admin & delivery pages ---------- */
  const statusBtns = document.querySelectorAll('.status-btn');
  const statusSelects = document.querySelectorAll('.status-select');
  if (statusBtns.length) {
    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.id;
        const newStatus = btn.dataset.status;
        // Visual update
        btn.textContent = newStatus;
        // Here you would normally call an API – for this prototype
        // we just update the UI and could fetch/api later
        console.log(`Order ${orderId} status changed to ${newStatus}`);
      });
    });
  }

  // Sync select changes to button text (delivery page)
  if (statusSelects.length) {
    statusSelects.forEach(sel => {
      sel.addEventListener('change', e => {
        const btn = sel.closest('td').querySelector('.status-btn');
        if (btn) btn.textContent = e.target.value;
      });
    });
  }

  /* ---------- 5️⃣  Scroll‑indicator bounce (CSS driven) ---------- */
  // The bounce animation is defined in style.css; no extra JS needed.
  // If you want a JS‑driven bounce, uncomment:
  /*
  const splash = document.querySelector('.scroll-indicator');
  if (splash) {
    let pos = 0;
    setInterval(() => {
      pos = (pos + 6) % 30;
      splash.style.transform = `translateY(${pos}px)`;
    }, 500);
  }
  */
});