/* ============================================================
   NexTalent AI — main.js 
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════
     1. TOAST NOTIFICATION (ใช้ซ้ำได้ทุกจุด)
     ══════════════════════════════════════════════════════════ */
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  /* ══════════════════════════════════════════════════════════
     2. NAVBAR — scroll shadow + hamburger menu
     ══════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // ปิดเมนูเมื่อคลิกลิงก์ (มือถือ)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
    // ปิดเมนูเมื่อคลิกนอกเมนู
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     3. SCROLL PROGRESS BAR
     ══════════════════════════════════════════════════════════ */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();

  /* ══════════════════════════════════════════════════════════
     4. BACK TO TOP BUTTON
     ══════════════════════════════════════════════════════════ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. ACTIVE NAV LINK HIGHLIGHTING ตามส่วนที่กำลังดู
     ══════════════════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(sec => navObserver.observe(sec));
  }

  /* ══════════════════════════════════════════════════════════
     6. SCROLL REVEAL (ไล่ตามลำดับ - staggered)
     ══════════════════════════════════════════════════════════ */
  const revealParents = new Set();
  document.querySelectorAll('.reveal').forEach(el => revealParents.add(el.parentElement));
  revealParents.forEach(parent => {
    const children = Array.from(parent.querySelectorAll(':scope > .reveal'));
    children.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════════════════════════════
     7. COUNT-UP ตัวเลข hero (.stat-num[data-target])
     ══════════════════════════════════════════════════════════ */
  function countUp(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + '+';
    }, 25);
  }
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target, parseInt(entry.target.dataset.target, 10));
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  /* ══════════════════════════════════════════════════════════
     8. 3D TILT EFFECT (job-card, tier-card, course-card)
     ══════════════════════════════════════════════════════════ */
  const tiltCards = document.querySelectorAll('.job-card, .tier-card, .course-card');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouchDevice) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

    /* 9. JOBS FILTER */
  const jobFilterBtns = document.querySelectorAll('.jobs-filter .filter-btn');
  const jobCards = document.querySelectorAll('.job-card');

  jobFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      jobFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      jobCards.forEach(card => {
        const show =
          filter === 'all' ||
          card.dataset.category === filter;

        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* 9.5 COURSES FILTER (หน้า courses.html) */
  const courseFilterBtns = document.querySelectorAll('.courses-filter .filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  courseFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      courseFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      courseCards.forEach(card => {
        const show =
          filter === 'all' ||
          card.dataset.level === filter;

        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ══════════════════════════════════════════════════════════
     10. JOB DETAIL MODAL
     ══════════════════════════════════════════════════════════ */
  const jobData = {
    job1: {
      title: 'AI-Assisted Web Developer',
      company: 'NexGen Innovations Co., Ltd.',
      logoClass: 'logo-ni',
      logoText: 'NI',
      location: 'บางนา, กรุงเทพฯ (ใกล้รถไฟฟ้า)',
      salary: '40,000 – 70,000 บาท/เดือน',
      skills: ['HTML5/CSS3', 'JavaScript', 'GitHub Copilot', 'Tailwind CSS'],
      desc: 'พัฒนา Frontend ด้วย HTML5, CSS3, JavaScript พร้อมใช้ AI Coding Tools เพิ่มประสิทธิภาพ สร้าง Responsive UI ระดับมืออาชีพ ทำงานร่วมกับทีมออกแบบและ Backend เพื่อส่งมอบผลิตภัณฑ์ที่มีคุณภาพ',
      requirements: [
        'มีประสบการณ์เขียน HTML, CSS, JavaScript อย่างน้อย 1 ปี',
        'เคยใช้ AI Coding Tools เช่น GitHub Copilot หรือ Claude Code',
        'เข้าใจหลักการ Responsive Design และ Cross-browser Compatibility',
        'สามารถทำงานร่วมกับทีมและสื่อสารได้ดี'
      ],
      benefits: [
        'ประกันสังคม และประกันสุขภาพกลุ่ม',
        'ทำงานแบบ Hybrid (WFH ได้บางวัน)',
        'งบพัฒนาทักษะ/คอร์สเรียนรายปี',
        'โบนัสตามผลงาน'
      ]
    },
    job2: {
      title: 'Digital & AI Transformation Associate',
      company: 'Siam Smart Solution Co., Ltd.',
      logoClass: 'logo-ss',
      logoText: 'SS',
      location: 'สาทร, กรุงเทพฯ',
      salary: '30,000 – 50,000 บาท/เดือน',
      skills: ['Zapier / Make', 'Power BI', 'Generative AI', 'PDPA'],
      desc: 'วิเคราะห์ Workflow และนำ No-Code/Low-Code AI Automation มาปรับกระบวนการธุรกิจให้มีประสิทธิภาพสูงสุด ประสานงานกับหลายแผนกเพื่อออกแบบระบบอัตโนมัติที่ตอบโจทย์',
      requirements: [
        'จบปริญญาตรีสาขาที่เกี่ยวข้อง หรือมีประสบการณ์เทียบเท่า',
        'เคยใช้เครื่องมือ Automation เช่น Zapier, Make หรือ Power Automate',
        'เข้าใจหลักการ PDPA และการจัดการข้อมูลส่วนบุคคล',
        'มีทักษะวิเคราะห์ปัญหาและนำเสนอ Solution'
      ],
      benefits: [
        'ประกันสังคม และประกันอุบัติเหตุกลุ่ม',
        'โบนัสประจำปีตามผลประกอบการ',
        'อบรม AI Automation ฟรีตลอดปี',
        'วันลาพักร้อน 12 วัน/ปี'
      ]
    },
    job3: {
      title: 'AI Data Analyst & Insight Specialist',
      company: 'DataPulse Analytics Co., Ltd.',
      logoClass: 'logo-dp',
      logoText: 'DP',
      location: 'อโศก, กรุงเทพฯ (BTS อโศก)',
      salary: '45,000 – 80,000 บาท/เดือน',
      skills: ['Python', 'Tableau', 'SQL', 'Machine Learning'],
      desc: 'วิเคราะห์ข้อมูลขนาดใหญ่ด้วย AI Models สร้าง Dashboard และนำเสนอ Insight เชิงธุรกิจแก่ผู้บริหาร ทำงานใกล้ชิดกับทีม Data Engineering และฝ่ายธุรกิจ',
      requirements: [
        'มีประสบการณ์ Python และ SQL อย่างน้อย 2 ปี',
        'เคยสร้าง Dashboard ด้วย Tableau หรือ Power BI',
        'เข้าใจพื้นฐาน Machine Learning และ Statistics',
        'สามารถนำเสนอผลวิเคราะห์ให้ผู้บริหารเข้าใจง่าย'
      ],
      benefits: [
        'ประกันสุขภาพเหมาจ่ายวงเงินสูง',
        'โบนัส 2 รอบ/ปี ตามผลงาน',
        'งบซื้ออุปกรณ์ทำงาน (Laptop/Monitor)',
        'ทำงาน 4.5 วัน/สัปดาห์'
      ]
    }
  };

  const jobModalOverlay = document.getElementById('jobModalOverlay');
  const jobModalLogo = document.getElementById('jobModalLogo');
  const jobModalTitle = document.getElementById('jobModalTitle');
  const jobModalCompany = document.getElementById('jobModalCompany');
  const jobModalTags = document.getElementById('jobModalTags');
  const jobModalLocation = document.getElementById('jobModalLocation');
  const jobModalSalary = document.getElementById('jobModalSalary');
  const jobModalDesc = document.getElementById('jobModalDesc');
  const jobModalRequirements = document.getElementById('jobModalRequirements');
  const jobModalBenefits = document.getElementById('jobModalBenefits');

  function openJobModal(jobId) {
    const data = jobData[jobId];
    if (!data || !jobModalOverlay) return;

    jobModalLogo.textContent = data.logoText;
    jobModalLogo.className = 'company-logo ' + data.logoClass;
    jobModalTitle.textContent = data.title;
    jobModalCompany.textContent = data.company;
    jobModalLocation.textContent = data.location;
    jobModalSalary.textContent = data.salary;
    jobModalDesc.textContent = data.desc;

    jobModalTags.innerHTML = data.skills
      .map(s => `<span class="skill-tag">${s}</span>`).join('');
    jobModalRequirements.innerHTML = data.requirements
      .map(r => `<li>${r}</li>`).join('');
    jobModalBenefits.innerHTML = data.benefits
      .map(b => `<li>${b}</li>`).join('');

    jobModalOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeJobModal() {
    jobModalOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.job-title-btn').forEach(btn => {
    btn.addEventListener('click', () => openJobModal(btn.dataset.job));
  });

  const jobModalClose = document.getElementById('jobModalClose');
  const jobModalCloseBtn = document.getElementById('jobModalCloseBtn');
  if (jobModalClose) jobModalClose.addEventListener('click', closeJobModal);
  if (jobModalCloseBtn) jobModalCloseBtn.addEventListener('click', closeJobModal);
  if (jobModalOverlay) {
    jobModalOverlay.addEventListener('click', (e) => {
      if (e.target === jobModalOverlay) closeJobModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && jobModalOverlay && jobModalOverlay.classList.contains('open')) {
      closeJobModal();
    }
  });

  /* ══════════════════════════════════════════════════════════
     11. COPY TO CLIPBOARD (เบอร์โทร / อีเมล ใน footer)
     ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.contact-copy').forEach(item => {
    item.addEventListener('click', async () => {
      const text = item.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast('คัดลอก "' + text + '" แล้ว ✓');
      } catch (err) {
        showToast('คัดลอกไม่สำเร็จ ลองใหม่อีกครั้ง');
      }
    });
  });

/* ══════════════════════════════════════════════════════════
     12. AI SKILL ASSESSMENT (เวอร์ชันปรับปรุง — 9 ข้อ)
     ══════════════════════════════════════════════════════════ */

  const assessmentQuestions = [
    {
      type: 'self',
      question: 'คุณมีประสบการณ์ใช้ AI มากน้อยแค่ไหน?',
      options: [
        { text: 'ยังไม่เคยใช้', score: 1 },
        { text: 'เคยใช้บ้าง', score: 2 },
        { text: 'ใช้เป็นประจำในงาน/การเรียน', score: 3 }
      ]
    },
    {
      type: 'scenario',
      question: 'ถ้า AI ช่วยเขียนโค้ดให้ แต่โค้ดนั้นรันแล้ว Error คุณจะทำอย่างไร?',
      options: [
        { text: 'ก็อปวางใหม่ให้ AI เขียนซ้ำ ๆ จนกว่าจะไม่ Error', score: 1 },
        { text: 'ลองรันดูก่อน แล้วค่อยถาม AI ว่า Error เพราะอะไร', score: 2 },
        { text: 'อ่านโค้ดเข้าใจ Logic ก่อน แล้ววิเคราะห์หาสาเหตุด้วยตัวเองควบคู่ไปกับ AI', score: 3 }
      ]
    },
    {
      type: 'scenario',
      question: 'AI สร้างเนื้อหา (Content) ให้แต่โทนไม่ตรงกับที่ต้องการ คุณจะแก้ปัญหาอย่างไร?',
      options: [
        { text: 'ใช้ตามที่ได้มาเลย ไม่แก้ไขอะไร', score: 1 },
        { text: 'สั่งให้ AI เขียนใหม่ไปเรื่อย ๆ จนกว่าจะได้ที่ถูกใจ', score: 2 },
        { text: 'ปรับ Prompt ให้ชัดเจนขึ้น เช่น กำหนด Role, Tone และยกตัวอย่างประกอบ (Few-shot)', score: 3 }
      ]
    },
    {
      type: 'knowledge',
      question: '[ความรู้พื้นฐาน] Prompt แบบ "Few-shot" คืออะไร?',
      options: [
        { text: 'การถามคำถามสั้น ๆ กับ AI', score: 1 },
        { text: 'การให้ตัวอย่างคำตอบไว้ใน Prompt เพื่อชี้แนวทางให้ AI ตอบตามรูปแบบนั้น', score: 3 },
        { text: 'การใช้ AI เพียงครั้งเดียวแล้วเลิกใช้', score: 1 },
        { text: 'การฝึกโมเดล AI ขึ้นมาใหม่ทั้งหมด', score: 2 }
      ]
    },
    {
      type: 'knowledge',
      question: '[ความรู้พื้นฐาน] PDPA เกี่ยวข้องกับการใช้ AI อย่างไร?',
      options: [
        { text: 'เป็นกฎหมายด้านลิขสิทธิ์ซอฟต์แวร์', score: 1 },
        { text: 'ควบคุมการเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลที่ป้อนให้ AI', score: 3 },
        { text: 'เป็นภาษีสำหรับธุรกิจที่ใช้ AI', score: 1 },
        { text: 'ไม่มีความเกี่ยวข้องกับ AI', score: 1 }
      ]
    },
    {
      type: 'knowledge',
      question: '[ความรู้พื้นฐาน] RAG (Retrieval-Augmented Generation) ใช้ทำอะไร?',
      options: [
        { text: 'เพิ่มความเร็วในการประมวลผลภาพ', score: 1 },
        { text: 'เทคนิคบีบอัดขนาดไฟล์โมเดล', score: 1 },
        { text: 'ให้ AI ดึงข้อมูลจากแหล่งภายนอก (เช่น เอกสารองค์กร) มาใช้ตอบคำถามให้แม่นยำขึ้น', score: 3 },
        { text: 'วิธีฝึกโมเดลตั้งแต่เริ่มต้นจากศูนย์', score: 2 }
      ]
    },
    {
      type: 'self',
      question: 'คุณเคยใช้เครื่องมือ Automation (เช่น Zapier, Make, Power Automate) เชื่อมต่อระบบต่าง ๆ ไหม?',
      options: [
        { text: 'ยังไม่เคย', score: 1 },
        { text: 'เคยลองทำ Workflow ง่าย ๆ', score: 2 },
        { text: 'ออกแบบ Workflow ที่ซับซ้อนและใช้งานจริงในองค์กร', score: 3 }
      ]
    },
    {
      type: 'scenario',
      question: 'ผู้บริหารขอให้คุณทำ Dashboard วิเคราะห์ข้อมูลลูกค้าด้วย AI คุณจะเริ่มต้นอย่างไร?',
      options: [
        { text: 'ยังไม่แน่ใจว่าจะเริ่มตรงไหนดี', score: 1 },
        { text: 'ใช้เครื่องมือสำเร็จรูปสร้างกราฟพื้นฐานจากข้อมูลที่มี', score: 2 },
        { text: 'วางแผน Data Pipeline เลือกโมเดลที่เหมาะสม และออกแบบ Insight ให้ตอบโจทย์ธุรกิจ', score: 3 }
      ]
    },
    {
      type: 'scenario',
      question: 'องค์กรต้องการนำ AI Agent มาใช้ในกระบวนการทำงาน คุณจะเริ่มต้นอย่างไร?',
      options: [
        { text: 'รอให้ทีมอื่นเป็นคนดำเนินการ', score: 1 },
        { text: 'ลองใช้เครื่องมือสำเร็จรูปที่มีอยู่แล้วดูก่อน', score: 2 },
        { text: 'ออกแบบ Scope, ความเสี่ยง และ Guardrail ของระบบก่อนเริ่มพัฒนา', score: 3 }
      ]
    }
  ];

  const assessmentOverlay =
    document.getElementById('assessmentOverlay');

  const assessmentQuestion =
    document.getElementById('assessmentQuestion');

  const assessmentOptions =
    document.getElementById('assessmentOptions');

  const assessmentProgress =
    document.getElementById('assessmentProgress');

  const nextQuestion =
    document.getElementById('nextQuestion');

  const startAssessment =
    document.getElementById('startAssessment');

  const assessmentClose =
    document.getElementById('assessmentClose');

  let currentQuestion = 0;
  let totalScore = 0;
  let selectedScore = null;
  let knowledgeWrongCount = 0; // นับจำนวนข้อความรู้พื้นฐานที่ตอบผิด (score ต่ำสุดของข้อนั้น)

  function showAssessmentQuestion() {

    const question = assessmentQuestions[currentQuestion];

    if (!question) return;

    assessmentQuestion.textContent = question.question;

    assessmentOptions.innerHTML = question.options
      .map(option => `
        <button
          type="button"
          class="assessment-option"
          data-score="${option.score}">
          ${option.text}
        </button>
      `)
      .join('');

    assessmentProgress.textContent =
      `คำถาม ${currentQuestion + 1} / ${assessmentQuestions.length}`;

    selectedScore = null;

    document
      .querySelectorAll('.assessment-option')
      .forEach(option => {

        option.addEventListener('click', () => {

          document
            .querySelectorAll('.assessment-option')
            .forEach(item => {
              item.classList.remove('selected');
            });

          option.classList.add('selected');

          selectedScore =
            Number(option.dataset.score);
        });

      });
  }

  /* เปิดแบบประเมิน */
  if (startAssessment) {

    startAssessment.addEventListener('click', () => {

      currentQuestion = 0;
      totalScore = 0;
      selectedScore = null;
      knowledgeWrongCount = 0;

      nextQuestion.style.display = 'inline-flex';

      assessmentOverlay.classList.add('open');

      document.body.classList.add('modal-open');

      showAssessmentQuestion();

    });

  }

  /* ปุ่มถัดไป */
  if (nextQuestion) {

    nextQuestion.addEventListener('click', () => {

      if (selectedScore === null) {

        showToast('กรุณาเลือกคำตอบก่อนค่ะ');

        return;
      }

      const currentQ = assessmentQuestions[currentQuestion];

      totalScore += selectedScore;

      // นับข้อความรู้พื้นฐานที่ตอบผิด (เลือกตัวเลือกที่ไม่ใช่คะแนนสูงสุดของข้อนั้น)
      if (currentQ.type === 'knowledge') {
        const maxScoreInQuestion = Math.max(
          ...currentQ.options.map(o => o.score)
        );
        if (selectedScore < maxScoreInQuestion) {
          knowledgeWrongCount++;
        }
      }

      if (
        currentQuestion <
        assessmentQuestions.length - 1
      ) {

        currentQuestion++;

        showAssessmentQuestion();

      } else {

        let level;
        let description;
        let recommendation;

        /*
          คะแนนเต็ม 27 (9 ข้อ x คะแนนสูงสุด 3)
          คะแนนต่ำสุด 9

          9–14   = Beginner
          15–21  = Pioneer
          22–27  = Innovator

          เงื่อนไขเพดาน (Knowledge Gate):
          - ตอบคำถามความรู้พื้นฐานผิด 2 ข้อขึ้นไป (จาก 3 ข้อ)
            → ต่อให้คะแนนรวมสูง ก็จะไม่ได้ Innovator (เพดานอยู่ที่ Pioneer)
          - ตอบผิดทั้ง 3 ข้อ → เพดานอยู่ที่ Beginner
        */

        let rawLevel;
        if (totalScore <= 14) {
          rawLevel = 'BEGINNER';
        } else if (totalScore <= 21) {
          rawLevel = 'PIONEER';
        } else {
          rawLevel = 'INNOVATOR';
        }

        // ใช้ Knowledge Gate จำกัดเพดาน Tier
        if (knowledgeWrongCount >= 3) {
          level = 'BEGINNER';
        } else if (knowledgeWrongCount >= 2 && rawLevel === 'INNOVATOR') {
          level = 'PIONEER';
        } else {
          level = rawLevel;
        }

        if (level === 'BEGINNER') {
          description =
            'คุณกำลังเริ่มต้นเรียนรู้และใช้งาน AI ยังต้องเสริมพื้นฐานอีกนิด';
          recommendation =
            'แนะนำให้เริ่มจากหลักสูตรพื้นฐานด้าน Generative AI & Prompt Engineering';
        } else if (level === 'PIONEER') {
          description =
            'คุณสามารถนำ AI มาประยุกต์ใช้กับงานได้ และเข้าใจหลักการเบื้องต้นดี';
          recommendation =
            'แนะนำหลักสูตรด้าน AI Automation และ Generative AI ขั้นสูง';
        } else {
          description =
            'คุณสามารถนำ AI มาสร้างและออกแบบ Solution ระดับองค์กรได้';
          recommendation =
            'แนะนำหลักสูตรด้าน AI System Design, MLOps และ AI Agents ขั้นสูง';
        }

        assessmentQuestion.textContent =
          '🎉 ผลการประเมินของคุณ';

        const knowledgeNote =
          knowledgeWrongCount >= 2
            ? `<p style="margin-top:10px; font-size:0.82rem; color:#f87171;">
                 * ตอบคำถามความรู้พื้นฐานผิด ${knowledgeWrongCount}/3 ข้อ
                 ระบบจึงปรับเพดานระดับลงเพื่อความแม่นยำ
               </p>`
            : '';

        assessmentOptions.innerHTML = `
          <div class="assessment-result-card">

            <div class="result-icon">
              🧠
            </div>

            <div class="result-level">
              ${level}
            </div>

            <p>
              ${description}
            </p>

            ${knowledgeNote}

            <div class="result-recommendation">
              <strong>หลักสูตรที่แนะนำ</strong>
              <p>${recommendation}</p>
            </div>

          </div>
        `;

        assessmentProgress.textContent =
          'ประเมินเสร็จแล้ว';

        nextQuestion.style.display = 'none';

      }

    });

  }

  /* ปิด Modal */
  if (assessmentClose) {

    assessmentClose.addEventListener('click', () => {

      assessmentOverlay.classList.remove('open');

      document.body.classList.remove('modal-open');

    });

  }

  /* คลิกพื้นหลังเพื่อปิด */
  if (assessmentOverlay) {

    assessmentOverlay.addEventListener('click', (e) => {

      if (e.target === assessmentOverlay) {

        assessmentOverlay.classList.remove('open');

        document.body.classList.remove('modal-open');

      }

    });

  }

  /* กด ESC เพื่อปิด */
  document.addEventListener('keydown', (e) => {

    if (
      e.key === 'Escape' &&
      assessmentOverlay &&
      assessmentOverlay.classList.contains('open')
    ) {

      assessmentOverlay.classList.remove('open');

      document.body.classList.remove('modal-open');

    }

  });

});

/* ══════════════════════════════════════════════════════════
   13. PAGE LOADER
   ══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('loader-hidden');
    }, 400);
  }
});

/* ══════════════════════════════════════════════════════════
   14. CUSTOM CURSOR (ลูกศรสไตล์เกม)
   ══════════════════════════════════════════════════════════ */
(function () {
  const customCursor = document.getElementById('customCursor');

  const isTouch =
    window.matchMedia('(pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0 ||
    'ontouchstart' in window;

  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!customCursor || isTouch || reducedMotion) {
    if (customCursor) {
      customCursor.style.display = 'none';
    }
    return;
  }

  document.body.classList.add('custom-cursor-active');

  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
  });

  const hoverTargets = 'a, button, .job-card, .tier-card, .course-card, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      customCursor.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      customCursor.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mouseleave', () => {
    customCursor.classList.add('cursor-hidden');
  });
  document.addEventListener('mouseenter', () => {
    customCursor.classList.remove('cursor-hidden');
  });
})();

/* ══════════════════════════════════════════════════════════
   15. HERO STARFIELD
   ══════════════════════════════════════════════════════════ */
(function () {
  const heroStars = document.getElementById('heroStars');
  if (!heroStars) return;

  const STAR_COUNT = 50;
  const colors = ['#ffffff', '#c4b5fd', '#67e8f9'];

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 2 + 1; // 1px - 3px
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 4 + 3; // 3s - 7s
    const delay = Math.random() * 5;
    const maxOpacity = (Math.random() * 0.5 + 0.4).toFixed(2); // 0.4 - 0.9
    const color = colors[Math.floor(Math.random() * colors.length)];

    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.top = top + '%';
    star.style.left = left + '%';
    star.style.background = color;
    star.style.setProperty('--star-max-opacity', maxOpacity);
    star.style.animationDuration = duration + 's';
    star.style.animationDelay = delay + 's';

    heroStars.appendChild(star);
  }
})();
