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
  var estimate = sendRequest(workRequest);
  estimate.work.items.sort(orderItems());
  createCard(estimate);
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
  var estimate = JSON.parse('{"id": 17816,"prices": [{"id": 17885,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1330.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 3250.00,"showToClient": true}],"price": 676.00,"priceWithFinishes": 4272.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 346.00,"priceWithFinishes": 346.00}},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 2960.00,"priceWithFinishes": 2960.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1000.00,"totalPrice": 11062.00},{"id": 17866,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1330.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 2840.00,"priceWithFinishes": 2840.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 3250.00,"showToClient": true}],"price": 676.00,"priceWithFinishes": 4272.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 346.00,"priceWithFinishes": 346.00}}],"price": 1000.00,"totalPrice": 9442.00},{"id": 17979,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3208.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 6485.00,"priceWithFinishes": 6485.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 2025.00,"showToClient": true}],"price": 2009.00,"priceWithFinishes": 4034.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1350.00,"totalPrice": 19127.00},{"id": 18131,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3208.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 2025.00,"showToClient": true}],"price": 2009.00,"priceWithFinishes": 4034.00},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 7025.00,"priceWithFinishes": 7025.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1350.00,"totalPrice": 19667.00},{"id": 17960,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1330.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 3146.00,"priceWithFinishes": 3146.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 3250.00,"showToClient": true}],"price": 676.00,"priceWithFinishes": 4272.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 346.00,"priceWithFinishes": 346.00}}],"price": 1000.00,"totalPrice": 9748.00},{"id": 18367,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3208.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 6548.00,"priceWithFinishes": 6548.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 2025.00,"showToClient": true}],"price": 2009.00,"priceWithFinishes": 4034.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1350.00,"totalPrice": 19190.00},{"id": 18010,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3592.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 7034.00,"priceWithFinishes": 7034.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 8775.00,"showToClient": true}],"price": 1758.00,"priceWithFinishes": 11402.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 869.00,"priceWithFinishes": 869.00}}],"price": 1350.00,"totalPrice": 27428.00},{"id": 18217,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3592.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 8775.00,"showToClient": true}],"price": 1758.00,"priceWithFinishes": 11402.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 869.00,"priceWithFinishes": 869.00}},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 7025.00,"priceWithFinishes": 7025.00}],"price": 1350.00,"totalPrice": 27419.00},{"id": 18294,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3592.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 8775.00,"showToClient": true}],"price": 1758.00,"priceWithFinishes": 11402.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 869.00,"priceWithFinishes": 869.00}},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 6548.00,"priceWithFinishes": 6548.00}],"price": 1350.00,"totalPrice": 22892.00},{"id": 18115,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1188.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 3046.00,"priceWithFinishes": 3046.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 750.00,"showToClient": true}],"price": 772.00,"priceWithFinishes": 1522.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1000.00,"totalPrice": 8256.00},{"id": 18237,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1188.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 2960.00,"priceWithFinishes": 2960.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 750.00,"showToClient": true}],"price": 772.00,"priceWithFinishes": 1522.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1000.00,"totalPrice": 6670.00},{"id": 17995,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1188.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 2840.00,"priceWithFinishes": 2840.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 750.00,"showToClient": true}],"price": 772.00,"priceWithFinishes": 1522.00}],"price": 1000.00,"totalPrice": 6550.00},{"id": 17925,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1188.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 750.00,"showToClient": true}],"price": 772.00,"priceWithFinishes": 1522.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 3146.00,"priceWithFinishes": 3146.00}],"price": 1000.00,"totalPrice": 8356.00},{"id": 18383,"quantity": 50,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 1330.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 3046.00,"priceWithFinishes": 3046.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 3250.00,"showToClient": true}],"price": 676.00,"priceWithFinishes": 4272.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 346.00,"priceWithFinishes": 346.00}}],"price": 1000.00,"totalPrice": 9648.00},{"id": 18281,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3208.00,"internalInformation": "Rulo 16","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": true,"bleedPrint": false,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 90,"name": "Obra"},"processDetails": {"sheetSize": "72x92","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "GTO46","excess": 50},"price": 7034.00,"priceWithFinishes": 7034.00},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "33x21","faces": "SIMPLE_FAZ","material": {"gr": 250,"name": "Cartulina"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Semi-Dura","price": 2025.00,"showToClient": true}],"price": 2009.00,"priceWithFinishes": 4034.00}],"price": 1350.00,"totalPrice": 15626.00},{"id": 18028,"quantity": 100,"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","price": 3592.00,"internalInformation": "Rulo 19","showToClient": true}],"items": [{"ordinal": 0,"name": "Interior","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra"},"allTheSame": true,"bleedPrint": true,"quantityOfSheets": 80,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 80,"name": "Obra"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "36x51","quantityPerPaper": 4,"machine": "GTO52 Cromo","excess": 50},"price": 6485.00,"priceWithFinishes": 6485.00},{"ordinal": 1,"name": "Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "42x27","faces": "SIMPLE_FAZ","material": {"gr": 150,"name": "Coteado"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 1,"machine": "Konica 1070 Color","excess": 4},"mandatoryFinishes": [{"name": "Tipo Dura","price": 8775.00,"showToClient": true}],"price": 1758.00,"priceWithFinishes": 11402.00,"subItem": {"name": "Retiro de Tapa","ink": {"inksQuantity": 4,"inksDetails": "Full Color CMYK"},"allTheSame": false,"bleedPrint": true,"quantityOfPages": 1,"quantityOfVias": 1,"openedSize": "30x21","faces": "SIMPLE_FAZ","material": {"gr": 120,"name": "#VALUE!"},"processDetails": {"sheetSize": "72x102","cutsPerSheet": 4,"paperSize": "33x48","quantityPerPaper": 2,"machine": "Konica 1070 Color","excess": 4},"price": 869.00,"priceWithFinishes": 869.00}},{"ordinal": 2,"name": "Inserto","ink": {"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},"allTheSame": false,"bleedPrint": false,"quantityOfSheets": 2,"quantityOfVias": 1,"openedSize": "15x21","faces": "DOBLE_FAZ","material": {"gr": 130,"name": "Coteado"},"processDetails": {"sheetSize": "66x96","cutsPerSheet": 4,"paperSize": "32x46","quantityPerPaper": 4,"machine": "Konica 951","excess": 3},"price": 0.00,"priceWithFinishes": 0.00}],"price": 1350.00,"totalPrice": 26879.00}],"work": {"id": 17817,"quantity": [50,100],"closedSize": "15x21","openedSize": "15x21","mandatoryFinishes": [{"name": "Encuadernado Rulo","comment": "Rulo metálico de doble espiral","showToClient": true}],"optionalFinishes": [{"name": "Cierre Elástico","showToClient": true,"propertiesToSelectByCustomer": ["negro","blanco"]}],"items": [{"name": "Inserto","ink": [{"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"}],"allTheSame": false,"bleedPrint": false,"quantityOfSheets": [2],"quantityOfVias": [1],"faces": ["DOBLE_FAZ"],"material": [{"gr": 130,"name": "Coteado"}]},{"name": "Interior","ink": [{"inksQuantity": 1,"inksDetails": "Tinta Negra fondo blanco sin grisados"},{"inksQuantity": 1,"inksDetails": "Tinta Negra"}],"allTheSame": true,"bleedPrint": false,"quantityOfSheets": [80],"quantityOfVias": [1],"faces": ["DOBLE_FAZ"],"material": [{"gr": 80,"name": "Obra"},{"gr": 90,"name": "Obra"}]},{"name": "Tapa","ink": [{"inksQuantity": 4,"inksDetails": "Full Color CMYK"}],"allTheSame": false,"bleedPrint": true,"quantityOfPages": [1],"quantityOfVias": [1],"faces": ["SIMPLE_FAZ"],"material": [{"gr": 150,"name": "Coteado"},{"gr": 250,"name": "Cartulina"}],"mandatoryFinishes": [{"name": "Tipo Dura","comment": "La tapa dura es una tapa rígida hecha con suela forrada.","showToClient": true},{"name": "Tipo Semi-Dura","comment": "La tapa semidura es una tapa hecha con dos cartulinas de 250gr. contraencoladas formando un material semi rígido de más de 500gr.","showToClient": true}]}]},"optionalFinishes": [{"name": "Cierre Elástico","price": 4050.00,"propertiesToSelectByCustomer": ["negro","blanco"],"itemOrdinal": -1,"showToClient": true,"quantity": 100},{"name": "Cierre Elástico","price": 1500.00,"propertiesToSelectByCustomer": ["negro","blanco"],"itemOrdinal": -1,"showToClient": true,"quantity": 50}]}');
  estimate.work.name = 'Cuadernos';
  return estimate;
}