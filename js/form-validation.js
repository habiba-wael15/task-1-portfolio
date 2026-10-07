/* ==========================================================================
   form-validation.js – Contact form validation
   - Each field is checked when the user leaves it (blur)
   - Errors update live while the user fixes a field
   - Everything is checked again on submit
   - A live character counter is shown for the message
   Note: this is a static site, so no message is actually sent.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contactForm');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('charCounter');
  const successBox = document.getElementById('formSuccess');
  const successText = document.getElementById('formSuccessText');

  const MESSAGE_MIN = 20;
  const MESSAGE_MAX = 500;

  // Each rule receives the trimmed value and returns an error message,
  // or an empty string when the value is valid.
  const rules = {
    name: function (value) {
      if (value === '') return 'Please enter your name.';
      if (value.length < 2) return 'Name must be at least 2 characters.';
      // Letters (including accented and Arabic letters), spaces, hyphens and apostrophes
      if (!/^[A-Za-z\u00C0-\u024F\u0600-\u06FF\s'-]+$/.test(value)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
      }
      return '';
    },

    email: function (value) {
      if (value === '') return 'Please enter your email address.';
      // Simple pattern: something@something.domain
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return 'Please enter a valid email address (e.g. name@example.com).';
      }
      return '';
    },

    subject: function (value) {
      if (value === '') return 'Please enter a subject.';
      if (value.length < 3) return 'Subject must be at least 3 characters.';
      return '';
    },

    message: function (value) {
      if (value === '') return 'Please write a message.';
      if (value.length < MESSAGE_MIN) {
        return 'Message must be at least ' + MESSAGE_MIN + ' characters (currently ' + value.length + ').';
      }
      if (value.length > MESSAGE_MAX) return 'Message cannot be longer than ' + MESSAGE_MAX + ' characters.';
      return '';
    }
  };

  // The form fields we validate, in the order they appear
  const fields = ['name', 'email', 'subject', 'message'].map(function (id) {
    return document.getElementById(id);
  });


  /* ---------- Helpers ---------- */

  // Shows or clears the error for one field using Bootstrap's is-valid / is-invalid classes
  function showFieldState(input, errorMessage) {
    const errorElement = document.getElementById(input.id + 'Error');
    errorElement.textContent = errorMessage;

    if (errorMessage) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.removeAttribute('aria-invalid');
    }
  }

  // Validates one field and returns true if it is valid
  function validateField(input) {
    const value = input.value.trim();
    const errorMessage = rules[input.name](value);
    showFieldState(input, errorMessage);
    return errorMessage === '';
  }

  // Updates the "x / 500" counter under the message box
  function updateCharCounter() {
    const length = messageInput.value.length;
    charCounter.textContent = length + ' / ' + MESSAGE_MAX;

    charCounter.classList.toggle('is-short', length > 0 && length < MESSAGE_MIN);
    charCounter.classList.toggle('is-near-limit', length >= MESSAGE_MAX - 50);
  }

  // Removes all validation styling (used after a successful submit)
  function resetFormState() {
    form.reset();
    fields.forEach(function (input) {
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('aria-invalid');
      document.getElementById(input.id + 'Error').textContent = '';
    });
    updateCharCounter();
  }


  /* ---------- Event listeners ---------- */

  fields.forEach(function (input) {
    // Validate when the user leaves a field (only if they typed something,
    // so tabbing through an empty form doesn't show errors everywhere)
    input.addEventListener('blur', function () {
      if (input.value.trim() !== '' || input.classList.contains('is-invalid')) {
        validateField(input);
      }
    });

    // While typing, re-check fields that were already validated
    input.addEventListener('input', function () {
      successBox.classList.add('d-none');
      if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
        validateField(input);
      }
    });
  });

  messageInput.addEventListener('input', updateCharCounter);

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Validate every field (map makes sure all of them show their errors)
    const results = fields.map(validateField);
    const isFormValid = results.every(function (isValid) { return isValid; });

    if (!isFormValid) {
      successBox.classList.add('d-none');
      // Move focus to the first field that has an error
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // All good – show a success message and clear the form
    const firstName = document.getElementById('name').value.trim().split(' ')[0];
    successText.textContent = 'Thank you, ' + firstName + '! Your message passed validation. ' +
      '(This is a static demo, so no message was actually sent.)';
    successBox.classList.remove('d-none');

    resetFormState();
  });

  // Set the counter correctly on page load
  updateCharCounter();
});

