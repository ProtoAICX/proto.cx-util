// Typewriter effect variables
let i = 0, j = 0, deleting = false, phrases = [];

// Form handling variables
const cbgUrlInput = document.getElementById("starturl");
const cbgCountrySelect = document.getElementById("country-select");
let didSetDefaultCbgUrl = false;

// Typewriter effect function
const type = () => {
  const input = document.getElementById('starturl');
  if (!input || input.value) return;
  
  if (!phrases.length) {
    const staticEl = document.querySelector('[data-typewriter="static"]');
    const phraseEls = document.querySelectorAll('[data-typewriter="phrase"]');
    phrases = phraseEls.length ? Array.from(phraseEls, el => el.textContent) : 
      ["train an AI assistant", "automate complaints", "support transactions", "engage citizens"];
  }
  
  const static = document.querySelector('[data-typewriter="static"]')?.textContent || "Your website to ";
  const current = phrases[i];
  
  input.placeholder = static + (deleting ? current.slice(0, --j) : current.slice(0, ++j));
  
  if (deleting ? j === 0 : j === current.length) {
    if (deleting) i = (i + 1) % phrases.length;
    deleting = !deleting;
    setTimeout(() => input.value || type(), deleting ? 750 : 50);
  } else {
    setTimeout(() => input.value || type(), deleting ? 25 : 50);
  }
};

// Initialize typewriter effect
const input = document.getElementById('starturl');
if (input && !input.value) {
  setTimeout(type, 1000);
  input.addEventListener('input', () => input.value || setTimeout(type, 500));
}

// URL input event handlers
if (cbgUrlInput) {
  cbgUrlInput.addEventListener("click", () => {
    if (!didSetDefaultCbgUrl) {
      cbgUrlInput.value = "https://";
      didSetDefaultCbgUrl = true;
    }
  });
  
  cbgUrlInput.addEventListener("paste", (e) => {
    let pasteValue = e.clipboardData.getData('text/plain');
    if (pasteValue.startsWith("https://")) {
      e.preventDefault();
      cbgUrlInput.value = pasteValue;
    }
  });
}

// Country select population
if (cbgCountrySelect) {
  fetch('https://website-geolocation.proto-67a.workers.dev')
    .then(res => res.json())
    .then(res => {
      res.countries.forEach(country => {
        const newOption = document.createElement("option");
        newOption.value = country.value;
        newOption.innerText = country.title;
        cbgCountrySelect.appendChild(newOption);
      });
      if (res.ipcountry) {
        cbgCountrySelect.value = res.ipcountry;
      }
    })
    .catch(console.error);
}

// Form submission handler
function onFormSubmit(event) {
  event.preventDefault();
  const urlInputValue = cbgUrlInput.value;
  let countrySelectQueryStr = "";
  
  if (cbgCountrySelect && cbgCountrySelect.value !== 'Country') {
    countrySelectQueryStr = "&country_code=" + cbgCountrySelect.value;
  }
  
  const formElement = document.getElementById('cbg-form');
  formElement.style.display = "none";
  
  // Hide hero content
  const hero = document.getElementById('hero-grid');
  if (hero) {
    hero.style.display = "none";
  }
  
  const cbgElement = document.getElementById("cbg-container");
  cbgElement.style.display = "flex";
  
  const iframeEmbedElement = document.getElementById("cbg-iframe-container");
  iframeEmbedElement.style.display = "flex";
  
  const iframeSrc = 'https://builder.proto.cx/build?starturl=' + encodeURIComponent(urlInputValue) + countrySelectQueryStr;
  iframeEmbedElement.innerHTML = '<iframe src="' + iframeSrc + '" class="cbg_iframe" frameborder="0" style="width:100%;"/>';
  
  const cbgCTA = document.getElementById("cbg-cta");
  cbgCTA.href = 'https://v3.proto.cx/login/sign-up/?starturl=' + encodeURIComponent(urlInputValue) + countrySelectQueryStr;
  
  return false;
}

// Set up form submission
const formElement = document.getElementById('cbg-form');
if (formElement) {
  formElement.addEventListener('submit', onFormSubmit);
}

// Scroll to top
window.scrollTo(0, 1);
