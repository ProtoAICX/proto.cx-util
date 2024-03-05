  const cbgUrlInput = document.getElementById("starturl");
  const cbgIndustrySelect = document.getElementById("industry-select");

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

  var formElement = document.getElementById('cbg-form');
  formElement.addEventListener('submit', onFormSubmit);

  function onFormSubmit(event) {
    event.preventDefault();
    const urlInputValue = cbgUrlInput.value;
    const industrySelectValue = cbgIndustrySelect.value === "Industry" ? "Other" : cbgIndustrySelect.value;
    
    formElement.style.display = "none";
    const iframeEmbedElement = document.getElementById("cbg-iframe-container");
    iframeEmbedElement.style.display = "block";
    const iframeSrc = 'https://builder.proto.cx/build?starturl=' + encodeURIComponent(urlInputValue) + '&industry=' + industrySelectValue;
    iframeEmbedElement.innerHTML = '<iframe src="' + iframeSrc + '" class="cbg_iframe" frameborder="0" />'
    return false;
  }
