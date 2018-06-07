/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var companyAlias = document.getElementById('companyAlias');
var companyName = document.getElementById('companyName');
var rut = document.getElementById('rut');
var contactName = document.getElementById('contactName');
var email = document.getElementById('email');
var tel = document.getElementById('tel');

var workType = document.getElementById('workType');
var workQuantity = document.getElementById('workQuantity');
var generalFinishes = document.getElementById('generalFinishes');

var itemsContainer = document.getElementById('itemsContainer');
var itemsTable = document.getElementById('itemsTable');
var itemName = document.getElementById('itemName');
var vias = document.getElementById('vias');
var pages = document.getElementById('pages');
var numbered = document.getElementById('numbered');
var numeration = document.getElementById('numeration');
var numerationDiv = document.getElementById('numerationDiv');
var openSize = document.getElementById('openSize');
var closedSize = document.getElementById('closedSize');
var material = document.getElementById('material');
var weight = document.getElementById('weight');
var color = document.getElementById('color');
var inkQuantity = document.getElementById('inkQuantity');
var inkDetail = document.getElementById('inkDetail');
var phases = document.getElementById('phases');
var design = document.getElementById('design');
var finishes = document.getElementById('finishes');
var hardCoverage = document.getElementById('hardCoverage');
var printer = document.getElementById('printer');
var cutsPerSheet = document.getElementById('cutsPerSheet');
var quantityPerLayout = document.getElementById('quantityPerLayout');
var layoutSize = document.getElementById('layoutSize');
var sheetWaste = document.getElementById('sheetWaste');

var addItemSection = document.getElementById('addItemSection');
var itemAddSectionButton = document.getElementById('itemAddSectionButton');
var itemAddButton = document.getElementById('itemAddButton');
var createCardButton = document.getElementById('createCardButton');

var price = document.getElementById('price');
var deliveryDelay = document.getElementById('deliveryDelay');
var customerComments = document.getElementById('customerComments');
var paymentWay = document.getElementById('paymentWay');
var officeComments = document.getElementById('officeComments');

var items = [];
var cardInfoKey = 'pappira.cardInfo';

t.render(function(){
  return t.get('card', 'shared', cardInfoKey)
  .then(function(cardInfo){
    if(cardInfo){
      loadFormFromEstimateObject(cardInfo);
    }
  });
});

itemAddButton.addEventListener('click', function(){
  var itemChildren = [itemName, vias, pages, numbered, numeration, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes, hardCoverage, printer, cutsPerSheet, quantityPerLayout,
    layoutSize, sheetWaste];

    var item = {};

    itemChildren = itemChildren.map(function(itemElement){
      var value = "";
      if(itemElement.type !== "checkbox"){
        value = itemElement.value;
        item[itemElement.id] = itemElement.value;
      } else {
        value = itemElement.checked ? "Si" : "No";
        item[itemElement.id] = itemElement.checked;
      }

      var td = document.createElement("td");
      td.appendChild(document.createTextNode(value));
      return td;
    });
    items.push(item);
    var tr = document.createElement("tr");
    for(var i=0;i<itemChildren.length;i++) {
      tr.appendChild(itemChildren[i]);
    }
    itemsTable.appendChild(tr);
    itemsContainer.classList.remove("hide");
    goToHashtag("#");
});

numbered.addEventListener('click', function(){
  if(numbered.checked) {
    numerationDiv.classList.remove("hide");
  } else {
    numerationDiv.classList.add("hide");
    numeration.value = "";
  }
});

itemAddSectionButton.addEventListener('click', function(){
  addItemSection.classList.toggle("hide");
});

itemAddSectionButton.addEventListener('click', function(){
  addItemSection.classList.toggle("hide");
});

createCardButton.addEventListener('click', function(){
  var estimate = createEstimateObjectFromForm();
  var cardToSave = {idList: listId, desc: "Prueba", name: "Prueba"};
  createNewTrelloCard(t, cardToSave).then(function(card) {
    t.set(card.id, 'shared', cardInfoKey, estimate)
      .then(function(){
        t.closeModal();
      });
  });
});

var createEstimateObjectFromForm = function() {
  var estimate = {};
  var estimateFields = [
    companyAlias, companyName, rut, contactName, email, tel, 
    workType, workQuantity, generalFinishes, itemsContainer, itemsTable, itemName, 
    vias, pages, numbered, numeration, numerationDiv, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes, hardCoverage, 
    printer, cutsPerSheet, quantityPerLayout, layoutSize, sheetWaste, 
    addItemSection, price, deliveryDelay, customerComments, paymentWay, officeComments];

  for(var i=0;i<estimateFields.length;i++){
    var estimateField = estimateFields[i];
    if(estimateField.type !== "checkbox"){
      estimate[estimateField.id] = estimateField.value;
    } else {
      estimate[estimateField.id] = estimateField.checked;
    }
  }
  estimate.items = items;
  return estimate;
};

var loadFormFromEstimateObject = function(estimate) {
  var estimateFields = [
    companyAlias, companyName, rut, contactName, email, tel, 
    workType, workQuantity, generalFinishes, itemsContainer, itemsTable, itemName, 
    vias, pages, numbered, numeration, numerationDiv, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes, hardCoverage, 
    printer, cutsPerSheet, quantityPerLayout, layoutSize, sheetWaste, 
    addItemSection, price, deliveryDelay, customerComments, paymentWay, officeComments];

  for(var i=0;i<estimateFields.length;i++){
    var estimateField = estimateFields[i];
    if(estimateField.type !== "checkbox"){
       estimateField.value = estimate[estimateField.id];
    } else {
      estimateField.checked = estimate[estimateField.id];
    }
  }

  var itemRows = items.map(function(item){
    var value = "";
    var itemAttributes = item.keys();
    var tr = document.createElement("tr");
    for(var i=0;i<itemAttributes.length;i++){
      var itemElement = eval(itemAttributes[i]);
      var value = "";
      if(itemElement.type !== "checkbox"){
        itemElement.value = item[itemElement];
        value = item[itemElement];
      } else {
        itemElement.checked = item[itemElement];
        value = itemElement.checked ? "Si" : "No";
      }
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(value));
      tr.appendChild(td);
    }
    itemsTable.appendChild(tr);
    return tr;
  });
  itemsContainer.classList.remove("hide");
};