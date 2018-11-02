/*
listen for click event (edit)
update text in local storage (with key)
update display with new text value


Bugs:
save and add note buttons both add all existing rows and new row

edit and delete dropdown options only work for the first row
Clear entries does not clear



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
  $(".display").empty();

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

  updateLocalStorage(allData);

  renderDisplay(allData);

  console.log(allData)
  curTextValue = $('#theTitle').val(""); // reading from <input> for title
  curKeyValue = $('#theNote').val("");
  $('.datepicker').val("");
});

 //write a function that updates localStorage
 function updateLocalStorage(data) {
  localStorage.setItem(myKey, JSON.stringify(data));
}


  //remove everything on page and display all items in localStorage at page reload
  //renderDisplay(jsonFromStorage)

  function renderDisplay(data) {
    $(".display").empty();
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

  // <pre> and <code> to preserve formatting for code snippets
  //td = $(`<td class="body"><pre><code><blockquote> ${item.body}</pre></code></blockquote></td>`);
 
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

  function setStatus(event) {

    //if delete is selected from dropdown, remove from DOM and splice from allData
      //update local storage
      var buttonValue = $(event.target).val();

      switch (buttonValue){
        case "blank": 
        renderDisplay(allData);
        break;

        case "delete":
        var tr = $(event.target).parents('tr.display-item'); //finding the row
        var indexStored = tr.attr('data-storage-key');
        allData.splice(indexStored, 1);
        updateLocalStorage(allData);
        tr.remove(); //remove row after getting index to update localStorage
        break;

        case "edit":
        var tr = $(event.target).parents('tr.display-item');

        var tdTitle = tr.find('td.title');
        var currentTitle = tdTitle.text();
        var newTitle = tdTitle.html(`<input type="text" class="input-title" value="${currentTitle}"/>`)
      //$('.input-title').attr('placeholder', currentTitle);
      
      var tdBody = tr.find('td.body');
      var currentBody = tdBody.text();
      tdBody.html(`<input type="text" class="input-body" value="${currentBody}"/>`)

      // var tdBody = $('.body', tr).val();
      // var newBody = $('.body', tr).html(`<input type="text" class="input-title" value="${currentTitle}"/>`)
      // $('.input-body').attr('placeholder', currentBody);


      var timeCreated = moment(new Date()).format('L');
      var currentDate = timeCreated;

      var tdDate = tr.find('td.dateDue');
      var currentDueDate = tdDate.text();


      var newDueDate = tdDate.html(`<input type="text" class="datepicker input-dateDue" value="${currentDueDate}"/>`)
      // $('.input-dateDue').attr('placeholder', currentDueDate);
      tr.find('.datepicker').datepicker("setDate", "11/02/2018").datepicker(
      {
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

        renderDisplay(allData); //cannot save one at a time yet

        $(this).remove();
      })); 
      break;

      default://should never be here
      break;
    }
  }

    // if (buttonValue === 'blank') {
    //   renderDisplay(allData);
    // }

    // if (buttonValue === 'delete') {

    //   var tr = $(event.target).parents('tr.display-item'); //finding the row
    //   var indexStored = tr.attr('data-storage-key');
    //   allData.splice(indexStored, 1);
    //   updateLocalStorage(allData);
    //   tr.remove(); //remove row after getting index to update localStorage
    // }
    // if (buttonValue === 'edit') {

    //   var tr = $(event.target).parents('tr.display-item');

    //   var tdTitle = tr.find('td.title');
    //   var currentTitle = tdTitle.text();
    //   var newTitle = tdTitle.html(`<input type="text" class="input-title" value="${currentTitle}"/>`)
    //   //$('.input-title').attr('placeholder', currentTitle);

    //   var tdBody = tr.find('td.body');
    //   var currentBody = tdBody.text();
    //   tdBody.html(`<input type="text" class="input-body" value="${currentBody}"/>`)

    //   // var tdBody = $('.body', tr).val();
    //   // var newBody = $('.body', tr).html(`<input type="text" class="input-title" value="${currentTitle}"/>`)
    //   // $('.input-body').attr('placeholder', currentBody);


    //   var timeCreated = moment(new Date()).format('L');
    //   var currentDate = timeCreated;

    //   var tdDate = tr.find('td.dateDue');
    //   var currentDueDate = tdDate.text();


    //   var newDueDate = tdDate.html(`<input type="text" class="datepicker input-dateDue" value="${currentDueDate}"/>`)
    //   // $('.input-dateDue').attr('placeholder', currentDueDate);
    //   tr.find('.datepicker').datepicker("setDate", "11/02/2018").datepicker(
    //   {
    //     onSelect: function(userDate){
    //       dueDate = userDate;
    //     }
    //   });     

    //   var indexStored = $(this).parent().parent().attr('data-storage-key');

    //   $(this).closest('tr').append($('<button class="save">Save</button>').on('click', function() {
    //     var updatedTitle = $('.input-title').val();
    //     var updatedBody = $('.input-body').val();

    //     var newItem = {
    //       'title': updatedTitle,
    //       'body' : updatedBody,
    //       'dateCreated': currentDate,
    //       'dateDue' : dueDate
    //     }

    //     allData[indexStored] = newItem;

    //     updateLocalStorage(allData);

    //     renderDisplay(allData); //cannot save one at a time yet

    //     $(this).remove();
    //   }));      



  // remove item from app

  // listen for click event (del)
  $(".clear-cache-btn").on("click", function(){
      // clear local storage
      if (!confirm('Are you sure you want to delete all?')) {
        return false;
      } else {
        localStorage.clear();
      //localStorage.removeItem(myKey);
        $(".display").empty();
        //renderDisplay(allData);
        allData = [];
      }
    });


  //sortDate
  //if a and b both don't have due date set, sort by title
  //if only b is missing due date, a should appear at the top of the sort
$('#sortDate').css('cursor', 'pointer'); //changes mouseover cursor to a hand

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

  updateLocalStorage(allData);
  renderDisplay(allData)
});

});
