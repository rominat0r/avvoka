window.onload = function(){
    
    var quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      ['bold', 'italic'],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'
});

var modal = document.getElementById("TempModal");
// Get the button that opens the modal
var btn = document.getElementById("submit");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block"; 
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
};
var username = getUrlParameter('username');
var userid;
var form = document.querySelector('form');

      
      
        form.onsubmit = function() {
          // Populate hidden form on submit\
          $("#create").click( function()
    { 
          var about = document.querySelector('input[name=about]');
          var  tempname = document.getElementById('tempname').value;
          about.value = JSON.stringify(quill.getContents());
          $.ajax({
            type: "POST",
            url: "https://avvokaapp.azurewebsites.net/api/user",
            cors: false,
            async: false,
            data: { Doc: JSON.stringify($(form).serializeArray()), UserName: username, DocName: tempname },
            success: function (data) {
              userid = JSON.stringify(data.Id);
              alert($(form).serializeArray().value[0]);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
              alert("Status: " + textStatus); alert("Error: " + errorThrown); 
          } 
        });
        location.href = "../NewDoc/doc.html?id="+userid+"&username="+username+"&docname="+tempname;
      });
          return false;
        };
        
  

};