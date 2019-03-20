
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
    createWorkTypeSelectPanel();
	});
});

var createWorkTypeSelectPanel = function(){
  var wizardForm =  document.getElementById('wizardForm');
  var wizardElement = createScreen('AcceptEstimate','Aceptar Presupuesto',estimate,nextAfterAcceptedEstimateSelect);
  wizardForm.appendChild(wizardElement);
}

var createScreen = function(type,titulo,estimate,nextFunction){
  if (estimate.prices.length>1){
    var div = createElement('div','row setup-content',type); 
    var title = createElement('h3','','',titulo); 
    var divRow = createElement('div','row','','');
    div.appendChild(title);
    
    var divLoader = createElement('div','','loader');
    div.appendChild(divLoader);
    for (var i = 0; i < estimate.prices.length;i++){
      var price = estimate.prices[i];
      var text;
      var price = estimate['prices'][i];
      var priceText = "<strong>Cantidad: </strong>" + price.quantity + '<br>';
      for (var j = 0; j < price.items.length; j++){
        var item =  price.items[j];
        var originalItem = estimate['items'][item.id];
        priceText += ( price.items.length>1?"<h3>" + originalItem.name+'</h3>':'') + (originalItem.materials.length>1?'<strong>papel: </strong>' + item.materials.paper + ' '  + item.materials.gr + 'gr <br>':'')
        + ((originalItem.inks.length>1 || originalItem.faces.length>1)?'<strong>Tintas: </strong>' + item.inks.inksQuantity +' ' + item.faces +'<br>':' ')
        + (originalItem.openedSize.length>1?'<strong>Tamaño Abierto: </strong>' + item.openedSize + '<br>':'') 
        + ((originalItem.quantityOfPages.length>1 && item.quantityOfPages>1)?'<strong>Páginas: </strong>'  + item.quantityOfPages + '<br>':'')
        + ((originalItem.quantityOfVias.length>1 && item.quantityOfVias>1)?'<strong>Vías: </strong>' + item.quantityOfVias + '<br>': '');
      }
      text = priceText + "<h6>" + 'Precio: $ ' + price.price + ' + IVA' + '</h6>';

      var card = createHTMLCard(noImage,estimate.name,text,type,i,nextFunction,true);
      divRow.appendChild(card);
    }
    div.appendChild(divRow);
    return div;
  }else{
    nextAfterAcceptedEstimateSelect();
  }
}

var nextAfterAcceptedEstimateSelect = function(){
  if (estimate.prices.length>1){
    var elementId = $(this).attr('id');
    var id = elementId.substring(elementId.indexOf('-')+1);
    estimate["SelectedOption"] = id;
  }else{
    estimate["SelectedOption"] = 0;
  }
  if (estimate.optionalFinishesPrices && estimate.optionalFinishesPrices.length>0){
      var possibilities = createPossibilities();
      deleteWizard();
      createWizard(possibilities);

  }
}

var createPossibilities = function(){
  var generalFinishesToShow = [];
    var itemFinishesToShow = [];
    for (var i = 0; i < estimate.optionalFinishesPrices.length;i++){
      var possibleExtraPrice = estimate.optionalFinishesPrices[i];
      var isPossible = true;
      var work = estimate;
      for (var prop in possibleExtraPrice) {
        if (prop != "optionalFinishes" && prop !="items" && prop !="workId"){
          if(!JSON.stringify(work[prop]).includes(JSON.stringify(possibleExtraPrice[prop]))){
            isPossible = false;
            break;
          }
        }else if(prop == "items"){
          for (var j = 0; j < possibleExtraPrice.items.length; j++){
            var priceItem = possibleExtraPrice.items[j];
            var workItem = work.items[j];
            for (var itemProp in priceItem) {
              if (itemProp != "optionalFinishes" && itemProp!="id"){
                if(!JSON.stringify(workItem[itemProp]).includes(JSON.stringify(priceItem[itemProp]))){
                  isPossible = false;
                  break;
                }
              }
            }
          }
        }
      }
      if (isPossible){
        for(var j = 0; j <possibleExtraPrice.optionalFinishes.length;j++ ){
          var possibility = {};
          possibility['itemId'] = i + "-" + j +"-general";
          possibility['values'] = possibleExtraPrice.optionalFinishes[j].finish;
          generalFinishesToShow.push(possibility);
        }
        for(var j = 0; j < possibleExtraPrice.items.length;j++){
          if(possibleExtraPrice.items[j]){
            for (var k = 0; k < possibleExtraPrice.items[j].optionalFinishes.length;k++){
              var possibility = {};
              possibility['itemId'] = i + "-" + j + "-" + k;
              possibility['values'] = possibleExtraPrice.items[j].optionalFinishes[k].finish;
              if(!itemFinishesToShow[j] || itemFinishesToShow[j].length==0){
                itemFinishesToShow[j] = [];
              }
              itemFinishesToShow[j].push(possibility);
            }
          }
        }
      }
    }
    
    return [generalFinishesToShow,itemFinishesToShow];
}

var deleteWizard = function(){
  var wizardForm =  document.getElementById('wizardForm');
  while(wizardForm.firstChild){
    wizardForm.removeChild(wizardForm.firstChild);
  }
  $(".stepwizard-step").remove();
}

var createHTMLCard = function(image,title,content,type,id,functionOnClick,blackText){
  var divCol = createElement('div','col m4','','');
  var divCard = createElement('div','card',type + '-' + id,'');
  var divCardImage = createElement('div','card-content ' + (blackText?'':'white-text'),'','');
  var span = createElement('span','card-title activator grey-text text-darken-4','',title);
  var p = createElement('p','','','','','','','','','','',content);
  divCardImage.appendChild(span);
  divCardImage.appendChild(p);
  divCard.appendChild(divCardImage);
  divCol.appendChild(divCard);
  if (functionOnClick){
    divCard.addEventListener('click',functionOnClick)
  }
  return divCol;
}

var createWizard = function(combinations){
  var divContainer = createElement('div','stepwizard-row setup-panel','wizardRow');
  var wizardForm =  document.getElementById('wizardForm');

  var wizardButton = createWizardButton(1,"Terminaciones generales opcionales");
  divContainer.appendChild(wizardButton);
  var wizardElement = createWizardElement(1,combinations[0],"Terminaciones generales opcionales");
  wizardForm.appendChild(wizardElement);

  
  for(var i = 0; i < combinations[1].length; i++){
    var combination = combinations[1][i];
    var wizardButton = createWizardButton(i+2,"Terminaciones de " + work.items[i].name + " opcionales");
    divContainer.appendChild(wizardButton);
    var wizardElement = createWizardElement(1,combination,"Terminaciones de " + work.items[i].name + " opcionales");
    wizardForm.appendChild(wizardElement);
  }

  var wizardContainer = document.getElementById('wizardContainer');
  wizardContainer.appendChild(divContainer);
  startFunction();
}


var createWizardElement = function(step,combinations,name,last){
  var div = createElement('div','setup-content','step-' + step); 
  var divRow = createElement('div','row'); 
  var title = createElement('h3','','',name); 
  divRow.appendChild(title);

  for (var i = 0; i < combinations.length;i++){
    var value = combinations[i].values+'';
    var card = createRevealCard(noImage,value,combinations[i].itemId,combinations[i].itemId);
    divRow.appendChild(card);
  }
 
  var divButton = createElement('div','div-button'); 

  if(step!=1){
    var buttonPreviuos = createFormButton(step,"",false);
    divButton.appendChild(buttonPreviuos);
  }
  if(!last){
    var buttonNext = createFormButton(step,"",true);
    divButton.appendChild(buttonNext);
  }else{
    var buttonNext = createFormButton(step,'Finalizar',true,true);
    divButton.appendChild(buttonNext);
  }
  div.appendChild(divRow);
  div.appendChild(divButton);

  return div;
}

var createFormButton = function(step,text,next,finish){
  var button;
   if(!finish){
     button = createElement('button','btn ' + (next?'nextBtn ':'prevBtn ') + 
       'btn-lg ' + (next?'pull-right ':'pull-left '),'',(next?'Avanzar a ' + text:'Volver a ' + text),'button');
       next?button.addEventListener('click',nextButtonClick):button.addEventListener('click',previuosButtonClick);
      }else{
       var divButton = createElement('div');
       var thisButton = createElement('button','btn ' +'nextBtn ' + 'btn-lg ' + 'pull-right ','',text,'button');
       thisButton.addEventListener('click',updateEstimateAndTrelloCard);
       var divLoader = createElement('div','','loader');
       divButton.appendChild(thisButton);
       divButton.appendChild(divLoader);
       button = divButton;
   }
   return button;
 } 

 var updateEstimateAndTrelloCard = function(){
   console.log("holaaa");
 }

 var createWizardButton = function(step,name){
  var div = createElement('div','stepwizard-step'); 
  var a = createElement('a','btn ' + (step==1?'btn-primary':'btn-default') +' btn-circle','',step,'button','','','#step-'+step,(step==1?'':'disabled'));
  var p = createElement('p','','',name);
  div.appendChild(a);
  div.appendChild(p);
  return div;
}  