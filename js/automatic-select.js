var t = TrelloPowerUp.iframe();
var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';

var selectedWorkTypeId;
var selectedWorkId;
var selectedOptions = {};
var haveToCheckIncidences = true;
var work;
var originalWork;

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
      createWorkTypeSelectPanel();
	});
});

var createWorkTypeSelectPanel = function(){
  var wizardForm =  document.getElementById('wizardForm');
  var wizardElement = createScreen('workType','Tipo de trabajo',workTypes,nextAfterWorkTypeSelect);
  wizardForm.appendChild(wizardElement);
}

var createWorkSelectPanel = function(works){
  var wizardForm =  document.getElementById('wizardForm');
  var wizardElement = createScreen('work','Trabajo',works,nextAfterWorkSelect);
  wizardForm.appendChild(wizardElement);
}

var createScreen = function(type,titulo,possibilities,nextFunction){
  var div = createElement('div','row setup-content',type); 
  var title = createElement('h3','','',titulo); 
  var divRow = createElement('div','row','','');
  div.appendChild(title);
  for (var i = 0; i < possibilities.length;i++){
    var possibility = possibilities[i];
    var card = createHTMLCard(possibility.image,possibility.name,type,possibility.id,nextFunction);
    divRow.appendChild(card);
  }
  div.appendChild(divRow);
  return div;
}

var nextAfterWorkTypeSelect = function(){
  var elementId = $(this).attr('id');
  var id = elementId.substring(elementId.indexOf('-')+1);
  selectedWorkTypeId = id;
  var possibleWorks = [];
  for (var i = 0; i < works.length;i++){
    if (works[i].workTypeId == id){
      possibleWorks.push(works[i]);
    }
  }
  deleteWizard();
  createWorkSelectPanel(possibleWorks);
}

var deleteWizard = function(){
  var wizardForm =  document.getElementById('wizardForm');
  while(wizardForm.firstChild){
    wizardForm.removeChild(wizardForm.firstChild);
  }
  $(".stepwizard-step").remove();
}

var createWizard = function(combinations){
  var divContainer = createElement('div','stepwizard-row setup-panel','wizardRow');
  var wizardForm =  document.getElementById('wizardForm');
  for(var i = 0; i < combinations.length; i++){
    var combination = combinations[i];
    var wizardButton = createWizardButton(i+1,combination.name);
    divContainer.appendChild(wizardButton);
    var wizardElement = createWizardElement(i+1,combination,i==combinations.length-1?true:false,combinations);
    wizardForm.appendChild(wizardElement);
  }
  var wizardContainer = document.getElementById('wizardContainer');
  wizardContainer.appendChild(divContainer);
  startFunction();
}

var createWizardElement = function(step,combination,last,combinations){
  var div = createElement('div','setup-content','step-' + step); 
  var divRow = createElement('div','row'); 
  var title = createElement('h3','','',combination.itemName + ' ' + combination.name+''); 
  divRow.appendChild(title);

  for (var i = 0; i < combination.values.length;i++){
    var value = combination.values[i]+'';
    if (typeof combination.values[i] == 'object'){
      if(combination.name == 'optionalFinishes'){
        value = combination.values[i].finish;
      }else if(combination.name.includes('mandatoryFinishGroups')){
        
        value = combination.values[i].finish;
      }else if (combination.name == 'materials'){
        value = combination.values[i].paper + ' ' + combination.values[i].gr + 'gr.';
      }else if (combination.name == 'inks'){
            value = combination.values[i].inksQuantity + ' / ' + combination.values[i].inksDetails; 
      }
    }
    var card = createRevealCard(noImage,value,combination.itemId + '-' + combination.name,i);
    divRow.appendChild(card);
  }
 
  var divButton = createElement('div','div-button'); 

  if(step!=1){
    var buttonPreviuos = createFormButton(step,combinations[step-2].name,false);
    divButton.appendChild(buttonPreviuos);
  }
  if(!last){
    var buttonNext = createFormButton(step,combinations[step].name,true);
    divButton.appendChild(buttonNext);
  }else{
    var buttonNext = createFormButton(step,'Finalizar',true,true);
    divButton.appendChild(buttonNext);
  }
  div.appendChild(divRow);
  div.appendChild(divButton);

  return div;
}

var nextAfterWorkSelect = function(){
  var elementId = $(this).attr('id');
  var id = elementId.substring(elementId.indexOf('-')+1);
  selectedWorkId = id;
  work = works[id];
  originalWork = works[id];
  var possibilities = createPossibilities(work);

  deleteWizard();
  createWizard(possibilities);
}

var createPossibilities = function(work){
  var possibilities = [];
  for(var attr in work){
    if(typeof work[attr] == 'object' && attr != "mandatoryFinishGroups"){
      if((work[attr].length > 1) || (attr == "optionalFinishes" && work[attr].length >0)){
        if (attr != 'items'){
          var possibility = {};
          possibility['itemId'] = -1;
          possibility['itemName'] = 'general';
          possibility['name'] = attr;
          possibility['values'] = work[attr];
          possibilities.push(possibility);
        }else{
          var items = work.items;
          for (var i = 0; i < items.length;i++){
            var item = items[i];
            for(var itemAttr in item){
              if(typeof item[itemAttr] == 'object' && itemAttr != "mandatoryFinishGroups"){
                if ((item[itemAttr].length > 1) || (itemAttr == "optionalFinishes" && work[attr].length >0)){
                  var possibility = {};
                  possibility['itemId'] = i;
                  possibility['itemName'] = item.name;
                  possibility['name'] = itemAttr;
                  possibility['values'] = item[itemAttr];
                  possibilities.push(possibility);
                }
              }else if(itemAttr == "mandatoryFinishGroups"){
                for (var j = 0; j < item[itemAttr].length ; j++){
                    var possibility = {};
                    possibility['itemId'] = i;
                    possibility['itemName'] =  item.name;
                    possibility['name'] = itemAttr + " // " + j;
                    possibility['values'] = item[itemAttr][j].finishes;
                    possibilities.push(possibility);
                }
              }
            }
          }
        }
      }
    }else if(attr == "mandatoryFinishGroups"){
      for (var i = 0; i < work[attr].length ; i++){
          var possibility = {};
          possibility['itemId'] = -1;
          possibility['itemName'] = 'general';
          possibility['name'] = attr + " // " + i;
          possibility['values'] = work[attr][i].finishes;
          possibilities.push(possibility);
      }
    }
  }

  
  return possibilities;
}

var selectOption = function(){ 
  var elementId = $(this).attr('id');
  var item;
  if (elementId.charAt(0)=='-'){
    item = -1;
    elementId = elementId.substring(3);
  }else{
    var item = elementId.substring(0,elementId.indexOf('-'));
    elementId = elementId.substring(elementId.indexOf('-')+1);
  }
  var name = elementId.substring(0,elementId.indexOf('-'));
  var value = parseInt(elementId.substring(elementId.indexOf('-')+1));

  if (!selectedOptions[item]){
    selectedOptions[item] = {};
  }
  if (selectedOptions[item][name]){
    if(selectedOptions[item][name].indexOf(value) == -1){
      selectedOptions[item][name].push(value);
    }else{
      removeItem = value;
      selectedOptions[item][name] = jQuery.grep(selectedOptions[item][name],function(value1) {
        return value1 != removeItem;
      });
    }
  }else{
    selectedOptions[item][name] = [value];
  }
  checkIncidences(this,item,name,value);
}

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

var checkIncidences = function(element,currentItem,currentName,currentValue){
  
  if(haveToCheckIncidences){
    var currentPositionText = element.parentElement.parentElement.parentElement.getElementsByTagName("h3")[0].innerText;
    var currentElementHaveIncidences = false;
    var item = work.items[currentItem];
    if (currentItem == -1){
      item = work;
    }  
    var currentElement;
    if (currentName.includes("//")){
      currentElement = item[currentName.split(" // ")[0]][currentName.split(" // ")[1]].finishes[currentValue];
    }else{
      currentElement = item[currentName][currentValue];
    }
    if(currentElement.incidences){
      currentElementHaveIncidences = true;
    }
    work = JSON.parse(JSON.stringify(originalWork)); 

    for (var itemId in selectedOptions) {
      for (var name in selectedOptions[itemId]) {
          for (var i = 0; i < selectedOptions[itemId][name].length;i++){
            var item = work.items[itemId];
            if (itemId == -1){
              item = work;
            }  
            var currentElement;
            if (name.includes("//")){
              currentElement = item[name.split(" // ")[0]][name.split(" // ")[1]].finishes[selectedOptions[itemId][name][i]];
            }else{
              currentElement = item[name][i];
            }
            if(currentElement && currentElement.incidences){
              for (var i = 0; i < currentElement.incidences.length;i++){
                var incidence = currentElement.incidences[i];
                if (incidence.itemId==-1){
                  if (incidence.action == 'add'){
                    for (var j = 0; j < incidence.values.length;j++){
                      if(!work[incidence.type].includes(incidence.values[j])){
                        work[incidence.type].push(incidence.values[j]);
                      }
                    }
                  }else if(incidence.action == 'replace'){
                    work[incidence.type] = incidence.values;
                  }
                }else{
                  if (incidence.action == 'add'){
                    for (var j = 0; j < incidence.values.length;j++){
                      if(!work.items[incidence.itemId][incidence.type].includes(incidence.values[j])){
                        work.items[incidence.itemId][incidence.type].push(incidence.values[j]);
                      }
                    }
                  }else if(incidence.action == 'replace'){
                    work.items[incidence.itemId][incidence.type] = incidence.values;
                  }
                }
              }
            }
          }
        }
      }
      if(currentElementHaveIncidences){
        var possibilities = createPossibilities(work);
        deleteWizard();
        createWizard(possibilities);
        var allH3 = document.getElementsByTagName("h3")
        var currentPositionElement;
        for (var i = 0; i < allH3.length;i++){
          if(allH3[i].innerText == currentPositionText){
            currentPositionElement = allH3[i];
            break;
          }
        }
        currentPositionElement = $('a[href="#' + currentPositionElement.parentElement.parentElement.getAttribute("id") + '"]')[0];
        checkAlreadySelectedPossibilities(currentPositionElement);
      }

    }
  } 

var checkAlreadySelectedPossibilities = function(currentPosition){
  haveToCheckIncidences = false;
  var lastSelectedOptions = selectedOptions;
  selectedOptions = {};
  for (var itemId in lastSelectedOptions) {
    for (var name in lastSelectedOptions[itemId]) {
      for (var i = 0; i < lastSelectedOptions[itemId][name].length;i++){
        var id = itemId + "-" + name + "-" + lastSelectedOptions[itemId][name][i] ;
        var htmlItem = document.getElementById(id);
        if(htmlItem){
          eventFire(htmlItem.getElementsByTagName('span')[0], 'click');
        }
      }
    }
  }
  eventFire(currentPosition, 'click');
  haveToCheckIncidences = true;
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

var createHTMLCard = function(image,title,type,id,functionOnClick){
  var divCol = createElement('div','col m4','','');
  var divCard = createElement('div','card',type + '-' + id,'');
  var divCardImage = createElement('div','card-image waves-effect waves-block waves-light','','');
  var img = createElement('img','activator','','','','','','','',['src'],[image]);
  var span = createElement('span','card-title activator grey-text text-darken-4','',title);

  divCardImage.appendChild(img);
  divCardImage.appendChild(span);
  divCard.appendChild(divCardImage);
  divCol.appendChild(divCard);
  if (functionOnClick){
    divCard.addEventListener('click',functionOnClick)
  }
  return divCol;
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

var createWizardButton = function(step,name){
  var div = createElement('div','stepwizard-step'); 
  var a = createElement('a','btn ' + (step==1?'btn-primary':'btn-default') +' btn-circle','',step,'button','','','#step-'+step,(step==1?'':'disabled'));
  var p = createElement('p','','',name);
  div.appendChild(a);
  div.appendChild(p);
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
       thisButton.addEventListener('click',createEstimateAndTrelloCard2);
       var divLoader = createElement('div','','loader');
       divButton.appendChild(thisButton);
       divButton.appendChild(divLoader);
       button = divButton;
   }
   return button;
 } 

var checkMandatoryFieldsSelected = function(){
  var possibilities = createPossibilities(work);
  var message = "";
  for (var i = 0; i < possibilities.length; i++){
    if (!(selectedOptions && selectedOptions[possibilities[i].itemId] && selectedOptions[possibilities[i].itemId][possibilities[i].name] && selectedOptions[possibilities[i].itemId][possibilities[i].name].length >=1)){
      if(possibilities[i].name.indexOf('optional')==-1){
        message += possibilities[i].itemName + " " + possibilities[i].name +  '\n';
      }
    }
  }
  return message;
}

var createEstimateAndTrelloCard = function(){
  var message = checkMandatoryFieldsSelected();
  if(message.length > 0){
    window.alert('Debe completar todas las opciones solicitadas \n' + message);
  }else{
    var estimate = {};
    //var work = works[selectedWorkId];
    if (work.clossedSizes.length > 1){
      work.clossedSize = cutArray(work.clossedSize,selectedOptions[-1].clossedSize[0]);
    }else{
      work.clossedSize = work.clossedSizes[0];
    }
    if (work.quantities.length > 1){
      work.quantity =  cutArray(work.quantities,selectedOptions[-1].quantities);
    }else{
      work.quantity = work.quantities;
    }
    if(work.mandatoryFinishGroups){
      for(var i = 0; i < work.mandatoryFinishGroups.length;i++){
        work.mandatoryFinishGroups[i].finishes = cutArray(work.mandatoryFinishGroups[i].finishes,selectedOptions[-1]["mandatoryFinishGroups " + "// " + i]);
      }
    }
    if (work.optionalFinishes){
      work.optionalFinishes = cutArray(work.optionalFinishes,selectedOptions[-1].optionalFinishes);
    }
   // work.finishes = cutArray(work.finishes,selectedOptions[-1].finishes);
    for (var i = 0; i < work.items.length;i++){
      if (work.items[i].quantityOfPages.length>1){
          work.items[i].quantityOfPages = cutArray(work.items[i].quantityOfPages,selectedOptions[i].quantityOfPages);
      }
      if(work.items[i].materials.length>1){
          work.items[i].materials = cutArray(work.items[i].materials,selectedOptions[i].materials);
      }
      if(work.items[i].inks.length>1){
          work.items[i].inks = cutArray(work.items[i].inks,selectedOptions[i].inks);
      }
      if(work.items[i].faces.length>1){
          work.items[i].faces = cutArray(work.items[i].faces,selectedOptions[i].faces);
      }
      if(work.items[i].openedSize.length>1){
          work.items[i].openedSize = cutArray(work.items[i].openedSize,selectedOptions[i].openedSize);
      }
      if(work.items[i].mandatoryFinishGroups){
        for(var j = 0; j < work.items[i].mandatoryFinishGroups.length;j++){
          work.items[i].mandatoryFinishGroups[j].finishes = cutArray(work.items[i].mandatoryFinishGroups[j].finishes,selectedOptions[i]["mandatoryFinishGroups " + "// " + j]);
        }
      }
      if (work.items[i].optionalFinishes){
        work.items[i].optionalFinishes = cutArray(work.items[i].optionalFinishes,selectedOptions[-1].optionalFinishes);
      }
    }
    work['prices'] = [];
    var allCombinations = getCombinations(work);
    
    possiblePrices = prices.filter(function(v, i) {
      return (v.workId == work.id);
    })

    for (var i = 0; i < allCombinations.length;i++){
      var currentCombination = allCombinations[i];
      var quantity = currentCombination.quantity;
      var generalMandatoryFinishGroups = currentCombination.mandatoryFinishGroups;

      if(generalMandatoryFinishGroups){
        for(var k = 0; k < generalMandatoryFinishGroups.length;k++){
          delete generalMandatoryFinishGroups[k].finishes.incidences;
        }
      }

      currentPossiblePrices = possiblePrices.filter(function(v, i) {
        return (v.quantity == quantity && JSON.stringify(v.mandatoryFinishGroups) == JSON.stringify(generalMandatoryFinishGroups));
      })



      for (var j = 0; j < currentCombination.items.length; j++){
        var currentItem = currentCombination.items[j];
        var pages = currentItem.pages;
        var inksQuantity = currentItem.inksQuantity;
        var inksDetails = currentItem.inksDetails;
        var openedSize = currentItem.openedSize;
        var faces = currentItem.faces;
        var paper = currentItem.paper;
        var gr = currentItem.gr;
        var vias = currentItem.quantityOfVias;
        var mandatoryFinishGroups = currentItem.mandatoryFinishGroups;
        if(mandatoryFinishGroups){
          for(var k = 0; k < mandatoryFinishGroups.length;k++){
            delete mandatoryFinishGroups[k].finishes.incidences;
          }
        }
        currentPossiblePrices = currentPossiblePrices.filter(function(v, i) {
          return (v.items[j].quantityOfPages == pages && v.items[j].inks.inksQuantity == inksQuantity && 
            v.items[j].inks.inksDetails == inksDetails && v.items[j].openedSize == openedSize && 
            v.items[j].faces ==  faces && v.items[j].materials.paper == paper && 
            v.items[j].materials.gr == gr && v.items[j].quantityOfVias == vias &&
            JSON.stringify(v.items[j].mandatoryFinishGroups) == JSON.stringify(mandatoryFinishGroups));
        })
      }
      work.prices.push(currentPossiblePrices[0]);
    }
    var possibleExtraPrices = extraPrices.filter(function(v, i) {
      return (v.workId == work.id);
    });

 
    for(var i = 0; i < possibleExtraPrices.length;i++){
      var possibleExtraPrice = possibleExtraPrices[i];
      var isPossible = true;
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
        if (!(work["extraPrices"] && work["extraPrices"].length > 0)){
          work["extraPrices"] = [];
        }
        //tengo que buscar los extra prices que quiero, segun las terminaciones, lo que se hasta ahora es que cumple con las cualidades del trabajo
        var cutPossibleExtraPrice = JSON.parse(JSON.stringify(possibleExtraPrice)); 
        var indexToPreserve = [];
        for (var j = 0; j < work.optionalFinishes.length;j++){
          for (var k = 0; k < cutPossibleExtraPrice.optionalFinishes.length; k++){
            if(work.optionalFinishes[j].finish == cutPossibleExtraPrice.optionalFinishes[k].finish){
              indexToPreserve.push(k);
              break; 
            }
          }
        }
        cutPossibleExtraPrice.optionalFinishes = cutArray(cutPossibleExtraPrice.optionalFinishes,indexToPreserve);
        for(var j= 0; j < work.items.length;j++){
          indexToPreserve = [];
          var currentWorkExtraPriceItem = work.items[j];
          var currentExtraPriceItem;
          for (var k = 0; k < cutPossibleExtraPrice.items.length;k++){
            if(currentWorkExtraPriceItem.id == cutPossibleExtraPrice.items[k].id){
              currentExtraPriceItem = cutPossibleExtraPrice.items[k];
              break;
            }
          }
          
          if(currentWorkExtraPriceItem.optionalFinishes && currentExtraPriceItem.optionalFinishes){
            for (var k = 0; k < currentWorkExtraPriceItem.optionalFinishes.length;k++){
              for (var q = 0; q < currentExtraPriceItem.optionalFinishes.length;q++){
                if(currentWorkExtraPriceItem.optionalFinishes[k].finish == currentExtraPriceItem.optionalFinishes[q].finish){
                  indexToPreserve.push(q);
                  break; 
                }
              }
            }
          }
          if(indexToPreserve && indexToPreserve.length >0){       
            cutPossibleExtraPrice.items[j].optionalFinishes = cutArray(cutPossibleExtraPrice.items[j].optionalFinishes,indexToPreserve);
          }
        }
        if(!(work["optionalFinishesPrices"] && work["optionalFinishesPrices"].length>0)){
          work["optionalFinishesPrices"] = [];
        }
        work["optionalFinishesPrices"].push(cutPossibleExtraPrice);
      }
    }

    estimate = work;
    delete estimate['image'];
    delete estimate['quantities'];
    delete estimate['clossedSizes'];
    createCard(estimate);
    return work;
  }
}

var getValueFromObjectByCompleteReference = function(currentObjectProp, object){

  var props = currentObjectProp.split('.');
  var currentObject = JSON.parse(JSON.stringify(object));
  for (var h=0; h < props.length;h++){
    currentObject = getValueFromObjectByReferences(currentObject, props[h]);
  }
  return currentObject;
}

var getValueFromObjectByReferences = function(object, reference){
  reference = reference.split("+");
  var returnValue = [];
  for (var i = 0; i < reference.length;i++){
    returnValue.push(getValueFromObjectByReference(JSON.parse(JSON.stringify(object)),reference[i]));
  }
  if(returnValue.length>1){
    return returnValue.join(' ');
  }else{
    return returnValue[0];
  }
}

var getValueFromObjectByReference = function(object, reference){
  if(reference.indexOf("[")>-1){
    var index = reference.substring(reference.indexOf("[")+1, reference.indexOf("]"));
    var reference = reference.substring(0,reference.indexOf("["));
    return object[reference][index];
  }else{    
    return object[reference];
  }

}

var filterPrices = function(currentCombination,itemNumber){

  var generalPrices = prices2.filter(function(v, i) {
    return (v.item == itemNumber);
  })
  
  var checks = generalPrices[0].toCheck.map(a => a.checkAttribute);

  for (var t = 0; t < checks.length;t++){
    generalPrices = generalPrices.filter(function(v, i) {
      var insideCurrentWork = getValueFromObjectByCompleteReference(checks[t], JSON.parse(JSON.stringify(currentCombination)));

      var priceToCheckValue = v.toCheck.filter(
        function(toCheck){
          return toCheck.checkAttribute == checks[t];
        })[0].value;

      if(insideCurrentWork!=priceToCheckValue){
        return false;       
      }
      return true;
    });
  }
  return generalPrices;
}

var createEstimateAndTrelloCard2 = function(){
  var message = checkMandatoryFieldsSelected();
  if(message.length > 0){
    window.alert('Debe completar todas las opciones solicitadas \n' + message);
  }else{
    if (work.clossedSizes.length > 1){
      work.clossedSize = cutArray(work.clossedSize,selectedOptions[-1].clossedSize[0]);
    }else{
      work.clossedSize = work.clossedSizes[0];
    }
    if (work.quantities.length > 1){
      work.quantity =  cutArray(work.quantities,selectedOptions[-1].quantities);
    }else{
      work.quantity = work.quantities;
    }
 
    if(work.mandatoryFinishGroups){
      for(var i = 0; i < work.mandatoryFinishGroups.length;i++){
        work.mandatoryFinishGroups[i].finishes = cutArray(work.mandatoryFinishGroups[i].finishes,selectedOptions[-1]["mandatoryFinishGroups " + "// " + i]);
      }
    }
    if (work.optionalFinishes){
      work.optionalFinishes = cutArray(work.optionalFinishes,selectedOptions[-1].optionalFinishes);
    }
   // work.finishes = cutArray(work.finishes,selectedOptions[-1].finishes);
    for (var i = 0; i < work.items.length;i++){
      if (work.items[i].quantityOfPages.length>1){
          work.items[i].quantityOfPages = cutArray(work.items[i].quantityOfPages,selectedOptions[i].quantityOfPages);
      }
      if(work.items[i].materials.length>1){
          work.items[i].materials = cutArray(work.items[i].materials,selectedOptions[i].materials);
      }
      if(work.items[i].inks.length>1){
          work.items[i].inks = cutArray(work.items[i].inks,selectedOptions[i].inks);
      }
      if(work.items[i].faces.length>1){
          work.items[i].faces = cutArray(work.items[i].faces,selectedOptions[i].faces);
      }
      if(work.items[i].openedSize.length>1){
          work.items[i].openedSize = cutArray(work.items[i].openedSize,selectedOptions[i].openedSize);
      }
      if(work.items[i].mandatoryFinishGroups){
        for(var j = 0; j < work.items[i].mandatoryFinishGroups.length;j++){
          work.items[i].mandatoryFinishGroups[j].finishes = cutArray(work.items[i].mandatoryFinishGroups[j].finishes,selectedOptions[i]["mandatoryFinishGroups " + "// " + j]);
        }
      }
      if (work.items[i].optionalFinishes){
        work.items[i].optionalFinishes = cutArray(work.items[i].optionalFinishes,selectedOptions[i].optionalFinishes);
      }
    }
    work.prices = [];
    
    var allCombinations = getCombinations(work);
    
    /*possiblePrices = prices.filter(function(v, i) {
      return (v.workId == work.id);
    })*/

    for (var i = 0; i < allCombinations.length;i++){
      var currentCombination = allCombinations[i];
      var quantity = currentCombination.quantity;
      var generalMandatoryFinishGroups = currentCombination.mandatoryFinishGroups;

      if(generalMandatoryFinishGroups){
        for(var k = 0; k < generalMandatoryFinishGroups.length;k++){
          delete generalMandatoryFinishGroups[k].finishes.incidences;
        }
      }
      var priceFiltered = [];
      for (var i = -1; i < currentCombination.items.length;i++){
        priceFiltered.push(filterPrices(JSON.parse(JSON.stringify(currentCombination)),i));
      }
      priceFiltered = [].concat.apply([],priceFiltered);
      var totalPrice = priceFiltered.map(priceFiltered => priceFiltered.price.value).reduce(add)*currentCombination.quantity;
      var currentPrice = convertWorkToPrice(work, currentCombination,totalPrice);
      
      var possibleExtraPrices = extraPrices.filter(function(v, i) {
        return (v.workId == work.id);
      });
      
      possibleExtraPrices = possibleExtraPrices.map(function(extraPrice){
        
        var isValid = 
        Object.keys(extraPrice).map(function(key){
          if (key != "optionalFinishes" && key !="items" && key !="workId"){
           if(!JSON.stringify(work[key]).includes(JSON.stringify(extraPrice[key]))){
                 return false; 
           }
         }
         return true;
         }).every(Boolean);

         if (isValid){
           var valid = extraPrice.items.map(function(item,index){
            var isValid = 
            Object.keys(item).map(function(key){
              if (key != "optionalFinishes" && key !="items" && key !="workId" && key!="id"){
               if(!JSON.stringify(work.items[index][key]).includes(JSON.stringify(item[key]))){
                     return false; 
               }
             }
             return true;
             }).every(Boolean);
             return isValid;
        
          }).every(Boolean);
          if(valid){
            return extraPrice;
          }
         }

      }).filter(Boolean);
      
      if (!(work["extraPrices"] && work["extraPrices"].length > 0)){
        work["extraPrices"] = [];
      }
      
      //me deja en possibleExtraPrices general solo los extras que están en work
      possibleExtraPrices.forEach(possibleExtraPrice => possibleExtraPrice.optionalFinishes = possibleExtraPrice.optionalFinishes.filter(function(optionalFinish){
        return work.optionalFinishes.map(finishes => finishes.finish).indexOf(optionalFinish.finish)>-1
      }));

      //me deja en possibleExtraPrices de cada item solo los extras que están en cada item del work
      possibleExtraPrices.forEach(possible => possible.items.forEach(item => item.optionalFinishes = item.optionalFinishes?item.optionalFinishes.filter(function(optionalFinish){
        return [].concat.apply([],work.items.filter(workItem => workItem.id == item.id).map(workItem => workItem.optionalFinishes.map(optional => optional.finish))).indexOf(optionalFinish.finish)>-1;
      }):null))

      work.optionalFinishesPrices = possibleExtraPrices;

      //hay que ver como agregar la machine, papersize, sheetsize, etc
      work.prices.push(currentPrice); 
    }
  }
  createCard(work);
  return work;
}

function add(accumulator, a) {
  return accumulator + a;
}

function convertWorkToPrice(work,combination,price){
  var currentWork = JSON.parse(JSON.stringify(work));
  delete currentWork.workTypeId;
  delete currentWork.workType;
  delete currentWork.image;
  delete currentWork.name;
  delete currentWork.quantities;
  if (combination.mandatoryFinishGroups){
    currentWork.mandatoryFinishGroups = combination.mandatoryFinishGroups;
  }
  if (combination.quantity){
    currentWork.quantity = combination.quantity;
  }
  if(combination.clossedSizes){
    currentWork.clossedSizes = combination.clossedSizes;
  }else{
    currentWork.clossedSizes = currentWork.clossedSizes[0];
  }
  currentWork.workId = currentWork.id;
  delete currentWork.id;
  currentWork.price = price;
  for(var i =0; i < currentWork.items.length; i++){
    if(combination.items[i].pages){
      currentWork.items[i].quantityOfPages = combination.items[i].pages;
    }
    if(combination.items[i].faces){
      currentWork.items[i].faces = combination.items[i].faces;
    }
    if(combination.items[i].openedSize){
      currentWork.items[i].openedSize = combination.items[i].openedSize;
    }
    if(combination.items[i].quantityOfVias){
      currentWork.items[i].quantityOfVias = combination.items[i].quantityOfVias;
    }
    if (combination.items[i].mandatoryFinishGroups){
      currentWork.items[i].mandatoryFinishGroups = combination.items[i].mandatoryFinishGroups;
    }
    if(combination.items[i].inksDetails){
      currentWork.items[i].inks = {
        inksQuantity: combination.items[i].inksQuantity,
        inksDetails: combination.items[i].inksDetails
      }
    }
    if(combination.items[i].paper){
      currentWork.items[i].materials = {
        gr: combination.items[i].gr,
        paper: combination.items[i].paper
      }
    }
  }
  return currentWork;
}
/*

    


    for(var i = 0; i < possibleExtraPrices.length;i++){
      var possibleExtraPrice = possibleExtraPrices[i];
      var isPossible = true;
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
        if (!(work["extraPrices"] && work["extraPrices"].length > 0)){
          work["extraPrices"] = [];
        }
        //tengo que buscar los extra prices que quiero, segun las terminaciones, lo que se hasta ahora es que cumple con las cualidades del trabajo
        var cutPossibleExtraPrice = JSON.parse(JSON.stringify(possibleExtraPrice)); 
        var indexToPreserve = [];
        for (var j = 0; j < work.optionalFinishes.length;j++){
          for (var k = 0; k < cutPossibleExtraPrice.optionalFinishes.length; k++){
            if(work.optionalFinishes[j].finish == cutPossibleExtraPrice.optionalFinishes[k].finish){
              indexToPreserve.push(k);
              break; 
            }
          }
        }
        cutPossibleExtraPrice.optionalFinishes = cutArray(cutPossibleExtraPrice.optionalFinishes,indexToPreserve);
        for(var j= 0; j < work.items.length;j++){
          indexToPreserve = [];
          var currentWorkExtraPriceItem = work.items[j];
          var currentExtraPriceItem;
          for (var k = 0; k < cutPossibleExtraPrice.items.length;k++){
            if(currentWorkExtraPriceItem.id == cutPossibleExtraPrice.items[k].id){
              currentExtraPriceItem = cutPossibleExtraPrice.items[k];
              break;
            }
          }
          
          if(currentWorkExtraPriceItem.optionalFinishes && currentExtraPriceItem.optionalFinishes){
            for (var k = 0; k < currentWorkExtraPriceItem.optionalFinishes.length;k++){
              for (var q = 0; q < currentExtraPriceItem.optionalFinishes.length;q++){
                if(currentWorkExtraPriceItem.optionalFinishes[k].finish == currentExtraPriceItem.optionalFinishes[q].finish){
                  indexToPreserve.push(q);
                  break; 
                }
              }
            }
          }
          if(indexToPreserve && indexToPreserve.length >0){       
            cutPossibleExtraPrice.items[j].optionalFinishes = cutArray(cutPossibleExtraPrice.items[j].optionalFinishes,indexToPreserve);
          }
        }
        if(!(work["optionalFinishesPrices"] && work["optionalFinishesPrices"].length>0)){
          work["optionalFinishesPrices"] = [];
        }
        work["optionalFinishesPrices"].push(cutPossibleExtraPrice);
      }
    }

    estimate = work;
    delete estimate['image'];
    delete estimate['quantities'];
    delete estimate['clossedSizes'];
    createCard(estimate);
    return work;
  }
}*/

/*var deleteFromArray = function(originalArray,indexToCut){
  var a =  jQuery.grep(originalArray, function(n, i ) {
    return indexToCut?indexToCut.indexOf(i)!==1:false;
  });
  return a;
}*/

var getCombinations = function(estimate){
  var items= [];
  var combinationsObject = [];
  combinations = [];
  var quantities = [];

  var generalMandatoryFinishGroups = [];
  if(estimate.mandatoryFinishGroups){
    for (var j=0; j < estimate.mandatoryFinishGroups.length;j++){
      var lastOfLasts = j == estimate.mandatoryFinishGroups.length -1; 
      var generalMandatoryFinish = [];
      for(var k = 0; k < estimate.mandatoryFinishGroups[j].finishes.length;k++){
        generalMandatoryFinish.push('"' + j + '-' + k + (lastOfLasts?'"':'",'));
      }
      generalMandatoryFinishGroups.push(generalMandatoryFinish);
    }
  }

  var generalMandatoryFinishGroupsCases = allPossibleCases(generalMandatoryFinishGroups);
  for (var j = 0; j < generalMandatoryFinishGroupsCases.length;j++){
    var mandatoryFinishGroupsString = '"mandatoryFinishGroups":[';
    var separated = generalMandatoryFinishGroupsCases[j].split(",");
    for (var k = 0; k  < separated.length;k++){
      var currentSeparated = separated[k].substring(1,separated[0].length-1);
      var mandatoryFinishGroups = JSON.parse(JSON.stringify(estimate.mandatoryFinishGroups[currentSeparated.split("-")[0]]));
      var finishes = cutArray(mandatoryFinishGroups.finishes,currentSeparated.split("-")[1]);
      mandatoryFinishGroups.finishes = finishes[0]; 
      mandatoryFinishGroupsString += JSON.stringify(mandatoryFinishGroups) + (k==separated.length-1?'':',')
    }
    generalMandatoryFinishGroupsCases[j] = mandatoryFinishGroupsString + "],";
  }
  for (var i = 0; i  < estimate.quantity.length; i++){
    quantities.push('{"quantity":' + estimate.quantity[i]+',');
  }

  if (generalMandatoryFinishGroupsCases && generalMandatoryFinishGroupsCases.length > 0){
    combinations.push(allPossibleCases([quantities,generalMandatoryFinishGroupsCases]));
  }else{    
    combinations.push(quantities);
  }

  for (var i = 0; i  <  estimate.items.length; i++){
      var item = estimate.items[i];
      items.push(item.name);
      var quantityOfPages = [];
      var quantityOfMaterials = [];
      var quantityOfInks = [];
      var faces = [];
      var openedSize = [];
      var quantityOfVias = [];
      var mandatoryFinishGroup = [];
      for (var j = 0; j  < item.quantityOfPages.length;j++){
          quantityOfPages.push('"item":{"id":'+i+ ', "name": "'+ item.name +  '", "pages": ' + item.quantityOfPages[j] + ',');
      }
      for (var j = 0; j  < item.inks.length;j++){
          quantityOfInks.push('"inksQuantity":'+ item.inks[j].inksQuantity + ',' + '"inksDetails": "'+ item.inks[j].inksDetails+ '",');
      }
      for (var j = 0; j  < item.faces.length;j++){
          faces.push('"faces": "'+ item.faces[j] + '",');
      }
      for (var j = 0; j  < item.openedSize.length;j++){
        openedSize.push('"openedSize": "'+ item.openedSize[j] + '",');
      }
      for (var j = 0; j  < item.quantityOfVias.length;j++){
        quantityOfVias.push('"quantityOfVias": '+ item.quantityOfVias[j] + ',');
      }
      if(item.mandatoryFinishGroups){
        for (var j=0; j < item.mandatoryFinishGroups.length;j++){
          var lastOfLasts = j == item.mandatoryFinishGroups.length -1; 
          var mandatoryFinish = [];
          for(var k = 0; k < item.mandatoryFinishGroups[j].finishes.length;k++){
            mandatoryFinish.push('"' + j + '-' + k + (lastOfLasts?'"':'",'));
          }
          mandatoryFinishGroup.push(mandatoryFinish);
        }
      }
      for (var j = 0; j < item.materials.length; j++){
          quantityOfMaterials.push(' "paper": "' + item.materials[j].paper + '", "gr": ' + item.materials[j].gr + '}' + (i==(estimate.items.length-1)?']':','));
      }
      var cases = allPossibleCases([quantityOfPages,quantityOfInks]);
      var cases2 = allPossibleCases(mandatoryFinishGroup);
      for (var j = 0; j < cases2.length;j++){
        var mandatoryFinishGroupsString = '"mandatoryFinishGroups":[';
        var separated = cases2[j].split(",");
        for (var k = 0; k  < separated.length;k++){
          var currentSeparated = separated[k].substring(1,separated[0].length-1);
          var mandatoryFinishGroups = JSON.parse(JSON.stringify(item.mandatoryFinishGroups[currentSeparated.split("-")[0]]));
          var finishes = cutArray(mandatoryFinishGroups.finishes,currentSeparated.split("-")[1]);
          mandatoryFinishGroups.finishes = finishes[0]; 
          mandatoryFinishGroupsString += JSON.stringify(mandatoryFinishGroups) + (k==separated.length-1?'':',')
        }
        cases2[j] = mandatoryFinishGroupsString + "],";
      }
      if(cases2 && cases2.length>0){
              cases = allPossibleCases([cases,cases2]);
      }
      cases = allPossibleCases([cases,openedSize]);
      cases = allPossibleCases([cases,quantityOfVias]);
      cases = allPossibleCases([cases,faces]);
      cases = allPossibleCases([cases,quantityOfMaterials]);
      combinations.push(cases);
  }
  combinations = allPossibleCases(combinations);
  var newCombinations = [];
  for (i = 0 ; i < combinations.length; i++){
      var stringToFind = '"item":{';
      var text = combinations[i];
      var stringToReturn = text.substr(0,text.indexOf(stringToFind)) +  '"items":[';
      text = text.substr(text.indexOf(stringToFind)+stringToFind.length);
      while(text.indexOf(stringToFind)>0){
          stringToReturn += '{' + text.substr(0,text.indexOf(stringToFind));
          text = text.substr(text.indexOf(stringToFind)+stringToFind.length);
      }
      stringToReturn += '{' + text + '}';
      newCombinations.push(stringToReturn);
  }
  for (var i = 0; i < newCombinations.length;i++){
      combinationsObject.push($.parseJSON(newCombinations[i]));
  };
  return combinationsObject;
}

var allPossibleCases = function (arr) {
  if (arr.length === 0) {
    return [];
  }else if (arr.length ===1){
    return arr[0];
  }else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
    for (var c in allCasesOfRest) {
      for (var i = 0; i < arr[0].length; i++) {
        result.push(arr[0][i] + allCasesOfRest[c]);
      }
    }
    return result;
  }
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}