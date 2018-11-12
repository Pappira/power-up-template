//Para probarlo solo hacer esto:
//a = ['cantidad 100', 'cantidad 250', 'cantidad 500', 'cantidad 1000']; b= ['papel Obra 80gr', 'papel Obra 90gr', 'papel Obra 100gr']; c = ['80 páginas','100 páginas', '120 páginas']; var d = allPossibleCases([a,b,c]);createWizard(d,['Item 1','Item 2'])

var t = TrelloPowerUp.iframe();

var savePricesButton = document.getElementById('savePrices');

var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';
var combinations = [];
var combinationsObject = [];
var items = [];

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
    combinations = [];
    var quantities = [];
    for (var i = 0; i  < cardInfo.quantity.length; i++){
        quantities.push('{"cantidad":' + cardInfo.quantity[i]+',');
    }
    combinations.push(quantities);
    for (var i = 0; i  <  cardInfo.items.length; i++){
        var item = cardInfo.items[i];
        items.push(item.name);
        var quantityOfPages = [];
        var quantityOfMaterials = [];
        for (var j = 0; j  < item.quantityOfPages.length;j++){
            quantityOfPages.push('"item":{"id":'+i+ ', "name": "'+ item.name +  '", "pages": ' + item.quantityOfPages[j] + ',');
        }
        for (var j = 0; j < item.materials.length; j++){
            quantityOfMaterials.push(' "paper": "' + item.materials[j].paper + '", "gr": ' + item.materials[j].gr + '}' + (i==(cardInfo.items.length-1)?']':','));
        }
        combinations.push(allPossibleCases([quantityOfPages,quantityOfMaterials]))
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
    createWizard(combinations,items);
	});
  });


var machinesList = ['GTO52/4', 'TOKO', 'AB-Dick', 'GTO46'];

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

//arr es un array  de arrays
var allPossibleCases = function (arr) {
  if (arr.length === 0) {
    return [];
  } 
else if (arr.length ===1){
return arr[0];
}
else {
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


var createWizardButton = function(step){
  var div = createElement('div','stepwizard-step');
  var a = createElement('a','btn ' + (step==1?'btn-primary':'btn-default') +' btn-circle','',step,'button','','','#step-'+step,(step==1?'':'disabled'));
  var p = createElement('p','','',step+'');
  div.appendChild(a);
  div.appendChild(p);
  return div;
}  

var createWizard = function(combinations,items){
  var divContainer = createElement('div','stepwizard-row setup-panel','wizardRow');
  var wizardForm =  document.getElementById('wizardForm');
  for(var i = 0; i < combinations.length; i++){
    var wizardButton = createWizardButton(i+1);
    divContainer.appendChild(wizardButton);
    var wizardElement = createWizardElement(i+1,combinations[i],i==combinations.length-1?true:false,items);
    wizardForm.appendChild(wizardElement);
    for (var j = 0; j < items.length;j++){
      $('select#' + (i+1) + '-' + j + '-machine').material_select();
    }
  }
  var wizardContainer = document.getElementById('wizardContainer');
  wizardContainer.appendChild(divContainer);
  startFunction();

}

var createWizardElement = function(step,text,last,items){
  var div = createElement('div','row setup-content','step-' + step); 
  var title = createElement('h3','','',text+''); 
  div.appendChild(title);

  var input = createTextInput('s12',step + '-price','Precio','text');
  div.appendChild(input);

  for (var i = 0; i < items.length;i++){
    var title = createElement('h4','','',items[i]+''); 
    div.appendChild(title);

    var selectMachine = createSelect('s8',step + '-' + i + '-machine',machinesList,'Impresora')
    div.appendChild(selectMachine);

    var input = createTextInput('s4',step + '-' + i + '-cutPerSheet','Cortes por hoja','number');
    div.appendChild(input);

    var input = createTextInput('s4',step + '-' + i + '-quantityPerPaper','Armado por pliego','number');
    div.appendChild(input);

    var input = createTextInput('s4',step + '-' + i + '-paperSize','Tamaño del pliego','text');
    div.appendChild(input);

    var input = createTextInput('s4',step + '-' + i + '-excess','Demasia','number');
    div.appendChild(input);
  }


  
  var divButton = createElement('div','div-button'); 

  if(step!=1){
    var buttonPreviuos = createFormButton(step,text,false);
    divButton.appendChild(buttonPreviuos);
  }
  if(!last){
    var buttonNext = createFormButton(step,text,true);
    divButton.appendChild(buttonNext);
  }
  div.appendChild(divButton);

  return div;
}


var createFormButton = function(step,text,next){

  var div = createElement('div','input-field col s12'); 
  var button = createElement('button','btn ' + (next?'nextBtn ':'prevBtn ') + 
    'btn-lg ' + (next?'pull-right ':'pull-left '),'',(next?'Siguiente':'Previo'),'button');
    next?button.addEventListener('click',nextButtonClick):button.addEventListener('click',previuosButtonClick);
  div.appendChild(button);
  return button;
} 

var savePrices = function(){
    for (var i = 0; i < combinations.length;i++){
        var price = document.getElementById((i+1) + '-price').value;
        for (var j = 0; j < items.length;j++){
            var machine = document.getElementById((i+1) + '-' + j + '-machine').value
            var cutPerSheet = document.getElementById((i+1) + '-' + j + '-cutPerSheet');
            var quantityPerPaper = document.getElementById((i+1) + '-' + j + '-quantityPerPaper');
            var paperSize = document.getElementById((i+1) + '-' + j + '-paperSize');
            var excess = document.getElementById((i+1) + '-' + j + '-excess');
            combinationsObject [i].items[j]['machine'] = machine;
            combinationsObject [i].items[j]['cutPerSheet'] = cutPerSheet;
            combinationsObject [i].items[j]['quantityPerPaper'] = quantityPerPaper;
            combinationsObject [i].items[j]['paperSize'] = paperSize;
            combinationsObject [i].items[j]['excess'] = excess;
        }
        combinationsObject [i]['price'] = price;
    }
}

savePricesButton.addEventListener('click',savePrices);