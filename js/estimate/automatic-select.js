var t = TrelloPowerUp.iframe();
var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';
var wizardForm =  document.getElementById('wizardForm');
var work;
var finalWorkOptions;

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
    if(!t.arg('update')){
      createWorkTypeSelectPanel();
		}
	});
});

var createWorkTypeSelectPanel = function(){
  var wizardElement = createScreen('workType','Tipo de trabajo',workTypes,nextAfterWorkTypeSelect);
  wizardForm.appendChild(wizardElement);
}

var createWorkSelectPanel = function(works){
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
  selectedWorkTypeId = $(this).attr('id').substring($(this).attr('id').indexOf('-')+1);
  var possibleWorks = works.filter(work => work.workTypeId == selectedWorkTypeId);
  deleteWizard();
  createWorkSelectPanel(possibleWorks);
}

var deleteWizard = function(){
  while(wizardForm.firstChild){
    wizardForm.removeChild(wizardForm.firstChild);
  }
  $(".stepwizard-step").remove();
}


var nextAfterWorkSelect = function(){
  var elementId = $(this).attr('id');
  var id = elementId.substring(elementId.indexOf('-')+1);
  selectedWorkId = id;
  work = works[id];
  deleteWizard();
  
  work.options.forEach(function(option){
    if(option.values!=null){
      var subDiv = createMultipleSelect(option);
      wizardForm.appendChild(subDiv);
    }else{
      var subDiv = createChips(option);
      wizardForm.appendChild(subDiv);
    }
  });
  var div = createElement('div','chips');
  var input = createElement('input','','','','number');
  div.appendChild(input);
  var divLoader = createElement('div','','loader');
  wizardForm.appendChild(divLoader);
  var a = createElement('a','waves-effect waves-light btn','button-generate-estimate','Presupuestar');
  wizardForm.appendChild(a);
  
  document.getElementById('button-generate-estimate').addEventListener('click', createEstimateAndUpdateCard);

  $('.chips').each(function() {
    var currentElement = $(this);
    var id = currentElement.attr('id');
    currentElement.chips({
      placeholder: id,
      secondaryPlaceholder: '+' + id
    });
  });

  $('select').formSelect();
  $('select').each(function() {
    var currentElement = $(this);
    currentElement.on('change', function(){
      checkIncidences($(this));
    });
  });
}

var createEstimateAndUpdateCard = function(){
  startLoader();
  var workRequest = createRequest();
  sendRequest(workRequest);
}

var createRequest = function(){
  finalWorkOptions = JSON.parse(JSON.stringify(work));
  var cellsInformation = [];
  $('.chips').each(function() {
    var currentElement = $(this);
    var id = currentElement.attr('id');
    for (i = 0; i < work.options.length;i++){
      var option = work.options[i];
      if (option.name==id){
        var cellInformation = {};
        cellInformation.range = option.cell;
        cellInformation.values = M.Chips.getInstance(currentElement).chipsData.map(chip => chip.tag);
        finalWorkOptions.options[i].values = cellInformation.values;
        cellsInformation.push(cellInformation);
        break;
      }
    }
  });
  $('select').each(function() {
    var currentElement = $(this);
    var id = currentElement.parent().parent().attr('id');
    for (i = 0; i < work.options.length;i++){
      var option = work.options[i];
      if (option.name==id){
        var materializeSelect = M.FormSelect.getInstance(currentElement);
        if (!materializeSelect.input.disabled){
          var cellInformation = {};
          cellInformation.range = option.cell;
          cellInformation.values = materializeSelect.getSelectedValues();
          finalWorkOptions.options[i].values = cellInformation.values;
          cellsInformation.push(cellInformation);
        }else{
          var cellInformation = {};
          cellInformation.range = option.cell;
          cellInformation.values = option.default;
          finalWorkOptions.options[i].values = cellInformation.values;
          cellsInformation.push(cellInformation);
        }
        break;
      }
    }
  });
  workRequest = {};
  workRequest.spreadSheetId = work.spreadSheetId;
  workRequest.sheetName = work.sheetName;
  workRequest.cellsInformation = cellsInformation;
  return workRequest;
}

var createChips = function(option){
  var div = createElement('div','chips',option.name);
  var input = createElement('input','','','','number');
  div.appendChild(input);
  
  return div;
}
var createMultipleSelect = function(option){
  var div = createElement('div','input-field col s12',option.name);
  var attirbuteName = ['multiple'];
  var attributeValue = [true];
  if(option.disabled){
    attirbuteName.push('disabled');
    attributeValue.push(true);
  }
  var select = createElement('select','','','', '','','','','',attirbuteName,attributeValue);
  var label = createElement('label','','',option.name);
  for(j=0; j < option.values.length; j++){
    var value = option.values[j];
    var optionHtml = createElement('option','','',value, '','',j+1,'',true);
    select.appendChild(optionHtml);
  }
  div.appendChild(select);
  div.appendChild(label);
  return div;

}

var checkIncidences = function(element){
  var option =  work.options.filter(option => option.name == element.parent().parent().attr('id'))[0];
  if (option !=null){
    if (option.incidences !=null){
      for (k = 0; k < option.incidences.length; k++){
        var incidence = option.incidences[k];
        $('select').each(function() {
          var currentElement = $(this).parents().children('input');
          var currentElement2 = $(this);
          var id = currentElement.parent().parent().attr('id');
          if(id == incidence.name){
            if(M.FormSelect.getInstance(element).getSelectedValues().some(selectedValue => incidence.selected.includes(selectedValue))){
              if(incidence.active){
                currentElement.removeAttr('disabled');
                currentElement2.removeAttr('disabled');
              }else{
                currentElement.attr('disabled',true);
                currentElement2.attr('disabled',true);
              }
            }else{
              if(incidence.active){
                currentElement.attr('disabled',true);
                currentElement2.attr('disabled',true);
              }else{
                currentElement.removeAttr('disabled');
                currentElement2.removeAttr('disabled');
              }
            }
            currentElement2.formSelect();
          }
        });
      }
    }
  }
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

var sendRequest = function(workRequest){
  generateEstimate(workRequest,finishAutomaticSelect)
}

var finishAutomaticSelect = function(estimate){
  estimate.work.name = 'Cuadernos';
  estimate.work.items.sort(orderItems());
  createCard(estimate);
}