/*
listen for click event (edit)
update text in local storage (with key)
update display with new text value


 <body>
    <input type="text" class="text-input" id="theKey" placeholder="Enter some text">
    <button class="add-text-btn">Add text</button>
    <button class="clear-cache-btn">Clear Entries</button>
    <button class="edit-complete">Update</button>
    <div class="show-text"></div>
  </body>

 */

$(document).ready(function(){
  console.log("before\n", window.localStorage);
  var myKey = "storedKey";
  var currentData = localStorage.getItem(myKey);
  console.log(currentData)
  var allData = JSON.parse(currentData);
  console.log(allData);
  if (allData === null) {
    allData = [];
  }

  

  var dueDate = "";
  $( "#datepicker" ).datepicker({
    onSelect: function(userDate){
      dueDate = userDate;
    }
  });


// add event listener to add note
$(".add-text-btn").on("click", function(){
  $(".show-text").empty();
  var curTextValue = $('#theTitle').val(); // reading from <input> for title
  var curKeyValue = $('#theNote').val(); // reading from <input> for note

  //create item object in a div element for every note entry
  //add new note to overall data array
  //update page to show new note
  var timeCreated = moment(new Date()).format('L');

  //var itemStatus = "";
  var itemObject = {
    'title': curTextValue,
    'body' : curKeyValue,
    'status': "",
    'dateCreated': timeCreated,
    'dateDue' : dueDate
  }

  allData.push(itemObject);

  updateLocalStorage();

  console.log(allData)
  renderDisplay(allData);

});

 //write a function that updates localStorage
  function updateLocalStorage() {
    localStorage.setItem(myKey, JSON.stringify(allData));
  }


  //remove everything on page and display all items in localStorage at page reload
  //renderDisplay(jsonFromStorage)

  function renderDisplay(data) {
    data.forEach(function(item, index) {
      displayItem(item, index);
    });
  }


  renderDisplay(allData);





  function displayItem(item, index) {
    var displayItem = $("<tr class='display-item' data-storage-key='"+ index + "' >");
    // var td = $('<td><input type="checkbox"></td>');
    var itemStatus = getItemStatus();
    var td = $('<td></td>').append(itemStatus); //individual edit or delete

    displayItem.append(td);
    // itemStatus = getItemStatus();
    td = $(`<td>${item.dateCreated}</td>`);
    displayItem.append(td);

    td = $ (`<td>${item.dateDue}</td>`);
    displayItem.append(td);
 
    td = $(`<td>${item.title}</td>`);
    displayItem.append(td);

    td = $(`<td>${item.body}</td>`);
    displayItem.append(td);


    
    console.log(displayItem);
    
    $('.display').append(displayItem);
    $('.show-text').append($('.display'));
  }

  
  // function renderDisplay(jsonObject) {
  //   //clear .show-text
  //   //iterate over jsonObject
  //     //append item to .showtext
  // }

  // renderDisplay(locakStorage.get('theKey'));

  // function removeItem(itemIdentifier) {
  //   //local Storage.remove("theKey")
  //   renderDisplay(); //this re-renders the DOM
  // }

  function getItemStatus() {
    return $('<select class="itemStatus">' + 
      '<option value="edit">Edit</option>' + 
      '<option value="delete">Delete</option>' + 
      '</select>')
      .on('change', setStatus);
  }

  function setStatus() {
    $('.itemStatus >option[value="delete"]').remove();
  }

  //$("#cmbTaxIds >option[value='3']").remove();


  // remove item from app

  // listen for click event (del)
  $(".clear-cache-btn").on("click", function(){
    // clear local storage
    localStorage.clear();
    $(".show-text").empty();
  });

});