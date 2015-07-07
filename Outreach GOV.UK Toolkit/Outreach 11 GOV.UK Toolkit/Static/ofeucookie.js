  function setCookie(c_name,value,exdays)
  {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
  }
  function getCookie(c_name)
  {
    var retval = true;
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
      c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
      retval = false;
    }
    return retval;
  }
  function checkCookieSeen()
  {
    var cookieName = "OFCookie_" + m_tlCustomOnLoadEventArgs.FormName;
    var cookieSeen=getCookie(cookieName);
    if (cookieSeen)
    {
      var gcm = document.getElementById("global-cookie-message");
      if(gcm) {
        gcm.style.display = 'none';
      }
    } else {
      setCookie(cookieName,"Seen",365);
    }
  }