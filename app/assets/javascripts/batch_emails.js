
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
        this.addEventListener('input', parseEmailField);
      }
      if (this.id.indexOf('firstName') > -1) {
        this.addEventListener('focus', function() {
          parseEmailField.apply($(this).parent().parent().find(".emailField")[0])
        });
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

  var sepRegex = /\.\s|\s\.|[\s"',\/#!$%\^&\*;:{}=`~()\<\>]/;
  var emailRegex=/^[^\s@]+@[^\s@]+$/i;

  return emailString.split(sepRegex)
    .filter(function(el) {return emailRegex.test(el)})
}

var sinkTimer = 0;
var parseSink = function() {
  var el = this;
  if (sinkTimer) {
    clearTimeout(sinkTimer);
  }
  sinkTimer = setTimeout(function() {
    populateEmails(parseEmails(el.value));
  }, 1000);
};


// Populating entries ----

var populated = {}; // to keep track of what we inserted already.

function populateEmail(email) {
  var N = $('.emailGroup').length;
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


// Parsing entries ----

// Global knowledge of best strategy
var globalSep = null;

function parseEmail(email, sep) {
  var preField = email.split('@')[0];
  if (sep === undefined) {
    if (preField.indexOf('.') > -1) {
      sep = '.';
    } else if (preField.indexOf('_') > -1) {
      sep = '_';
    } else {
      sep = [0,1];
    }
  }
  switch(typeof sep) {
    case 'string':
      return preField.split(sep, 2);
    case 'object':
      return [preField.slice(sep[0], sep[1]), preField.slice(sep[1], sep[2])];
    default :
      preField.split('.', 2);
  }
}

function populateNames(names, el) {
  fnField = $(el).parents(".emailGroup").find(".fnField")[0];
  lnField = $(el).parents(".emailGroup").find(".lnField")[0];
  if (fnField.value == '' && lnField.value == '') {
    fnField.value = names[0];
    lnField.value = names[1];
  }
}

var parseEmailField = function() {
  var el = this;
  if (/^[^\s@]+@[^\s@]+$/i.test(el.value)) {
    populateNames(parseEmail(el.value), el)
  };
};


// DOM Miscs ----

function removeParent() {
  this.parentNode.remove();
}

// Bindings: ----

$(document).on('page:change', function() {
  document.getElementById("batchEmailSink").oninput = parseSink;
  document.getElementById("email1").oninput = addField;
  document.getElementById("email1").addEventListener('input', parseEmailField);
  document.getElementById("firstName1").addEventListener('focus', function() {
    parseEmailField.apply($(this).parent().parent().find(".emailField")[0])
  });
});
