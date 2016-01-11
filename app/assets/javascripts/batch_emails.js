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
  document.getElementById("jsOut").innerHTML = this.id;
  cloneAncestor.apply(this, [".emailGroup"]); // We need apply to have cloneAncestor access this. See http://stackoverflow.com/a/1081622/1877609
  this.oninput = null;
};

// Bindings:
$(document).on('page:change', function() {
  document.getElementById("jsBtn").onclick = addField;
  document.getElementById("email1").oninput = addField;
})
