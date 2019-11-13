window.onload = function () {
    
  var toolbarOptions = [

      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['image', 'code-block'],

      ['clean']                                         // remove formatting button
  ];

  //----------- END TOOLBAROPTIONS -----------------
  

  //----------- SIDEBAR BUTTONS -----------------

  var openbutton = document.querySelector('#open_button');
  openbutton.addEventListener('click', function () {
    document.getElementById("mySidenav").style.width = "250px";
  });
 var closebutton = document.querySelector('#close_button');
 closebutton.addEventListener('click', function () {
    document.getElementById("mySidenav").style.width = "0px";
  });


 //---------------------------------------------------

 //-------------------TOOLBAR---------------------
  var Font = Quill.import('formats/font');
  // We do not add Aref Ruqaa since it is the default
  Font.whitelist = ['mirza', 'roboto'];
  Quill.register(Font, true);
  var Delta = Quill.import('delta');
  var quill = new Quill('#editor-container', {
      modules: {
          toolbar: "#toolbar-container",
          history: {
              delay: 1,
              maxStack: 500,
              userOnly: true
          }
      },
      theme: 'snow'  // or 'bubble'
  });
  quill.focus();
  

  // -------------------GETTING VALUES FROM URL FUNCTION -----------------------

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


// --------------------------------------------------------------------
//-------- DOCNAME BAR ---------

var modal = document.getElementById("myModal");
var newdocname = "";
// Get the button that opens the modal
var btn = document.getElementById("link_newdoc");

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

//---------------------------------------------
var userid = getUrlParameter('id');
var username = getUrlParameter('username');
var docname = getUrlParameter('docname');
// ------------------------------RETREIVE Data from doc
    document.getElementById("user_hello").innerHTML = "Hello,"+username;
$.ajax({
  type: "GET",
  url: "https://avvokaapp.azurewebsites.net/api/user",
  cors: false,
  async: false,
  success: function(data){  
    $.each(data, function (i) {
      if(data[i].UserName == username & data[i].DocName == docname){
        var obj = JSON.parse(data[i].Doc);
        quill.setContents(obj);
      }
      });
},
error: function(XMLHttpRequest, textStatus, errorThrown) { 
    alert("Status: " + textStatus); alert("Error: " + errorThrown); 
} 
});
//////----------------------------------------
$.ajax({
  type: "GET",
  url: "https://avvokaapp.azurewebsites.net/api/user",
  cors: false,
  async: false,
  success: function(data){  
    $.each(data, function (i) {
      if(data[i].UserName == username){
        var myhref ="../NewDoc/doc.html?id="+userid+"&username="+username+"&docname="+data[i].DocName;
        $( "#MyDocs" ).append( "<a href="+myhref+">"+data[i].DocName+"</a>" );
      }
          
      });

    
},
error: function(XMLHttpRequest, textStatus, errorThrown) { 
    alert("Status: " + textStatus); alert("Error: " + errorThrown); 
} 
});

//------------------------------ GET
$("#create").click( function()
    { 
      var newdocname = document.getElementById('docname').value;
        
      $.ajax({
          type: "POST",
          url: "https://avvokaapp.azurewebsites.net/api/user",
          cors: false,
          async: false,
          data: { DocName: newdocname, UserName: username },
          success: function(data){  
            userid = JSON.stringify(data.Id);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
      });
      location.href = "../NewDoc/doc.html?id="+userid+"&username="+username+"&docname="+newdocname;

    });
//------------------------------ GET USERS DOCS --------------------------------



// ------------------Changes to the document ---------------------
  var change = new Delta();
  quill.on('text-change', function (delta) {
      change = change.compose(delta);

  });
  // Save periodically
  setInterval(function () {
      if (change.length() > 0) {
          $("#docsave").fadeIn(1000).fadeOut(1500);
          console.log('Saving changes', quill.getContents());
          $.ajax({
              type: "PUT",
              url: "https://avvokaapp.azurewebsites.net/api/user/"+userid,
              dataType: 'application/json',
              cors: false,
              async: false,
              data: { Doc: JSON.stringify(quill.getContents().ops), UserName: username, DocName: docname },
              success: function (resultData) {

              }
          });
          change = new Delta();
      }
  }, 5 * 1000);

  // Check for unsaved data
  window.onbeforeunload = function () {
      if (change.length() > 0) {
          return 'There are unsaved changes. Are you sure you want to leave?';
      }
  }
  var undoButton = document.querySelector('#undobutton');
  undoButton.addEventListener('click', function () {
      quill.history.undo();
  });
  var redoButton = document.querySelector('#redobutton');
  redoButton.addEventListener('click', function () {
      quill.history.redo();
  });

  //-----------Counter-------------\
  /*
    class Counter {
    constructor(quill, options) {
      this.quill = quill;
      this.options = options;
      this.container = document.querySelector(options.container);
      quill.on('text-change', this.update.bind(this));
      this.update();  // Account for initial contents
    }
   
    calculate() {
      let text = this.quill.getText();
      if (this.options.unit === 'word') {
        text = text.trim();
        // Splitting empty text returns a non-empty array
        return text.length > 0 ? text.split(/\s+/).length : 0;
      } else {
        return text.length;
      }
    }
    
    update() {
      var length = this.calculate();
      var label = this.options.unit;
      if (length !== 1) {
        label += 's';
      }
      this.container.innerText = length + ' ' + label;
    }
  }
  
  Quill.register('modules/counter', Counter);
  
  var quill = new Quill('#editor-container', {
    modules: {
      counter: {
        container: '#counter',
        unit: 'word'
      }
    }
  });
*/
$('[data-toggle="tooltip"]').tooltip();

  // Can control programmatically too
  
}

