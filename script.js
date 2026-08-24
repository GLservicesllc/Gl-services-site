// Wait until the whole page has loaded before running anything.
// This avoids errors from trying to grab elements that don't exist yet.
document.addEventListener("DOMContentLoaded", function () {

  // Grab the pieces of the page we need to work with.
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const status = document.getElementById("formStatus");

  // A simple pattern to check "does this look like an email address".
  // It's not perfect (no regex is), but it catches obvious mistakes.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // "submit" fires the moment someone clicks the Send button.
  form.addEventListener("submit", function (event) {

    // Stop the browser's default behavior, which would normally
    // reload the page. We want to check things first.
    event.preventDefault();

    const errors = [];

    if (nameInput.value.trim() === "") {
      errors.push("Please enter your name.");
    }

    if (!emailPattern.test(emailInput.value.trim())) {
      errors.push("Please enter a valid email address.");
    }

    if (messageInput.value.trim() === "") {
      errors.push("Let us know what you need done.");
    }

    if (errors.length > 0) {
      // Show every problem, joined onto one line.
      status.textContent = errors.join(" ");
      status.className = "error";
      return; // Stop here. Do not pretend it was sent.
    }

    // Everything looks good locally. Now actually send it to Formspree.
    status.textContent = "Sending...";
    status.className = "";

    // fetch() sends the data to Formspree in the background,
    // without reloading the page.
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        // Asking Formspree to reply with JSON instead of redirecting
        // us to their website, so we can stay on our own page.
        "Accept": "application/json"
      }
    })
      .then(function (response) {
        if (response.ok) {
          status.textContent = "Thanks! We got your request and will be in touch soon.";
          status.className = "success";
          form.reset();
        } else {
          status.textContent = "Something went wrong sending that. Please try again or call us directly.";
          status.className = "error";
        }
      })
      .catch(function () {
        // This runs if there's no internet connection, etc.
        status.textContent = "Something went wrong sending that. Please try again or call us directly.";
        status.className = "error";
      });
  });

});
