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

var itemsContainer = document.getElementById('items');
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
  var itemChildren = [itemName, vias, pages, numbered, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes];

    if(numbered.checked) {
      itemChildren.push(numeration);
    }
    var item = {};

    itemChildren.map(function(itemElement){
      var value = undefined;
      if(itemElement.type !== "checkbox"){
        value = itemElement.value;
        item[itemElement.id] = itemElement.value;
      } else {
        value = itemElement.checked ? "Si" : "No";
        item[itemElement.id] = itemElement.checked;
      }

      if(value) {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(value));
        return span;
      }
    });
    items.push(item);
    for(var i=0;i<itemChildren.length;i++) {
      itemsContainer.appendChild(itemChildren[i]);
    }
});

numbered.addEventListener('click', function(){
  if(numbered.checked) {
    numerationDiv.classList.remove("hide");
  } else {
    numerationDiv.classList.add("hide");
  }
});
