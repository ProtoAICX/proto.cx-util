const demoFormElement = document.getElementById('demo-form')

if (demoFormElement) {
  demoFormElement.onsubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted');
  }
} else {
  console.log('Could not find demo form');
}

// const firstName = document.getElementById("first-name");
// const lastName = document.getElementById("last-name");
// const email = document.getElementById("email");
// const company = document.getElementById("company");
// const interactions = document.getElementById("messages-number-input");

// const cbgIndustrySelect = document.getElementById("industry-select");
// const cbgCountrySelect = document.getElementById("country-select");

// if (cbgCountrySelect) {
//   fetch('https://website-geolocation.proto-67a.workers.dev')
//     .then(res => res.json())
//     .then(res => {
//     res.countries.forEach(country => {
//       const newOption = document.createElement("option");
//       newOption.value = country.title;
//       newOption.innerText = country.title;
//       cbgCountrySelect.appendChild(newOption);
//     });

//     if (res.ipcountry) {
//       cbgCountrySelect.title = res.ipcountry;
//     }
//   })
//     .catch(console.error)
// }

// var formContainer = document.getElementById('demo-form-container');
// var formElement = document.getElementById('demo-form');
// formElement.addEventListener('submit', onFormSubmit);

// function onFormSubmit(event) {
//   event.preventDefault();

//   const selected_apps = $("#apps :selected").text();
//   const selected_languages = $("#languages :selected").text();
//   const interactions_num = interactions.value.replace(/,/g, '');

//   const industrySelectValue = cbgIndustrySelect.value === "Industry" ? "Other" : cbgIndustrySelect.value;
//   let countrySelectQueryStr = "";

//   formContainer.style.display = "none";
//   const iframeEmbedElement = document.getElementById("cbg-iframe-container");
//   iframeEmbedElement.style.display = "flex";
//     const iframeSrc = 'https://app.hubspot.com/meetings/curtis-proto/proto-demo-new?firstname=' + encodeURIComponent(firstName.value) + '&lastname=' + encodeURIComponent(lastName.value) + '&email=' + encodeURIComponent(email.value) + '&company=' + encodeURIComponent(company.value) + '&vertical=' + industrySelectValue + '&country_name=' + encodeURIComponent(cbgCountrySelect.value) + '&preferred_languages=' + encodeURIComponent(selected_languages) + '&channels_or_integrations_required=' + encodeURIComponent(selected_apps) + '&average_number_of_messages_month=' + encodeURIComponent(interactions_num);
//   iframeEmbedElement.innerHTML = '<iframe src="' + iframeSrc + '" class="cbg_iframe" frameborder="0" />'
//   return false;
// }
