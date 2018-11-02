/*
listen for click event (edit)
update text in local storage (with key)
update display with new text value


Bugs:
edit and delete dropdown options only work for the first row
save and add note buttons both add all existing rows and new row



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
  $( ".datepicker" ).datepicker({
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
    //'status': "",
    'dateCreated': timeCreated,
    'dateDue' : dueDate
  }

  allData.push(itemObject);

  renderDisplay(allData);

  updateLocalStorage();

  console.log(allData)
});

 //write a function that updates localStorage
function updateLocalStorage() {
  localStorage.setItem(myKey, JSON.stringify(allData));
}


  //remove everything on page and display all items in localStorage at page reload
  //renderDisplay(jsonFromStorage)

function renderDisplay(data) {
  //$(".show-text").empty();
  data.forEach(function(item, index) {
    displayItem(item, index);
  });
}


renderDisplay(allData);





function displayItem(item, index) {
  var displayItem = $("<tr class='display-item' data-storage-key='"+ index + "' >");
  console.log(displayItem);
  // var td = $('<td><input type="checkbox"></td>');
  var itemStatus = getItemStatus();
  var td = $('<td></td>').append(itemStatus); //individual edit or delete

  displayItem.append(td);

  td = $(`<td class="dateCreated">${item.dateCreated}</td>`);
  displayItem.append(td);

  td = $ (`<td class="dateDue">${item.dateDue}</td>`);
  displayItem.append(td);

  td = $(`<td class="title">${item.title}</td>`);
  displayItem.append(td);

  td = $(`<td class="body">${item.body}</td>`);
  displayItem.append(td);
  
  $('.display').append(displayItem);
  //$('.show-text').append($('.display'));
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
      '<option class="blank" value="blank"></option>' +
      '<option class="edit" value="edit">Edit</option>' + 
      '<option class="delete" value="delete">Delete</option>' + 
      '</select>')
      .on('change', setStatus);
  }

  function setStatus() {
    //if delete is selected from dropdown, remove from DOM and splice from allData
      //update local storage
    if ($('.delete').prop('selected')) {
      $(this).parent().parent().remove();
      var indexStored = $(this).parent().parent().attr('data-storage-key');
      allData.splice(indexStored, 1);
      updateLocalStorage(allData);
    }
    if ($('.edit').prop('selected')) {

      var tr = $(this).parents('tr.display-item');

      var currentTitle = $('.title', tr).val();
      var newTitle = $('.title', tr).html('<input type="text" class="input-title"/>')
      $('.input-title').attr('placeholder', currentTitle);
      
      
      var currentBody = $('.body', tr).val();
      var newBody = $('.body', tr).html('<input type="text" class="input-body"/>')
      $('.input-body').attr('placeholder', currentBody);


      var timeCreated = moment(new Date()).format('L');
      var currentDate = timeCreated;


      var currentDueDate = $('.dateDue', tr).val();
      var newDueDate = $('.dateDue', tr).html('<input type="text" class="input-dateDue"/>')
      // $('.input-dateDue').attr('placeholder', currentDueDate);
      newDueDate.addClass('datepicker'); 
      newDueDate.datepicker({
        onSelect: function(userDate){
          dueDate = userDate;
        }
      });     

      var indexStored = $(this).parent().parent().attr('data-storage-key');

      $(this).closest('tr').append($('<button class="save">Save</button>').on('click', function() {
        var updatedTitle = $('.input-title').val();
        var updatedBody = $('.input-body').val();

        var newItem = {
          'title': updatedTitle,
          'body' : updatedBody,
          'dateCreated': currentDate,
          'dateDue' : dueDate
        }
        
        allData[indexStored] = newItem;

        updateLocalStorage(allData);
        renderDisplay(allData);
        $(this).remove();
      }));      
    }
  }


  // remove item from app

  // listen for click event (del)
  $(".clear-cache-btn").on("click", function(){
      // clear local storage
      //localStorage.clear();
      localStorage.removeItem(myKey);
      $(".show-text").empty();
  });


  //sortDate
  //if a and b both don't have due date set, sort by title
  //if only b is missing due date, a should appear at the top of the sort
  $("#sortDate").on("click", function() {
    allData.sort(function(a, b) {
      if(a.dateDue === undefined || a.dateDue === "" || a.dateDue === null) {
        if (b.dateDue === undefined || b.dateDue === "" || b.dateDue === null) {
          return a.title.localeCompare(b.title);
        }
        return 1;
      }
      if (b.dateDue === undefined || b.dateDue === "" || b.dateDue === null) {
          return -1;
      }
      return a.dateDue.localeCompare(b.dateDue);
    });
    $(".show-text").empty();
    console.log(allData)

    updateLocalStorage();
    renderDisplay(allData)
  });

});