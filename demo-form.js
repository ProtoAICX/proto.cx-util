const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "yandex.com",
  "mail.com",
  "gmx.com",
  "icloud.com",
  "fastmail.com",
  "tutanota.com",
  "mail.ru",
  "hushmail.com",
  "airmail.net",
  "lycos.com",
  "netcourrier.com",
  "zimbra.com",
  "rediffmail.com",
  "mailinator.com",
];

const personalSlug = $('.demo_form').attr('slug')

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const company = document.getElementById("company");
const website = document.getElementById("website");
const interactions = document.getElementById("messages-number-input");

const industrySelect = document.getElementById("industry-select");
const countrySelect = document.getElementById("country-select");
const appSelect = document.getElementById("apps");
const languageSelect = document.getElementById("languages");
const referralSelect = document.getElementById("referral-select");

const proGptToggle = document.getElementById("progpt-toggle");
const proAppsToggle = document.getElementById("proapps-toggle");
const proActiveToggle = document.getElementById("proactive-toggle");
const proDataToggle = document.getElementById("prodata-toggle");
const proAnalyticsToggle = document.getElementById("proanalytics-toggle");
const proAgentsToggle = document.getElementById("proagents-toggle");

if (countrySelect) {
  fetch('https://website-geolocation.proto-67a.workers.dev')
    .then(res => res.json())
    .then(res => {
      res.countries.forEach(country => {
        const newOption = document.createElement("option");
        newOption.value = country.value;
        newOption.innerText = country.title;
        countrySelect.appendChild(newOption);
      });
  
      if (res.ipcountry) {
        countrySelect.value = res.ipcountry;
        $(countrySelect).trigger('change')
      }
    })
    .catch(console.error)
} else {
  console.error('Could not find countrySelect');
}

if (languageSelect) {
  fetch('https://uploads-ssl.webflow.com/6571acfb082932878f948eaf/66421b61a49df95ab5bfa416_languages.txt')
    .then(res => res.json())
    .then(res => {
      res.languages.forEach(language => {
        const newOption = document.createElement("option");
        newOption.value = language.name;
        newOption.innerText = language.name;
        languageSelect.appendChild(newOption);
      });

})
  .catch(console.error)
} else {
  console.error('Could not find languageSelect');
}
  

const formContainer = document.getElementById('demo-form-container');
const formElement = document.getElementById('demo-form');

if (formElement) {
  formElement.addEventListener('submit', onFormSubmit);
} else {
  console.error('Form element not found');
}


function onFormSubmit(event) {
  event.preventDefault();

  const selectedLanguages = Array.from(languageSelect.selectedOptions);
  const languagesParam = selectedLanguages.map(ele => ele.value).join(";");
  
  const selectedApps = Array.from(appSelect.selectedOptions);
  const appsParam = selectedApps.map(ele => ele.value).join(";");
  
  const industrySelectValue = industrySelect.value === "Industry" ? "Other" : industrySelect.value;

  const interactionsNum = interactions.value.replace(/,/g, '');

  const emailDomain = email.value.split("@").pop().toLowerCase();

  if (FREE_EMAIL_DOMAINS.includes(emailDomain)) {
    alert('Please use your business email');
    return;
  }
  
  const hubspotUrlParams = new URLSearchParams();

  hubspotUrlParams.set('firstname', firstName.value)
  hubspotUrlParams.set('lastname', lastName.value)
  hubspotUrlParams.set('email', email.value)
  hubspotUrlParams.set('company', company.value)
  hubspotUrlParams.set('website', website.value)
  hubspotUrlParams.set('vertical', industrySelectValue)
  if (countrySelect.selectedOptions.length) {
    hubspotUrlParams.set('country_name', countrySelect.selectedOptions[0].innerText)
  }
  hubspotUrlParams.set('preferred_languages', languagesParam)
  hubspotUrlParams.set('channels_or_integrations_required', appsParam)
  hubspotUrlParams.set('average_number_of_messages_month', interactionsNum)
  hubspotUrlParams.set('how_did_you_find_us_', referralSelect.value)

  let addonsParam = "";
  for (const [addon, param] of [
    [proGptToggle, "proGPT"],
    [proAppsToggle, "proApps"],
    [proActiveToggle, "proActive"],
    [proDataToggle, "proData"],
    [proAnalyticsToggle, "proAnalytics"],
    [proAgentsToggle, "proAgents"],
  ]) {
    if (addon.checked) {
      addonsParam += `;${param}`
    }
  }

  if (addonsParam) {
    hubspotUrlParams.set('proto_aicx_add_ons_of_interest', addonsParam)
  }

  console.log(hubspotUrlParams.toString());

  formContainer.style.display = "none";
  
  const iframeEmbedElement = document.getElementById("cbg-iframe-container");
  iframeEmbedElement.style.display = "flex";
  
  const iframeSrc = 'https://app.hubspot.com/meetings/' + personalSlug + '?' + hubspotUrlParams.toString();
  iframeEmbedElement.innerHTML = '<iframe src="' + iframeSrc + '" class="cbg_iframe" frameborder="0" />'
  return false;
}
