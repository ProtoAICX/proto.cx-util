(function() {  
  try {  
    const utmParamNames = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];  
    const params = new URL(location.href).searchParams;
    
    // Function to set cookies accessible across subdomains
    function setCookie(name, value, days) {
      let expires = "";
      if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
      }
      // Set the domain to '.proto.cx' to make cookies available to proto.cx and its subdomains
      document.cookie = name + "=" + (value || "")  + expires + "; domain=.proto.cx; path=/";
    }
    
    for (const param of utmParamNames) {  
      const value = params.get(param);  
      if (value) {
        // Call setCookie function to set cookies
        setCookie(param, value, 7);  // Here, '7' is the number of days you want the cookies to be stored
      }  
    }  
  } catch(error) {  
    console.error(error)  
  }  
}());
