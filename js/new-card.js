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

t.render(function(){
  return;
});

itemAddButton.addEventListener('click', function(){
  var itemChild = [itemName, vias, pages, numbered, numeration, openSize, closedSize, material, 
    weight, color, inkQuantity, inkDetail, phases, design, finishes]
    .map(function(itemElement){
      var value = undefined;
      if(itemElement.value){
        value = itemElement.value;
      } else if(itemElement.checked !== undefined) {
        value = itemElement.checked ? "Si" : "No";
      }

      if(value) {
        return document.createElement("span").appendChild(document.createTextNode(value));
      }
    }).join('');
  itemsContainer.appendChild(itemChild);
});
