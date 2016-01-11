
// Adding email slots ----

function cloneAncestor(objectClass) {

  var regex = /^(.+?)(\d*)$/i;
  var obj = $(this).parents(objectClass);
  var ids = obj[0].id.match(regex);

  obj.clone()
    .attr("id", ids[1] + (parseInt(ids[2]) + 1) )
    .appendTo(obj.parent())
    .find("*").each(function() {
      var id = this.id || "";
      var match = id.match(regex) || [];
      if (match.length == 3) {
        this.id = match[1] + (parseInt(ids[2]) + 1);
      }
      this.value = "";
      if (this.type == 'email') {
        this.oninput = addField;
      }
    });

}

var addField = function() {
  cloneAncestor.apply(this, [".emailGroup"]); // We need apply to have cloneAncestor access this. See http://stackoverflow.com/a/1081622/1877609
  // Update current email field:
  this.oninput = null;
  var btn = $(this).parents(".emailGroup").children("button.emailRemove")[0];
  btn.style.visibility = 'visible';
  btn.onclick = removeParent;
};


// Parsing the sink ----

function parseEmails(emailString) {

  var sepRegex = /\.\s|\s\.|[\s,\-\/#!$%\^&\*;:{}=\-_`~()\<\>]/;
  var emailRegex=/^[^\s@]+@[^\s@]+$/i;

  return emailString.split(sepRegex)
    .filter(function(el) {return emailRegex.test(el)})
}

var timer = 0;
var parseSink = function() {
  var el = this;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(function() {
    var ttt = parseEmails(el.value);
    populateEmails(ttt);
    document.getElementById("jsOut").innerHTML = ttt;
  }, 1000);
};


// Populating entries ----

var populated = {}; // to keep track of what we inserted already.

function populateEmail(email) {
  var N = $('.emailGroup').length;
  console.log(N);
  var emailGroup = document.getElementById("email" + N);
  emailGroup.value = email;
  addField.apply(emailGroup);
}

function populateEmails(emailsArray) {
  for (i=0, len=emailsArray.length; i<len; i++) {
    var email = emailsArray[i];
    if (!populated[email]) {
      populateEmail(email);
      populated[email] = true;
    }
  }
}


// DOM Miscs ----

function removeParent() {
  this.parentNode.remove();
}

// Bindings: ----

$(document).on('page:change', function() {
  document.getElementById("jsBtn").onclick = function() {
    var ttt = parseEmails($("#batchEmailSink")[0].value);
    document.getElementById("jsOut").innerHTML = ttt;
  };
  document.getElementById("batchEmailSink").oninput = parseSink;
  document.getElementById("email1").oninput = addField;
});
