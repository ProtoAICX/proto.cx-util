const cbgUrlInput = document.getElementById("starturl");
const cbgIndustrySelect = document.getElementById("industry-select");
const cbgCountrySelect = document.getElementById("country-select");

let didSetDefaultCbgUrl = false;

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
    .catch(console.error)
}

var formElement = document.getElementById('cbg-form');
formElement.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const grid1 = document.getElementById("generator-grid-1");
  grid1.disabled = true;
  const grid2 = document.getElementById("generator-grid-2");
  grid2.removeAttribute("type");

  const urlInputValue = cbgUrlInput.value;
  const industrySelectValue = cbgIndustrySelect.value === "Industry" ? "Other" : cbgIndustrySelect.value;
  let countrySelectQueryStr = "";
  if (cbgCountrySelect && cbgCountrySelect.value !== 'Country') {
    countrySelectQueryStr = "&country_code=" + cbgCountrySelect.value;
  }

  formElement.style.display = "none";
  
  const cbgElement = document.getElementById("cbg-container");
  cbgElement.style.display = "grid";
  
  const iframeEmbedElement = document.getElementById("cbg-iframe-container");
  iframeEmbedElement.style.display = "block";
  const iframeSrc = 'https://builder.proto.cx/build?starturl=' + encodeURIComponent(urlInputValue) + '&industry=' + industrySelectValue + countrySelectQueryStr;
  iframeEmbedElement.innerHTML = '<iframe src="' + iframeSrc + '" class="cbg_iframe" frameborder="0" />'
  
  const cbgCTA = document.getElementById("cbg-cta");
  cbgCTA.href = 'https://v3.proto.cx/login/sign-up/?starturl=' + encodeURIComponent(urlInputValue) + '&industry=' + industrySelectValue + countrySelectQueryStr;
  
  return false;
}
