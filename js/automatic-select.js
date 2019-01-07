
var t = TrelloPowerUp.iframe();
var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';

var selectedWorkTypeId;
var selectedWorkId;
var selectedOptions = {};

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
	  if(t.arg('update')){
		saveFunction = updateCard;
		addCardButton.firstChild.data = "Modificar";
	  } else {
		saveFunction = createCard;
	  }
      createWorkTypeSelectPanel();
	 // addCardButton.addEventListener('click', saveFunction);
  
	  /*if(cardInfo){
		createGeneralInformation(cardInfo);
		for (var i = 0; i <  cardInfo.items.length;i++){
			createItem(cardInfo.items[i]);
		}
		createComments(cardInfo);
		createCustomer(cardInfo);
	  }else{
		createGeneralInformation();
		createItem();
		createComments();
		createCustomer();
      }*/
      
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

var deleteWizard = function(){
  var wizardForm =  document.getElementById('wizardForm');
  while(wizardForm.firstChild){
    wizardForm.removeChild(wizardForm.firstChild);
  }
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
      if(combination.name == 'finishes'){
        value = combination.values[i].finish;
      }else if (combination.name == 'materials'){
        value = combination.values[i].paper + ' ' + combination.values[i].gr + 'gr.';
      }
    }
    var card = createRevealCard('no-image-icon.png',value,combination.itemId + '-' + combination.name,i);
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
  var work = works[id];
  var possibilities = [];
  for(var attr in work){
    if(typeof work[attr] == 'object'){
      if(work[attr].length > 1){
        if (attr != 'items'){
          var possibility = {};
          possibility['itemId'] = -1;
          possibility['itemName'] = 'general';
          possibility['name'] = attr;
          possibility['values'] = work[attr];
          possibilities.push(possibility);
        }
      }
    }
  }

  var items = work.items;
  for (var i = 0; i < items.length;i++){
    var item = items[i];
    for(var itemAttr in item){
      if(typeof item[itemAttr] == 'object' && item[itemAttr].length > 1){
        var possibility = {};
        possibility['itemId'] = i;
        possibility['itemName'] = item.name;
        possibility['name'] = itemAttr;
        possibility['values'] = item[itemAttr];
        possibilities.push(possibility);
      }
    }
  }

  deleteWizard();
  createWizard(possibilities);
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

var createRevealCard = function(image,title,type,id){
  var divCol = createElement('div','col m4','','');
  var divCard = createElement('div','card',type + '-' + id,'');
  var divCardImage = createElement('div','card-image waves-effect waves-block waves-light','','');
  var img = createElement('img','activator','','','','','','','',image);
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
  return divCol;
}

var createHTMLCard = function(image,title,type,id,functionOnClick){
  var divCol = createElement('div','col m4','','');
  var divCard = createElement('div','card',type + '-' + id,'');
  var divCardImage = createElement('div','card-image waves-effect waves-block waves-light','','');
  var img = createElement('img','activator','','','','','','','',image);
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
    button = createElement('button','btn ' +'nextBtn ' + 'btn-lg ' + 'pull-right ','',text,'button');
    button.addEventListener('click',createEstimateAndTrelloCard);
  }
  return button;
} 

var createEstimateAndTrelloCard = function(){
  var estimate = {};
  var work = works[selectedWorkId];
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
  work.finishes = cutArray(work.finishes,selectedOptions[-1].finishes);
  for (var i = 0; i < work.items.length;i++){
    if (work.items[i].quantityOfPages.length>1){
        work.items[i].quantityOfPages = cutArray(work.items[i].quantityOfPages,selectedOptions[i].quantityOfPages);
    }
    if(work.items[i].materials.length>1){
        work.items[i].materials = cutArray(work.items[i].materials,selectedOptions[i].materials);
    }
    if(work.items[i].inksQuantity.length>1){
        work.items[i].inksQuantity = cutArray(work.items[i].inksQuantity,selectedOptions[i].inksQuantity);
    }
    if(work.items[i].faces.length>1){
        work.items[i].faces = cutArray(work.items[i].faces,selectedOptions[i].faces);
    }
    if(work.items[i].openedSize.length>1){
        work.items[i].openedSize = cutArray(work.items[i].openedSize,selectedOptions[i].openedSize);
    }
    work.items[i].finishes = cutArray(work.items[i].finishes,selectedOptions[i].finishes);
  }
  work['prices'] = [];
  var allCombinations = getCombinations(work);
  possiblePrices = prices.filter(function(v, i) {
    return (v.workId == work.id);
  })

  for (var i = 0; i < allCombinations.length;i++){
    var currentCombination = allCombinations[i];
    var quantity = currentCombination.quantity;


    currentPossiblePrices = possiblePrices.filter(function(v, i) {
      return (v.quantity == quantity);
    })



    for (var j = 0; j < currentCombination.items.length; j++){
      var currentItem = currentCombination.items[j];
      var pages = currentItem.pages;
      var quantityOfInks = currentItem.quantityOfInks;
      var openedSize = currentItem.openedSize;
      var faces = currentItem.faces;
      var paper = currentItem.paper;
      var gr = currentItem.gr;
      var vias = currentItem.vias;
      currentPossiblePrices = currentPossiblePrices.filter(function(v, i) {
        return (v.items[j].pages == pages && v.items[j].inksQuantity == quantityOfInks && 
          v.items[j].openedSize == openedSize && v.items[j].faces ==  faces && 
          v.items[j].materials.paper == paper && v.items[j].materials.gr == gr &&
          v.items[j].materials.paper == vias);
      })
    }
    work.prices.push(currentPossiblePrices[0]);
  }
  return work;
  estimate = work;
  createCard();
}

var cutArray = function(originalArray,indexToCut){
  var a =  jQuery.grep(originalArray, function(n, i ) {
    return indexToCut?indexToCut.indexOf(i)!=-1:false;
  });
  return a;
}

var getCombinations = function(estimate){
  var items= [];
  var combinationsObject = [];
  combinations = [];
  var quantities = [];
  for (var i = 0; i  < estimate.quantity.length; i++){
    quantities.push('{"quantity":' + estimate.quantity[i]+',');
  }
  combinations.push(quantities);
  for (var i = 0; i  <  estimate.items.length; i++){
      var item = estimate.items[i];
      items.push(item.name);
      var quantityOfPages = [];
      var quantityOfMaterials = [];
      var quantityOfInks = [];
      var faces = [];
      var openedSize = [];
      for (var j = 0; j  < item.quantityOfPages.length;j++){
          quantityOfPages.push('"item":{"id":'+i+ ', "name": "'+ item.name +  '", "pages": ' + item.quantityOfPages[j] + ',');
      }
      for (var j = 0; j  < item.inksQuantity.length;j++){
          quantityOfInks.push('"quantityOfInks":'+ item.inksQuantity[j] + ',');
      }
      for (var j = 0; j  < item.faces.length;j++){
          faces.push('"faces": "'+ item.faces[j] + '",');
      }
      for (var j = 0; j  < item.openedSize.length;j++){
          openedSize.push('"openedSize": "'+ item.openedSize[j] + '",');
      }
      for (var j = 0; j < item.materials.length; j++){
          quantityOfMaterials.push(' "paper": "' + item.materials[j].paper + '", "gr": ' + item.materials[j].gr + '}' + (i==(estimate.items.length-1)?']':','));
      }
      var cases = allPossibleCases([quantityOfPages,quantityOfInks]);
      cases = allPossibleCases([cases,openedSize]);
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