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
var finishAddButton = document.getElementById('finishAddButton');
var finishesContainer = document.getElementById('finishesContainer');
var finishesTable = document.getElementById('finishesTable');
var itemFinish = document.getElementById('itemFinish');
var showToClient = document.getElementById('showToClient');
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
var downPayment = document.getElementById('downPayment');
var deliveryDelay = document.getElementById('deliveryDelay');
var customerComments = document.getElementById('customerComments');
var paymentWay = document.getElementById('paymentWay');
var officeComments = document.getElementById('officeComments');

var items = [];
var itemFinishes = [];
var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';
var estimateFields = [companyAlias, companyName, rut, contactName, email, tel, 
  workType, workQuantity, generalFinishes, price, downPayment, deliveryDelay, customerComments, paymentWay, officeComments];
var itemChildren = [itemName, vias, pages, numbered, numeration, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, hardCoverage, printer, cutsPerSheet, quantityPerLayout,
    layoutSize, sheetWaste];
var finishChildren = [showToClient,itemFinish];
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
      loadFormFromEstimateObject(deTranslateEstimate(cardInfo);
    }
  });
});

itemAddButton.addEventListener('click', function(){
    var item = {};

    var itemColumns = itemChildren.map(function(itemElement){
      var value = "";
      if(!itemElement.type && itemElement.length) {
        value = itemElement.join("\n");
      } else if(itemElement.type !== "checkbox"){
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
    item.finishes = itemFinishes;
    items.push(item);
    addItemToVariantSelect(items, items.length - 1);
    var tr = document.createElement("tr");
    for(var i=0;i<itemColumns.length;i++) {
      tr.appendChild(itemColumns[i]);
    }
    itemsTable.appendChild(tr);
    itemsContainer.classList.remove("hide");
    goToHashtag("#");
});

var addFinishModifyButton = function(tr) {
  var td = document.createElement("td");
  var button = document.createElement("button");
  button.appendChild(document.createTextNode("Modificar"));
  button.onclick = editFinish;
  td.appendChild(button);
  tr.appendChild(td);
}
var addFinishToItem = function(){
  var finish = {};

  var finishColumns = finishChildren.map(function(finishElement){
    var value = "";
    if(finishElement.type !== "checkbox"){
      value = finishElement.value;
      finish[finishElement.id] = finishElement.value;
      finishElement.value="";
    } else {
      value = finishElement.checked ? "Si" : "No";
      finish[finishElement.id] = finishElement.checked;
      finishElement.checked = false;
    }

    var td = document.createElement("td");
    td.appendChild(document.createTextNode(value));
    return td;
  });
  itemFinishes.push(finish);
  var tr = document.createElement("tr");
  for(var i=0;i<finishColumns.length;i++) {
    tr.appendChild(finishColumns[i]);
  }

  addFinishModifyButton(tr);
 
  finishesTable.appendChild(tr);
  finishesContainer.classList.remove("hide");
};

itemFinish.onkeyup = onEnter(addFinishToItem);
finishAddButton.addEventListener('click', addFinishToItem);

var editFinish = function(){
  var tr = this.parentNode.parentNode;
  var rowIndex = tr.rowIndex - 1;
  var tdShowToClient = tr.childNodes[0]; 
  var tdFinish = tr.childNodes[1];

  var showToClientText = tdShowToClient.textContent;
  var finishText = tdFinish.textContent;

  var inputTextFinish = document.createElement("input");
  inputTextFinish.type="text";
  inputTextFinish.value = finishText;
  tdFinish.textContent = "";
  tdFinish.appendChild(inputTextFinish);

  var labelForCheckBox = document.createElement("label");
  labelForCheckBox.setAttribute("for","editShowToClient"+rowIndex);
  labelForCheckBox.textContent = "Mostrar al cliente";

  var checkBoxShowToClient = document.createElement("input");
  checkBoxShowToClient.id = "editShowToClient"+rowIndex;
  checkBoxShowToClient.type = "checkbox";
  checkBoxShowToClient.checked = showToClientText==="No"?false:true;
  tdShowToClient.textContent = "";

  labelForCheckBox.appendChild(checkBoxShowToClient);
  tdShowToClient.appendChild(labelForCheckBox);

  this.textContent = "Guardar";
  this.onclick = saveEditedFinish;
  inputTextFinish.focus();
  inputTextFinish.onkeyup = onEnter(saveEditedFinish);
};

var saveEditedFinish = function(){
  var table = this.parentNode.parentNode.parentNode;
  var tr = this.parentNode.parentNode;
  var finishNumber = tr.rowIndex - 1;
  var tdShowToClient = tr.childNodes[0]; 
  var tdFinish = tr.childNodes[1]; 
  var inputShowToClient = tdShowToClient.getElementsByTagName('input')[0]; 
  var inputFinish = tdFinish.getElementsByTagName('input')[0];
  var saveButton = tr.childNodes[2].getElementsByTagName('button')[0];

  itemFinishes[finishNumber].showToClient = inputShowToClient.checked;
  itemFinishes[finishNumber].finish = inputFinish.value;

  tdShowToClient.textContent = itemFinishes[finishNumber].showToClient?"Si":"No";
  tdFinish.textContent = itemFinishes[finishNumber].finish;

  saveButton.textContent = "Modificar";
  saveButton.onclick = editFinish;
};

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
  if(estimate.workQuantity) {
    description += estimate.workQuantity + " unidades\n";
  }
  if(estimate.deliveryDelay) {
    description += estimate.deliveryDelay + " días de producción\n";
  }
  for (var i = 0; i < estimate.items.length; i++){
    var item = estimate.items[i];
    var descriptionObject = {};

    //El material debe ser material + " " + weight + "gr. " + color
    if (item.material !=null && item.material != ""){
      descriptionObject.material = item.material + " " + 
        (item.weight!=null&&item.weight!=""?(item.weight + "gr. "):"") + item.color;
        
        if(item.cutsPerSheet) {
          descriptionObject.cutsPerSheet = "Cortado en " + item.cutsPerSheet;
        }
    }
    if (item.vias != null && item.vias!="" && item.vias>1){
      descriptionObject.vias = item.vias + " vías";
    }
    if (item.pages != null && item.pages!="" && !item.pages>1){
      descriptionObject.pages = item.pages + " páginas";
    }
    if (item.inkQuantity != null && item.inkQuantity !=""){
      if(item.phases == "Simple faz"){
        descriptionObject.inkDetail = item.inkQuantity + "/0 " + item.inkDetail;
      }else{
        descriptionObject.inkDetail = item.inkQuantity + "/" + item.inkQuantity + " " + item.inkDetail;
      }
    }
    if(item.hardCoverage){
      descriptionObject.hardCoverage = "Contiene cobertura plena";
    }
    if (item.openSize != null && item.closedSize != null && item.openSize == item.closedSize){
      descriptionObject.size = item.openSize;
    } else {
      if(item.openSize != null) {
        descriptionObject.openSize = item.openSize + " (abierto)";
      }
      if(item.closedSize != null) {
        descriptionObject.closedSize = item.closedSize + " (cerrado)";
      }s
    }

    if(item.numbered){
      descriptionObject.numeration = "Numerado del " + item.numeration;
    }

    if(item.printer){
      descriptionObject.printer = item.printer;
    }
    if(item.layoutSize){
      descriptionObject.layoutSize = "Pliego " + item.layoutSize;
      if(item.quantityPerLayout){
        descriptionObject.quantityPerLayout = "Armado de a ";
      }
    }

    descriptionObject.design = item.design ? "Incluye diseño" : "No incluye diseño";
    var name = item.itemName;

    var descriptionArray = Object.keys(descriptionObject).map(function(itemKey, index) {
      var value = descriptionObject[itemKey];
      return ">" + value;
    });
    description += "\n##" +name + "\n"+ descriptionArray.join("\n")+"\n\n";
  }
  if(estimate.customerComments){
    description += "\n\n##Comentarios al cliente\n" + estimate.customerComments;
  }
  if(estimate.officeComments){
    description += "\n\n##Comentarios al taller\n" + estimate.officeComments;
  }

  if(estimate.price){
    description += "\n\n---\n\n##Total $ " + estimate.price;
  }
  if(estimate.downPayment){
    description += "\n\n---\n\n##Seña $ " + estimate.price;
  }
  if(estimate.contactName || estimate.companyName || estimate.companyAlias || estimate.rut || estimate.tel || estimate.email){
    description += "\n\n---\n\n##Datos de contacto";
    if(estimate.companyAlias){
      description += "\n>" + estimate.companyAlias;
    }
    if(estimate.contactName){
      description += "\n>" + estimate.contactName;
    }
    if(estimate.email){
      description += "\n>" + estimate.email;
    }
    if(estimate.tel){
      description += "\n>" + estimate.tel;
    }
    if(estimate.companyName){
      description += "\n>" + estimate.companyName;
    }
    if(estimate.rut){
      description += "\n>" + estimate.rut;
    }
  }
  return description;
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

itemAddSectionButton.addEventListener('click', function(){
  addItemSection.classList.toggle("hide");
});

var getTrelloCardName = function(estimate){
  return estimate.workQuantity + "x" + estimate.workType + " - " + estimate.companyAlias;
};

var createCard = function(){
  var estimate = createEstimateObjectFromForm();
  var cardToSave = {idList: listId, desc: getTrelloCardDescription(estimate), name: getTrelloCardName(estimate)};
  if(estimate.deliveryDelay){
    //TODO Agregar due date a la tarjeta
    // due: mm/dd/yyy
  }
  startLoader();
  createNewTrelloCard(t, cardToSave, function(card) {
    setTimeout(function () {
      t.set(card.id, 'shared', cardInfoKey, estimate)
        .then(function(){
          t.showCard(card.id);
          t.closeModal();
        });
    }, 1500);
  });
};

var updateCard = function() {
  startLoader();
  t.card('all')
  .then(function(card) {
    var estimate = createEstimateObjectFromForm();
    t.set('card', 'shared', cardInfoKey, estimate)
      .then(function(){
        updateTrelloCard(t, {id: card.id, desc: getTrelloCardDescription(estimate)},
          function(){
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

var addItemFinishIntoTable = function(finish){
  var tr = document.createElement("tr");
  tr.appendChild(document.createElement("td").appendChild(document.createTextNode(finish.showToClient ? "Si" : "No")));
  tr.appendChild(document.createElement("td").appendChild(document.createTextNode(finish.itemFinish)));
  addFinishModifyButton(tr);
  finishesTable.appendChild(tr);
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

      itemFinishes = item.finishes;
      for(var i=0;i<itemFinishes.length;i++){
        addItemFinishIntoTable(itemFinishes[i]);
      }
      
      var itemColumns = Object.keys(item).map(function(itemAttribute){
        var value = "";
        if(itemAttribute != "finishes") { // exclude finishes because they are shown in their own table
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
        }
      });
      for(var j=0;j<itemColumns.length;j++){
        if(itemColumns[j]){
          tr.appendChild(itemColumns[j]);
        }
      }
      itemsTable.appendChild(tr);
      addItemToVariantSelect(estimate.items, i);
    }
    itemsContainer.classList.remove("hide");

    items = estimate.items;
  }
};