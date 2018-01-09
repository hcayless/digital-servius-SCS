importScripts("CETEI.js", "appcrit.js");

var c = new CETEI();
var app = new appcrit();
c.addBehaviors({"handlers":{
  // Overrides the default ptr behavior, displaying a short link
  "ptr": function() {
    var self = this;
    return function() {
      var shadow = this.createShadowRoot();
      var link = document.createElement("a");
      link.innerHTML = this.getAttribute("target").replace(/https?:\/\/([^\/]+)\/.*/, "$1");
      link.href = this.getAttribute("target");
      shadow.appendChild(link);
    }
  }
}, "fallbacks": {
  "ptr": function(elt) {
    var content = document.createElement("a");
    content.setAttribute("href", elt.getAttribute("target"));
    content.innerHTML = elt.getAttribute("target").replace(/https?:\/\/([^\/]+)\/.*/, "$1");
    elt.appendChild(content);
    elt.addEventListener("click", function(event) {
      window.location = this.getAttribute("target");
    });
  },
  "ref": function(elt) {
    $(elt).click(function() {
      window.location = $(this).attr("target");
    });
  }
}});
onmessage = function(e) {
  var data = c.getHTML5(e.data, null, function(el){
    if (el.hasAttribute("id")) {
     if (["tei-listwit", "tei-witness", "tei-bibl", "tei-handnote", "tei-person", "tei-item"].includes(el.localName)) {
        var val = $(el).children("tei-abbr[type=siglum]").html();
        if (val) {
          app.references["#" + el.getAttribute("id")] = val;
        } else {
          app.references["#" + el.getAttribute("id")] = el.getAttribute("id");
        }
      }
    }
  });
  data.then(function(TEI){
    app.loadData(TEI);
    postMessage(TEI);
  })
}
