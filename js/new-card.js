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

var itemAddButton = document.getElementById('itemAddButton');

var items = [];

t.render(function(){
  return;
});

itemAddButton.addEventListener('click', function(){
  var itemChildren = [itemName, vias, pages, numbered, numeration, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes];

    var item = {};

    itemChildren = itemChildren.map(function(itemElement){
      var value = undefined;
      if(itemElement.type !== "checkbox"){
        value = itemElement.value;
        item[itemElement.id] = itemElement.value;
      } else {
        value = itemElement.checked ? "Si" : "No";
        item[itemElement.id] = itemElement.checked;
      }

      if(value) {
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(value));
        return td;
      }
    });
    items.push(item);
    var tr = document.createElement("tr");
    for(var i=0;i<itemChildren.length;i++) {
      tr.appendChild(itemChildren[i]);
    }
    itemsTable.appendChild(tr);
    itemsContainer.classList.remove("hide");
});

numbered.addEventListener('click', function(){
  if(numbered.checked) {
    numerationDiv.classList.remove("hide");
  } else {
    numerationDiv.classList.add("hide");
  }
});
var createTrelloCardObject = function (estimate){
  var description = "";
  description += "#" + estimate.workType + "\n";
  description += "Cantidad: **" + trabajo.workQuantity + "**\n";
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
    var name = item.name;
    delete item.name;

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

var convertHeaderToTextInSpaniscase = function (header){
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