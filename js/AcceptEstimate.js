
var t = TrelloPowerUp.iframe();
var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';

var selectedWorkTypeId;
var selectedWorkId;
var selectedOptions = {};
var estimate; 

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
	  estimate = cardInfo; 
    createWizard(estimate);
	});
});

var createWorkTypeSelectPanel = function(){
  var wizardForm =  document.getElementById('wizardForm');
  var wizardElement = createScreen('AcceptEstimate','Aceptar Presupuesto',estimate,nextAfterAcceptedEstimateSelect);
  wizardForm.appendChild(wizardElement);
}

var createScreen = function(type,titulo,estimate,nextFunction){
  var div = createElement('div','row setup-content',type); 
  var title = createElement('h3','','',titulo); 
  var divRow = createElement('div','row','','');
  div.appendChild(title);
  for (var i = 0; i < estimate.prices.length;i++){
    var price = estimate.prices[i];
    var text;
    if(estimate['prices']){
      for (var i = 0; i < estimate['prices'].length;i++){
        var price = estimate['prices'][i];
        var priceText = "<strong>Cantidad: </strong>" + price.quantity + '<br>';
        for (var j = 0; j < price.items.length; j++){
          var item =  price.items[j];
          var originalItem = estimate['items'][item.id];
          priceText += ( price.items.length>1?"<h3>" + originalItem.name+'</h3>':'') + (originalItem.materials.length>1?'<strong>papel: </strong>' + item.materials.paper + ' '  + item.materials.gr + 'gr <br>':'')
          + (originalItem.inksQuantity.length>1?'<strong>Tintas: </strong>' + item.inksQuantity + (originalItem.faces.length>1?' ' + item.faces+' ':'')  +'<br>':' ')
          + (originalItem.openedSize.length>1?'<strong>Tamaño Abierto: </strong>' + item.openedSize + '<br>':'') 
          + ((originalItem.quantityOfPages.length>1 && item.quantityOfPages>1)?'<strong>Páginas: </strong>'  + item.quantityOfPages + '<br>':'')
          + ((originalItem.quantityOfVias.length>1 && item.quantityOfVias>1)?'<strong>Vías: </strong>' + item.quantityOfVias + '<br>': '');
        }
        text += "<h4>" + (priceText.length>0?'**' + priceText + ': **$ ':'**Precio: **$ ') + price.price + ' + IVA' + '</h4>';
      }
    }

    var card = createHTMLCard(noImage,estimate.name,text,type,estimate.id,nextFunction);
    divRow.appendChild(card);
  }
  div.appendChild(divRow);
  return div;
}

var nextAfterAcceptedEstimateSelect = function(){
  var elementId = $(this).attr('id');
  var id = elementId.substring(elementId.indexOf('-')+1);
  selectedWorkTypeId = id;
  var possibleWorks = [];
  var possibleOptions = [];
  for (var i = 0; i < works.length;i++){
    if (works[i].workTypeId == id){
      possibleWorks.push(works[i]);
      possibleOptions.push(works[i].workName);
    }
  }
  deleteWizard();
  createWorkSelectPanel(possibleWorks);
}

var createHTMLCard = function(image,title,content,type,id,functionOnClick){
  var divCol = createElement('div','col m4','','');
  var divCard = createElement('div','card',type + '-' + id,'');
  var divCardImage = createElement('div','card-content white-text','','');
  var span = createElement('span','card-title activator grey-text text-darken-4','',title);
  var p = createElement('p','','',content)
  divCardImage.appendChild(span);
  divCardImage.appendChild(p);
  divCard.appendChild(divCardImage);
  divCol.appendChild(divCard);
  if (functionOnClick){
    divCard.addEventListener('click',functionOnClick)
  }
  return divCol;
}