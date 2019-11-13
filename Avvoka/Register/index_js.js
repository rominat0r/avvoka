window.onload = function(){

document.getElementById("signup").addEventListener("click", PassName);
var modal = document.getElementById("DocModal");

var newdocname = "";
// Get the button that opens the modal
var btn = document.getElementById("st-box");

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
var username = "";
var docname = "";
var userid;
function PassName(){    
     username= document.getElementById('uname').value ;
    
    function box (){
        $("#signupbox").fadeOut();
        $("#signupbox").animate({
        top: '600px'
        },1000);
    };
    box();
        $("#option_container").fadeIn(2000).animate({top:'100px'});
        $("#st-box").fadeIn(2000).animate({top:'100px'});
        $("#nd-box").fadeIn(2000).animate({top:'100px'});
        $("#rd-box").fadeIn(2000).animate({top:'100px'});
    }

    $("#create").click( function()
    { 
      
        docname = document.getElementById('docname').value;
        
        $.ajax({
            type: "POST",
            url: "https://avvokaapp.azurewebsites.net/api/user",
            cors: false,
            async: false,
            data: { DocName: docname, UserName: username },
            success: function(data){  
              userid = JSON.stringify(data.Id);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) { 
              alert("Status: " + textStatus); alert("Error: " + errorThrown); 
          } 
        });
        location.href = "../NewDoc/doc.html?id="+userid+"&username="+username+"&docname="+docname;
    });
    $("#rd-box").click( function()
    { 
        
        location.href = "../Template/template.html?username="+username;
    }
);
  
};