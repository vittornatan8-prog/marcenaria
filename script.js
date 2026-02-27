
    // =========================
    // NAV: smooth scroll
    // =========================
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener("click", (e)=>{
        const id = a.getAttribute("href");
        if(!id || id === "#") return;
        const el = document.querySelector(id);
        if(!el) return;

        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // =========================
    // HEADER shrink on scroll
    // =========================
    const header = document.querySelector(".header");
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 14);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // =========================
    // MOBILE drawer
    // =========================
    const burger = document.getElementById("burger");
    const drawer = document.getElementById("drawer");

    function openDrawer(){
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer(){
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", ()=>{
      drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });
    drawer.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeDrawer));
    drawer.querySelectorAll("[data-link]").forEach(el => el.addEventListener("click", closeDrawer));
    window.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeDrawer(); });

    // =========================
    // REVEAL on scroll
    // =========================
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting) ent.target.classList.add("in");
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    // =========================
    // FORM (demo) + mask simples
    // =========================
    const form = document.getElementById("form");
    const toast = document.getElementById("toast");

    const tel = document.getElementById("telefone");
    tel.addEventListener("input", ()=>{
      let v = tel.value.replace(/\D/g,"").slice(0,11);
      // (00) 00000-0000
      if(v.length >= 2) v = "(" + v.slice(0,2) + ") " + v.slice(2);
      if(v.length >= 10) v = v.slice(0,10) + "-" + v.slice(10);
      tel.value = v;
    });

    form.addEventListener("submit", (e)=>{
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      const ok = data.nome && data.telefone && data.email && data.mensagem;

      toast.classList.remove("show");
      if(!ok){
        toast.textContent = "Por favor, preencha todos os campos antes de enviar.";
        toast.classList.add("show");
        return;
      }

      // Aqui você integra com backend/WhatsApp/email.
      toast.textContent = "Mensagem pronta! Integre com seu WhatsApp, e-mail ou backend para receber os pedidos.";
      toast.classList.add("show");
      form.reset();
    });

    // =========================
    // YEAR
    // =========================
    document.getElementById("year").textContent = new Date().getFullYear();

    // =========================
    // LIGHTBOX simples (portfolio)
    // =========================
    const lb = document.getElementById("lightbox");
    const lbTitle = document.getElementById("lbTitle");
    const lbImage = document.getElementById("lbImage");

    function openLB(title, bg){
      lbTitle.textContent = title || "Ambiente";
      lbImage.style.backgroundImage = bg;
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    }
    function closeLB(){
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden","true");
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".tile").forEach(tile=>{
      tile.addEventListener("click", ()=>{
        const title = tile.getAttribute("data-lightbox") || "Ambiente";
        const bg = tile.style.backgroundImage;
        openLB(title, bg);
      });
    });

    lb.querySelectorAll("[data-lb-close]").forEach(el=>el.addEventListener("click", closeLB));
    window.addEventListener("keydown",(e)=>{ if(e.key === "Escape") closeLB(); });
  