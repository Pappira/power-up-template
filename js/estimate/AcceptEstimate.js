
var t = TrelloPowerUp.iframe();
var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';

var selectedWorkTypeId;
var selectedWorkId;
var selectedOptions = [];
var estimate; 

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
    getEstimate(cardInfo,createWorkTypeSelectPanel);
	});
});

var createWorkTypeSelectPanel = function(currentEstimate){
  estimate = JSON.parse(JSON.stringify(currentEstimate));
  estimate.prices.sort(compareValues());
  estimate.prices.forEach(price => {
      if(price.dontShow && price.dontShow.length>0){
          price.dontShow.forEach(currentDontShow => {
              delete price[currentDontShow];
              delete estimate.work[currentDontShow];
          });
      }
      price.items.forEach(item => { 
          if (item.dontShow && item.dontShow.length>0){
              item.dontShow.forEach(currentDontShow => {
                  delete item[currentDontShow];
                  var workItem = estimate.work.items.filter(currentWorkItem => currentWorkItem.name == item.name)[0];
                  delete workItem[currentDontShow];
              });
          }
      });
  });
  var wizardForm =  document.getElementById('wizardForm');
  var wizardElement = createScreen('AcceptEstimate','Aceptar Presupuesto',estimate,nextAfterAcceptedEstimateSelect);
  if(wizardElement){
    wizardForm.appendChild(wizardElement);
  }
}

var createScreen = function(type,titulo,estimate,nextFunction){
  if (estimate.prices.length>1){
    var div = createElement('div','row setup-content',type); 
    var title = createElement('h3','','',titulo); 
    var divRow = createElement('div','row','','');
    div.appendChild(title);
    
    var divLoader = createElement('div','','loader');
    div.appendChild(divLoader);
    var index = 0;
    estimate.prices.forEach(function(price){
      var text;
      var priceText = "<strong>Cantidad: </strong>" + price.quantity + '<br>';
      var generalFinishesText = "";
      if(estimate.work.mandatoryFinishes){
        if (estimate.work.mandatoryFinishes.length>1){
          generalFinishesText = price.mandatoryFinishes.map(mandatoryFinish => mandatoryFinish.name).join(" ");
        }
      }
      priceText += "<strong>" + generalFinishesText +"</strong>" + '<br>';
      price.items.forEach(function(item){
        var originalItem = estimate.work.items.filter(currentItem => currentItem.ordinal == item.ordinal)[0];
        var itemsFinishesText  = "";
        if(originalItem.mandatoryFinishes){
          if (originalItem.mandatoryFinishes.length>1){
            itemsFinishesText = item.mandatoryFinishes.map(mandatoryFinish => mandatoryFinish.name).join(" ");
          }
        }
        var currentPriceText = ((originalItem.material && originalItem.material.length>1 && item.material)?'<strong>papel: </strong>' + item.material.name + ' '  + item.material.gr + 'gr <br>':'')
        + (((originalItem.ink.length>1 || originalItem.faces.length>1) && item.ink && item.faces)?'<strong>Tintas: </strong>' + item.ink.inksDetails +' ' + item.faces +'<br>':'')
        + ((originalItem.openedSize && originalItem.openedSize.length>1)?'<strong>Tamaño Abierto: </strong>' + item.openedSize + '<br>':'') 
        + ((originalItem.quantityOfPages.length>1 && item.quantityOfPages>1)?'<strong>Páginas: </strong>'  + item.quantityOfPages + '<br>':'')
        + ((originalItem.quantityOfSheets.length>1 && item.quantityOfSheets>1)?'<strong>Hojas: </strong>'  + item.quantityOfSheets + '<br>':'')
        + ((originalItem.quantityOfVias.length>1 && item.quantityOfVias>1)?'<strong>Vías: </strong>' + item.quantityOfVias + '<br>': '')
        + ((itemsFinishesText && itemsFinishesText.length>0)?'<strong>' + itemsFinishesText + '</strong>':'');
        if (currentPriceText && currentPriceText.length>0){
          currentPriceText = (price.items.length>1?'<p style="text-align: center;font-size: 1.3em;text-decoration: underline;margin: 0.5em;">' + originalItem.name+'</p>':'') + currentPriceText;
          priceText += currentPriceText;
        }
      });
      text = priceText + "<h6>" + 'Precio: $ ' + price.totalPrice.toLocaleString() + ' + IVA' + '</h6>';

      var card = createHTMLCard(noImage,'',text,type,index,nextFunction,true);
      divRow.appendChild(card);
      index++;
    });
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
  if (estimate.optionalFinishes && estimate.optionalFinishes.length>0){
    var possibilities = createPossibilities();
    if (possibilities != null){
      deleteWizard();
      createWizard(possibilities);
    }else{
      updateEstimateAndTrelloCard();
    }
  }else{
    updateEstimateAndTrelloCard();
  }
}

var createPossibilities = function(){
  var generalFinishesToShow = [];
  var exclude = ["name", "price", "propertiesToSelectByCustomer", "showToClient", "itemOrdinal"];
  for (var i = 0; i < estimate.optionalFinishes.length;i++){
    var possibleExtraPrice = estimate.optionalFinishes[i];
    var isPossible = true;
    var work = estimate.prices[estimate.SelectedOption];
    var item = work;
    if (possibleExtraPrice.itemOrdinal !=-1){
      item = work.items.map(currentItem => currentItem.ordinal == possibleExtraPrice.itemOrdinal)[0];
    }
    for (var prop in possibleExtraPrice) {
      if (!exclude.includes(prop)){
        if(!JSON.stringify(item[prop]).includes(JSON.stringify(possibleExtraPrice[prop]))){
          isPossible = false;
          break; 
        }
      }
    }
    if (isPossible){
      var possibility = {};
      possibility['itemId'] = i;
      possibility['values'] = possibleExtraPrice.name;
      generalFinishesToShow.push(possibility);
    }
  }
  return generalFinishesToShow;
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

  var p = createElement('p','','','','','','','','','','',content);
  if(title && title.length>0){
    var span = createElement('span','card-title activator grey-text text-darken-4','',title);
    divCardImage.appendChild(span);
  }
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

  var wizardButton = createWizardButton(1,"Terminaciones opcionales");
  divContainer.appendChild(wizardButton);
  var wizardElement = createWizardElement(1,combinations,"Terminaciones opcionales",true);
  wizardForm.appendChild(wizardElement);

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
  var extraPrices = [];
  for (var i = 0; i < selectedOptions.length;i++){
    extraPrices.push(estimate.optionalFinishes[selectedOptions[i].substr(0,selectedOptions[i].indexOf("-"))]);
  }
  estimate.selectedExtraPrices = extraPrices;
  updateCard(estimate);
 }

 var createWizardButton = function(step,name){
  var div = createElement('div','stepwizard-step'); 
  var a = createElement('a','btn ' + (step==1?'btn-primary':'btn-default') +' btn-circle','',step,'button','','','#step-'+step,(step==1?'':'disabled'));
  var p = createElement('p','','',name);
  div.appendChild(a);
  div.appendChild(p);
  return div;
}  

var createRevealCard = function(image,title,type,id,functionOnClick){
  var divCol = createElement('div','col m4','','');
  var divCard = createElement('div','card',type + '-' + id,'');
  var divCardImage = createElement('div','card-image waves-effect waves-block waves-light','','');
  var img = createElement('img','activator','','','','','','','',['src'],[image]);
  var span = createElement('span','card-title activator grey-text text-darken-4','',title);

  divCardImage.appendChild(img);
  divCardImage.appendChild(span);

  var divCardReveal = createElement('div','card-reveal','','');
  var spanReveal = createElement('span','card-title grey-text text-darken-4');
  var iClose = createElement('i','material-icons right',type + '-' + title);

  spanReveal.appendChild(iClose);
  divCardReveal.appendChild(spanReveal);
  divCard.addEventListener('click',selectOption);
  divCard.appendChild(divCardImage);
  divCard.appendChild(divCardReveal);

  divCol.appendChild(divCard);

  if (functionOnClick){
    divCard.addEventListener('click',functionOnClick)
  }
  return divCol;
}

var selectOption = function(){ 
  var elementId = $(this).attr('id');
  if(selectedOptions.indexOf(elementId) == -1){
    selectedOptions.push(elementId);
  }else{
    const index = selectedOptions.indexOf(elementId);
    if (index > -1) {
      selectedOptions.splice(index, 1);
    }
  }
}

var previuosButtonClick = function(){
  var curStep = $(this).closest(".setup-content"),
  curStepBtn = curStep.attr("id"),
  prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a");

  prevStepWizard.removeAttr('disabled').trigger('click');
}

var nextButtonClick = function(){
  var curStep = $(this).closest(".setup-content"),
    curStepBtn = curStep.attr("id"),
    nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
    curInputs = curStep.find("input[type='text'],input[type='url']"),
    isValid = true;

  $(".form-group").removeClass("has-error");
  for(var i=0; i<curInputs.length; i++){
    if (!curInputs[i].validity.valid){
      isValid = false;
      $(curInputs[i]).closest(".form-group").addClass("has-error");
    }
  }

  if (isValid)
    nextStepWizard.removeAttr('disabled').trigger('click');
};

var startFunction = function(){
  var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn'),
          allPrevBtn = $('.prevBtn');
  
    allWells.hide();
  
    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
                $item = $(this);
  
        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });  
    $('div.setup-panel div a.btn-primary').trigger('click');
  };