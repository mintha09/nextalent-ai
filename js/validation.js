/* ============================================================
   NexTalent AI — Form Validation (index.html)
   ============================================================ */

(function () {
  const form        = document.getElementById('registerForm');
  const successBox  = document.getElementById('formSuccess');
  if (!form) return;

  // Helper: show/clear error
  function showError(id, msg) {
    const el = document.getElementById('err-' + id);
    if (el) el.textContent = msg;
  }
  function clearError(id) {
    const el = document.getElementById('err-' + id);
    if (el) el.textContent = '';
  }
  function markError(field) {
    field.classList.add('error');
    field.addEventListener('input', () => {
      field.classList.remove('error');
      clearError(field.name || field.id);
    }, { once: true });
  }

  // Validate phone: Thai format 0xx-xxx-xxxx or 10 digits
  function isValidPhone(val) {
    return /^(0\d{1,2}-?\d{3,4}-?\d{4}|0\d{9})$/.test(val.trim());
  }

  // Validate email
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Prefix
    const prefix = form.prefix;
    if (!prefix.value) {
      showError('prefix', 'กรุณาเลือกคำนำหน้า');
      markError(prefix);
      valid = false;
    } else { clearError('prefix'); }

    // Fullname
    const fullname = form.fullname;
    if (!fullname.value.trim()) {
      showError('fullname', 'กรุณากรอกชื่อ-นามสกุล');
      markError(fullname);
      valid = false;
    } else { clearError('fullname'); }

    // Phone
    const phone = form.phone;
    if (!phone.value.trim()) {
      showError('phone', 'กรุณากรอกเบอร์โทรศัพท์');
      markError(phone);
      valid = false;
    } else if (!isValidPhone(phone.value)) {
      showError('phone', 'รูปแบบเบอร์โทรไม่ถูกต้อง (เช่น 081-234-5678)');
      markError(phone);
      valid = false;
    } else { clearError('phone'); }

    // Email
    const email = form.email;
    if (!email.value.trim()) {
      showError('email', 'กรุณากรอกอีเมล');
      markError(email);
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showError('email', 'รูปแบบอีเมลไม่ถูกต้อง');
      markError(email);
      valid = false;
    } else { clearError('email'); }

    // Education
    const education = form.education;
    if (!education.value) {
      showError('education', 'กรุณาเลือกระดับการศึกษา');
      markError(education);
      valid = false;
    } else { clearError('education'); }

    // Position
    const position = form.position;
    if (!position.value) {
      showError('position', 'กรุณาเลือกตำแหน่งที่ต้องการสมัคร');
      markError(position);
      valid = false;
    } else { clearError('position'); }

    // Tier (radio)
    const tierSelected = form.querySelector('input[name="tier"]:checked');
    if (!tierSelected) {
      showError('tier', 'กรุณาเลือกระดับสมรรถนะ AI');
      valid = false;
    } else { clearError('tier'); }

    // PDPA checkbox
    const pdpa = form.pdpa;
    if (!pdpa.checked) {
      showError('pdpa', 'กรุณายินยอมนโยบายความเป็นส่วนตัว (PDPA) ก่อนส่งข้อมูล');
      valid = false;
    } else { clearError('pdpa'); }

    if (!valid) return;

    // Success
    form.style.display = 'none';
    successBox.style.display = 'block';

    // Scroll to success message
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
