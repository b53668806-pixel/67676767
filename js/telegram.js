/**
 * ============================================================================
 * TELEGRAM BOT API INTEGRATION FOR ONLINE BOOKING FORM
 * CyberPulse Arena Kiber-sport Klubi
 * O'zbek tilida / Uzbek Language Localization
 * Zero Emojis / Pure Vector SVGs & Clean Cyber Formatting
 * ============================================================================
 */

// Telegram Bot API konfiguratsiyasi
const TG_CONFIG = {
  TOKEN: "8771643816:AAG0wsfs0tmM6iWLBcBqrVhQY7VCFth1C7o",
  CHAT_ID: "1895361408"
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initDateConstraints();
  initPhoneMask();
});

/**
 * Sana tanlash cheklovi: o'tib ketgan sanani tanlab bo'lmaydi
 */
function initDateConstraints() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;
  
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  if (!dateInput.value) {
    dateInput.value = today;
  }
}

/**
 * O'zbekiston telefon raqamlari uchun qulay maska (+998)
 */
function initPhoneMask() {
  const phoneInput = document.getElementById('bookingPhone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('998')) {
      value = value.slice(3);
    }

    let formatted = '+998 ';
    if (value.length > 0) formatted += '(' + value.substring(0, 2);
    if (value.length >= 2) formatted += ') ' + value.substring(2, 5);
    if (value.length >= 5) formatted += '-' + value.substring(5, 7);
    if (value.length >= 7) formatted += '-' + value.substring(7, 9);

    e.target.value = value.length === 0 ? '' : formatted;
  });
}

/**
 * Joyni band qilish formasini yuborish va tekshirish
 */
function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Maydonlarni yig'ish
    const nameInput = document.getElementById('bookingName');
    const phoneInput = document.getElementById('bookingPhone');
    const nickInput = document.getElementById('bookingNick');
    const zoneInput = bookingForm.querySelector('input[name="bookingZone"]:checked');
    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');
    const durationInput = document.getElementById('bookingDuration');
    const commentInput = document.getElementById('bookingComment');
    const submitBtn = document.getElementById('bookingSubmitBtn');

    clearValidationErrors(bookingForm);

    // 2. Maydonlarni tekshirish (Validatsiya)
    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'Ismingizni kiriting (kamida 2 ta belgi)');
      isValid = false;
    }

    const cleanPhone = phoneInput.value.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 12) {
      setFieldError(phoneInput, 'Telefon raqamini to\'liq kiriting (+998 XX XXX-XX-XX)');
      isValid = false;
    }

    if (!nickInput.value.trim()) {
      setFieldError(nickInput, 'O\'yin nikneymingizni kiriting');
      isValid = false;
    }

    if (!zoneInput) {
      const zoneContainer = document.querySelector('.zone-selector-grid');
      if (zoneContainer) {
        showToast('Diqqat', 'Iltimos, o\'yin zonasini tanlang', 'error');
      }
      isValid = false;
    }

    if (!dateInput.value) {
      setFieldError(dateInput, 'Tashrif sanasini tanlang');
      isValid = false;
    }

    if (!timeInput.value) {
      setFieldError(timeInput, 'Boshlanish vaqtini belgilang');
      isValid = false;
    }

    if (!isValid) {
      showToast('Tekshiruv xatosi', 'Iltimos, barcha majburiy maydonlarni to\'g\'ri to\'ldiring', 'error');
      return;
    }

    // 3. Tanlangan zonaning to'liq nomi
    const zoneLabels = {
      standard: 'Standard Zone (RTX 4070 / 280Hz)',
      vip: 'VIP Pro Zone (RTX 4080 Super / 360Hz)',
      bootcamp: 'BootCamp Team Room 5v5 (RTX 4090 / 360Hz)',
      console: 'PS5 Lounge (OLED 65" 120Hz)'
    };
    const selectedZoneText = zoneLabels[zoneInput.value] || zoneInput.value;

    // 4. Telegram xabari matni (O'zbek tilida)
    const telegramMessage = `
[YANGI JOY BAND QILISH BUYURTMASI]
━━━━━━━━━━━━━━━━━━━━
Mijoz ismi: ${escapeHtml(nameInput.value.trim())}
Telefon: ${escapeHtml(phoneInput.value.trim())}
Nikneym: ${escapeHtml(nickInput.value.trim())}
O'yin zonasi: ${escapeHtml(selectedZoneText)}
Sana: ${escapeHtml(dateInput.value)}
Boshlanish vaqti: ${escapeHtml(timeInput.value)}
Tarif / Paket: ${escapeHtml(durationInput.options[durationInput.selectedIndex].text)}
Izoh: ${commentInput.value.trim() ? escapeHtml(commentInput.value.trim()) : 'Izohsiz'}
━━━━━━━━━━━━━━━━━━━━
Yuborilgan vaqt: ${new Date().toLocaleString('uz-UZ')}
    `.trim();

    // 5. Tugmada yuklanish holati (Spinner)
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Yuborilmoqda...</span>
    `;

    try {
      // 6. Telegram Bot API ga so'rov
      const url = `https://api.telegram.org/bot${TG_CONFIG.TOKEN}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TG_CONFIG.CHAT_ID,
          text: telegramMessage
        })
      });

      const data = await response.json();

      if (data.ok) {
        fillModalDetails({
          name: nameInput.value.trim(),
          nick: nickInput.value.trim(),
          zone: selectedZoneText,
          date: dateInput.value,
          time: timeInput.value,
          duration: durationInput.options[durationInput.selectedIndex].text
        });

        if (typeof openModal === 'function') {
          openModal('bookingSuccessModal');
        }
        
        showToast('Joy band qilindi', 'Klub ma\'muri tasdiqlash uchun tez orada siz bilan bog\'lanadi.', 'success');
        bookingForm.reset();
        initDateConstraints();
      } else {
        console.error('Telegram API Error:', data);
        showToast('Xatolik yuz berdi', data.description || 'Telegramga buyurtmani yuborib bo\'lmadi', 'error');
      }
    } catch (error) {
      console.error('Network / Fetch Error:', error);
      showToast('Internet xatosi', 'Internet aloqasini tekshiring yoki qayta urinib ko\'ring.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });
}

function setFieldError(input, errorText) {
  input.classList.add('is-invalid');
  let errElem = input.parentElement.querySelector('.field-error');
  if (errElem) {
    errElem.textContent = errorText;
  }
}

function clearValidationErrors(form) {
  const invalidFields = form.querySelectorAll('.is-invalid');
  invalidFields.forEach(el => el.classList.remove('is-invalid'));
}

function fillModalDetails(details) {
  const modalName = document.getElementById('modalDetailName');
  const modalZone = document.getElementById('modalDetailZone');
  const modalDateTime = document.getElementById('modalDetailDateTime');
  const modalDuration = document.getElementById('modalDetailDuration');

  if (modalName) modalName.textContent = `${details.name} (${details.nick})`;
  if (modalZone) modalZone.textContent = details.zone;
  if (modalDateTime) modalDateTime.textContent = `${details.date} soat ${details.time} da`;
  if (modalDuration) modalDuration.textContent = details.duration;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
