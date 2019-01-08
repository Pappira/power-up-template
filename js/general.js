var t = TrelloPowerUp.iframe();

var createSelect = function(colType,selectId,values,labelName,thisValue){
	var option0 = createElement('Option','','','Selecciona','','','');
	option0.setAttribute('disabled',true);
	option0.setAttribute('selected',true);
	var select = createElement('select','',selectId);
	select.appendChild(option0);
	if (values){
		for(var i = 0; i < values.length; i++){
			var option = createElement('Option','','',values[i],'','',values[i]);
			select.appendChild(option);
		}
	}
	if (thisValue){
  		select.value = thisValue;
  		$('#'+selectId).material_select();
	}
	var label = createElement('label','','',labelName,'',selectId);
	var divInput = createElement('div','input-wrapper');
	divInput.appendChild(select);
	divInput.appendChild(label);
	var divCol = createElement('div','input-field col ' + colType);
	divCol.appendChild(divInput);

	return divCol;
}

var createSwitch = function(colType,switchId,switchLabelValue, thisValue){
	var divCol = createElement('div','col ' + colType +' switch-div switch');
	var p = createElement('p','switch','',switchLabelValue);
	var divSwitch = createElement('div','switch','','');
	var label = createElement('label','puntas');
	var input = createElement('input','',switchId,'','checkbox');
	if (thisValue){
		input.checked = thisValue;
	}
	var span = createElement('span','lever');
	label.appendChild(input);
	label.appendChild(span);
	divSwitch.appendChild(label);
	divCol.appendChild(p);
	divCol.appendChild(divSwitch);
	return divCol;
};

var createTextInput = function(colType,inputId,inputLabelValue,type,valueForInput){
	var divCol = createElement('div','input-field col ' + colType);
	var divInput = createElement('div','input-wrapper','','');
	var input = createElement('input','validate',inputId,'',type?type:'text');
	var label = createElement('label',colType,'',inputLabelValue,'',inputId);
	if (valueForInput){
		input.value=valueForInput;
		label.setAttribute('class','active');
	}
	divInput.appendChild(input);
	divInput.appendChild(label);
	divCol.appendChild(divInput);

	return divCol;
};

var createElement = function(typeValue,className,id,text,type,forValue,value,href,disabled,attirbuteName,attributeValue){
	var createElement=document.createElement(typeValue);
	if(className && className.length>0){
		createElement.setAttribute('class',className);
	}
	if(id && id.length>0){	
		createElement.setAttribute('id',id);
	}
	if(text  && text.length>0){
		createElement.append(text);
	}
	if(type  && type.length>0){
		createElement.setAttribute('type',type);
	}	
	if(forValue  && forValue.length>0){
		createElement.setAttribute('for',forValue);
	}
	if(value  && value.length>0){
		createElement.setAttribute('value',value);
	}
	if(href && href.length>0){
		createElement.setAttribute('href',href);
	}
	if(disabled && disabled.length>0){
		createElement.setAttribute('disabled',disabled);
    }
    if(attirbuteName && attributeValue){
		for(var i = 0; i <attirbuteName.length;i++){
			createElement .setAttribute(attirbuteName[i],attributeValue[i]);
		}
	}
	return createElement;
};

var updateCard = function(estimate) {
	startLoader();
	t.card('all')
	.then(function(card) {
	  t.set('card', 'shared', cardInfoKey, estimate)
		.then(function(){
		  updateTrelloCard(t, {id: card.id, desc: createTextForCard(estimate)},
			function(){
			  t.closeModal();
			});
		});
	});
  };

var createCard = function(estimate){
	var cardToSave = {idList: listId, desc: createTextForCard(estimate), name: createTrelloCardName(estimate)};
	if(estimate.deliveryDelay){
	  //TODO Agregar due date a la tarjeta
	  // due: mm/dd/yyy
	}
	startLoader();
	createNewTrelloCard(t, cardToSave, function(card) {
	  setTimeout(function () {
		t.set(card.id, 'shared', cardInfoKey, estimate)
		  .then(function(){
			t.showCard(card.id);
			t.closeModal();
		  });
	  }, 1500);
	});
	};
	
	
var createTextForCard = function(estimate){
	var text = '';
	text += '#' + estimate['workType'] + '\n';
	text += '**Cantidad: **' + estimate['quantity'].join(' / ') + '\n';
	text += '**Tamaño cerrado: **' + estimate['clossedSize'] + '\n';
	if (estimate['finishes'].length >0){
		text += '###Terminaciones Generales' + '\n\n';
		for (var i = 0; i < estimate['finishes'].length;i++){
			text += i + '. ' + estimate['finishes'][i]['finish'] + '\n';
			if (estimate['finishes'][i]['finishComment']){
				text += '  - ' + estimate['finishes'][i]['finishComment'] + '\n';
			}
		}
	}
	text +='\n';
	if(estimate['items']){
		for (var i = 0; i< estimate['items'].length;i++){
			text += '##' + estimate['items'][i]['name'] + '\n';
			text += '**Tintas: **' + (estimate['items'][i]['inks']?estimate['items'][i]['inks']+ ' ':'')  + 
					(estimate['items'][i]['inksDetails']?estimate['items'][i]['inksDetails']+' ':'') + 
					(estimate['items'][i]['bleedPrint']?'(Impresión al Vivo)':'') +'\n';
			if (estimate['items'][i]['openedSize']){
				if(estimate['items'][i]['openedSize'] !== estimate['clossedSize']){
					text += '**Tamaño Abierto: **' + estimate['items'][i]['openedSize']  +'\n';
				}
			}
			text += '**Cantidad de páginas: **' + (estimate['items'][i]['quantityOfPages'].join(' / '))  +
					(estimate['items'][i]['allTheSame']?' (Todas iguales)':' (Todas diferentes)') +'\n';
			if (estimate['items'][i]['materials']){	
				var materiales = [];
				for (var j = 0; j < estimate['items'][i]['materials'].length; j++){
					materiales.push(estimate['items'][i]['materials'][j]['paper'] + ' ' + estimate['items'][i]['materials'][j]['gr'] + 'gr');
				}
				if(materiales && materiales.length>0){
					text += '**Materiales: **' + materiales.join(' / ') + '\n'; 
				}
			}
			if (estimate['items'][i]['finishes'].length >0){
				text += '###Terminaciones' + '\n\n';
				for (var j = 0; j < estimate['items'][i]['finishes'].length;j++){
					text += j + '. ' + estimate['items'][i]['finishes'][j]['finish'] + '\n';
					if (estimate['items'][i]['finishes'][j]['comment']){
						text += '  - ' + estimate['items'][i]['finishes'][j]['comment'] + '\n';
					}
				}
				text +='\n';
			}
		}
	}
	if (estimate['comments']){
		text += '**Comentario: **' + estimate['comments']['internalComments']+ '\n';
	}
	if (estimate['customer']){
		text += '##Cliente' + '\n';
		text += estimate['customer']['comenrcialName']?'**Nombre Fantasía: **' + estimate['customer']['comenrcialName'] + '\n':'';
		text += '**Razón Social: **' + estimate['customer']['businessName'] + '\n';
		text += '**RUT: **' + estimate['customer']['rut'] + '\n';
		text += '**Dirección: **' + estimate['customer']['address'] + '\n';
		text += '**Forma de Pago: **' + estimate['customer']['paymentWay'] + '\n';
		text += '####Contacto' + '\n';
		text += '**Nombre: **' + estimate['customer']['contactName'] + '\n';
		text += '**Mail: **' + estimate['customer']['contactEmail'] + '\n';
		text += estimate['customer']['contactPhone']?'**Teléfono: **' + estimate['customer']['contactPhone'] + '\n':'';
	}
	return text;
}

var createTrelloCardName = function(estimate){
	return estimate.quantity + "x" + estimate.workType + " - " + (estimate.customer?estimate.customer.comercialName:'');
}