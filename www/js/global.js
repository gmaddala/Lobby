function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return replaceAll(sParameterName[1], "%20", " ");
        }
    }
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function clearStudentInfo()
{
    var key = localStorage.getItem("key");
    var deptname = localStorage.getItem("deptname");
    var appid = localStorage.getItem("appid");
    var rsvp = localStorage.getItem("rsvp");
    var anon = localStorage.getItem("anon");
    var initialintakestatus = localStorage.getItem("initialintakestatus");
    var hasreasons = localStorage.getItem("hasreasons");
    var reasons = localStorage.getItem("reasons");
    
    localStorage.clear();
    
    localStorage.setItem("key", key);
    localStorage.setItem("deptname", deptname);
    localStorage.setItem("appid", appid);
    localStorage.setItem("rsvp", rsvp);
    localStorage.setItem("anon", anon);
    localStorage.setItem("initialintakestatus", initialintakestatus);
    localStorage.setItem("hasreasons", hasreasons);
    localStorage.setItem("reasons", reasons);
}