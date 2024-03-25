(function() {
  try {
    const utmParamNames = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const params = new URL(location.href).searchParams;
    for (const param of utmParamNames) {
      const value = searchParams.get(param);
      if (value) {
        localStorage.setItem(param, value);
      }
    }
  } catch(error) {
    console.error(error)
  }
}())
