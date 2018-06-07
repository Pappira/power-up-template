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
var listId = '5a9ef0ce024c776a21220836';
var estimateFields = [companyAlias, companyName, rut, contactName, email, tel, 
  workType, workQuantity, generalFinishes, price, deliveryDelay, customerComments, paymentWay, officeComments];
var itemChildren = [itemName, vias, pages, numbered, numeration, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes, hardCoverage, printer, cutsPerSheet, quantityPerLayout,
    layoutSize, sheetWaste];
var saveFunction = createCard;

t.render(function(){
  return t.get('card', 'shared', cardInfoKey)
  .then(function(cardInfo){
    if(t.arg('update')){
      saveFunction = updateCard;
      createCardButton.firstChild.data = "Modificar";
    } else {
      saveFunction = createCard;
    }

    createCardButton.addEventListener('click', saveFunction);

    if(cardInfo){
      loadFormFromEstimateObject(cardInfo);
    }
  });
});

itemAddButton.addEventListener('click', function(){
    var item = {};

    var itemColumns = itemChildren.map(function(itemElement){
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
    for(var i=0;i<itemColumns.length;i++) {
      tr.appendChild(itemColumns[i]);
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

var getTrelloCardDescription = function (estimate){
  var description = "";
  description += "#" + estimate.workType + "\n";
  description += "Cantidad: **" + estimate.workQuantity + "**\n";
  for (var i = 1; i < estimate.items.length; i++){
    var item = estimate.items[i];

    //El material debe ser material + " " + weight + "gr. " + color
    if (item.material !=null && item.material != ""){
      item.material = item.material + " " + 
        (item.weight!=null&&item.weight!=""?(item.weight + "gr. "):"") + item.color;
      delete item.weight;
      delete item.color;
    }
    if (item.vias != null && item.vias!="" && item.vias==1){
      delete item.vias;
    }
    if (item.pages != null && item.pages!="" && item.pages==1){
      delete item.pages;
    }
    if (item.inkQuantity != null && item.inkQuantity !=""){
      if(item.phases == "Simple faz"){
        item.inkDetail = item.inkQuantity + "/0 " + item.inkDetail;
      }else{
        item.inkDetail = item.inkQuantity + "/" + item.inkQuantity + " " + item.inkDetail;
      }
      delete item.inkQuantity;
    }
    if (item.openSize != null && item.closedSize != null && item.openSize == item.closedSize){
      item.size = item.openSize;
      delete item.openSize;
      delete item.closedSize;
    }
    delete item.numbered;
    if (item.design == false){
      delete item.design;
    }
    var name = item.itemName;
    delete item.itemName;

    var descriptionArray = Object.keys(item).map(function(itemKey, index) {
      var value = item[itemKey];
      return convertHeaderToTextInSpanish(itemKey) + ": **" + value + "**";
    });
    description += "\n##" +name + "\n"+ descriptionArray.join("\n");
  }
  return description;
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

var convertHeaderToTextInSpanish = function (header){
  switch (header){
    case "companyAlias":
      return "Nombre Fantasía";
    case "companyName":
      return "Razón social";
    case "rut":
      return "RUT";
    case "contactName":
      return "Nombre de contacto";
    case "email":
      return "Email";
    case "tel":
      return "Teléfono";
    case "workType":
      return "Tipo de trabajo";
    case "workQuantity":
      return "Cantidad";
    case "generalFinishes":
      return "Terminaciones";
    case "itemName":
      return "Nombre";
    case "vias":
      return "Vias";
    case "pages":
      return "Páginas";
    case "numeration":
      return "Numeración";
    case "openSize":
      return "Tamaño abierto";
    case "closedSize":
      return "Tamaño cerrado";
    case "size":
      return "Tamaño";
    case "material":
      return "Material";
    case "inkQuantity":
      return "Tintas";
    case "inkDetail":
      return "Tintas";
    case "phases":
      return "Fases";
    case "design":
      return "Incluye diseño";
    case "finishes":
      return "Terminaciones";
    case "hardCoverage":
      return "Plenos de fondo";
    case "printer":
      return "Impresora";
    case "cutsPerSheet":
      return "Cortes por Hoja";
    case "quantityPerLayout":
      return "Armado por Pliego";
    case "layoutSize":
      return "Tamaño del Pliego";
    case "sheetWaste":
      return "Demasía o Merma";
    default:
      return header;
  }
  return "";
};

itemAddSectionButton.addEventListener('click', function(){
  addItemSection.classList.toggle("hide");
});

var createCard = function(){
  var estimate = createEstimateObjectFromForm();
  var cardToSave = {idList: listId, desc: "Prueba", name: "Prueba"};
  createNewTrelloCard(t, cardToSave).then(function(card) {
    t.set(card.id, 'shared', cardInfoKey, estimate)
      .then(function(){
        t.closeModal();
      });
  });
};

var updateCard = function() {
  t.card('all')
  .then(function(card) {
    var estimate = createEstimateObjectFromForm();
    t.set('card', 'shared', cardInfoKey, estimate)
      .then(function(){
        updateTrelloCard(t, {id: card.id, desc: getTrelloCardDescription(estimate)})
          .then(function(){
            t.closeModal();
          });
      });
  });
};

var createEstimateObjectFromForm = function() {
  var estimate = {};

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
  for(var i=0;i<estimateFields.length;i++){
    var estimateField = estimateFields[i];
    if(estimateField.type !== "checkbox"){
       estimateField.value = estimate[estimateField.id];
    } else {
      estimateField.checked = estimate[estimateField.id];
    }
  }

  if(estimate.items && estimate.items.length) {
    for(var i=0;i<estimate.items.length;i++){
      var tr = document.createElement("tr");
      var item = estimate.items[i];
      var itemColumns = Object.keys(item).map(function(itemAttribute){
        var value = "";
        var itemElement = eval(itemAttribute);
        if(itemElement.type !== "checkbox"){
          itemElement.value = item[itemAttribute];
          value = item[itemAttribute];
        } else {
          itemElement.checked = item[itemAttribute];
          value = itemElement.checked ? "Si" : "No";
        }
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(value));
        return td;
      });
      for(var j=0;j<itemColumns.length;j++){
        tr.appendChild(itemColumns[j]);
      }
      itemsTable.appendChild(tr);
    }
    itemsContainer.classList.remove("hide");

    items = estimate.items;
  }
};
