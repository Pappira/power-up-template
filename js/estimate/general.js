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

var createElement = function(typeValue,className,id,text,type,forValue,value,href,disabled,attirbuteName,attributeValue,innerHTML){
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
	if(innerHTML && innerHTML.length > 0){
		createElement.innerHTML = innerHTML;
	}
	return createElement;
};

var cutArray = function(originalArray,indexToCut){
  var a =  jQuery.grep(originalArray, function(n, i ) {
    return indexToCut?indexToCut.indexOf(i)!=-1:false;
  });
  return a;
}
var createCheckListObject = function(name, cardId){
	return {
		idCard:cardId,
		name:name,
		pos:'bottom'
	};
}



var getEstimate = function(estimate, functionCallBack){
	try{
		estimate = JSON.parse(LZString.decompress(estimate));
	}catch(err){
		console.log('estimate was not compressed'); 
	}
	estimate = deTranslateEstimate(estimate);
	httpGetAsync("http://localhost:8080/api2/googlesheet/estimateid/" + estimate.id,functionCallBack,estimate);
}

var generateEstimate = function(workRequest,functionCallBack){
	httpPostAsync("http://localhost:8080/api2/googlesheet",functionCallBack,workRequest);
}


function httpPostAsync(theUrl, functionCallBack,workRequest)
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
	xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status == 201)){
			estimate = JSON.parse(xmlHttp.responseText);	
			functionCallBack(estimate);
		}
    }
    xmlHttp.send(JSON.stringify(workRequest));
}


function httpGetAsync(theUrl, functionCallBack,estimate)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			estimate.prices = JSON.parse(xmlHttp.responseText).prices;	
			estimate = order(estimate);
			functionCallBack(estimate);
		}
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 1234
    xmlHttp.send(null);
}

var updateCard = function(estimate) {
	startLoader();
	if(estimate.deliveryDelay){
		//TODO Agregar due date a la tarjeta
		// due: mm/dd/yyy
	  }
	var checkLists = createCheckListsForCard(estimate);
	var trelloCheckList = [];
	var trelloCheckListItems = [];
	var estimateToSave = JSON.parse(JSON.stringify(estimate));
	delete estimateToSave.prices;
	estimateToSave = LZString.compress(JSON.stringify(translateEstimate(estimateToSave)));
	t.card('all')
	.then(function(card) {
	  t.set('card', 'shared', cardInfoKey, estimateToSave)
		.then(function(){
			var text = "";
			Promise.all([
				t.get('card', 'shared', 'pappira.id')
			])
			.spread(function(id){
				updateTrelloCard(t, {id: card.id, desc: createTextForCard(estimate), name: id + " - " + createTrelloCardName(estimate)})
				.then(function(){
					return getCheckLists(t,card.id)
					.then(function(currentCheckListsOnCard){
						var currentCheckListsToDelete = [];
						for (var i = 0; i < currentCheckListsOnCard.length;i++){
							currentCheckListsToDelete.push(removeCheckLists(t,currentCheckListsOnCard[i].id));
						}
						return TrelloPowerUp.Promise.all(currentCheckListsToDelete)
						.then(function(){
							for (var i = 0; i < checkLists.length;i++){
								var currentCheckList = createCheckListObject(checkLists[i].name, card.id);
								var checkListToCard = addCheckListToCard(t, currentCheckList,checkLists[i].checkItems)
								.then(function(checkList){
									checkLists.filter(currentCheckList => 
										currentCheckList.name == checkList.name)[0].checkItems.forEach(checkItem => 
											trelloCheckListItems.push(addCheckListItemToCheckList(t,checkItem,checkList.id)));
								});
								trelloCheckList.push(checkListToCard);
							}
						}).then(function(){
							return TrelloPowerUp.Promise.all(trelloCheckList)
							.then(function(){
								return TrelloPowerUp.Promise.all(trelloCheckListItems)
								.then(function(){
									t.closeModal();
								});
							});
						});
					});
				});
			});
			
		});
	});
};

var removeDontUse = function(estimate){
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
	return estimate;
}

var createCard = function(receivedEstimate){
	var estimate = removeDontUse(receivedEstimate);
	var cardToSave = {idList: listId, desc: createTextForCard(estimate), name: createTrelloCardName(estimate)};
	startLoader();
	createNewTrelloCard(t, cardToSave, function(card) {
	  setTimeout(function () {
		delete estimate.prices;
		estimate = LZString.compress(JSON.stringify(translateEstimate(estimate)));
		t.set(card.id, 'shared', cardInfoKey, estimate)
		  .then(function(){
			t.showCard(card.id);
			t.closeModal();
		  });
	  }, 1500);
	});
	};
	
var translateEstimate = function (estimate){
	return convert(estimate,translate);
}

var deTranslateEstimate = function (estimate){
	return convert(estimate,deTranslate);
}

var convert = function(objectToConvert,functionToTranslate){
	if (objectToConvert!=null){
		Object.keys(objectToConvert).forEach(function(key) {
			if(typeof objectToConvert[key] == 'object'){
				var newKey = functionToTranslate(key);
				objectToConvert = rename(objectToConvert,newKey,key);
				convert(objectToConvert[newKey],functionToTranslate);
			}else{
				if(isNaN(key)){
						var newKey = functionToTranslate(key);
						objectToConvert = rename(objectToConvert,newKey,key);
					}
				}
		});
	}
	return objectToConvert;
}

var rename = function(objectToRename, newKey, oldKey){
	if (oldKey !== newKey) {
    Object.defineProperty(objectToRename, newKey,
        Object.getOwnPropertyDescriptor(objectToRename, oldKey));
    delete objectToRename[oldKey];
	}
	return objectToRename;
}
var createCheckListsForCard = function(estimate){
	var checkLists = [];
	if(estimate.SelectedOption){
		var finishes = estimate.prices[estimate.SelectedOption].mandatoryFinishes;
		finishes = finishes.concat(estimate.selectedExtraPrices);
		finishes = finishes.concat(estimate.prices[estimate.SelectedOption].items.map(item => item.mandatoryFinishes).flat(1));
		finishes.filter(Boolean).forEach(finish => {
			if(finish.ordinal && finish.ordinal>0){
				var item = finish.name + (finish.comment && finish.comment!=""?' - ' +finish.comment:'');
				var name = finish.itemOrdinal==-1?"Terminaciones Generales":"Terminaciones de " + estimate.work.items[finish.itemOrdinal].name;
				var checkList = checkLists.filter(currentCheckList => currentCheckList.name == name);
				if(checkList && checkList.length==1){
					checkList = checkList[0];
				}else{
					checkList = {
						name:name,
						checkItems:[]
					};
					checkLists.push(checkList);
				}
				checkList.checkItems.push(
					{
						checkListName: name,
						checked: false,
						name: item,
						pos: finish.ordinal
					}
				);
			}
		});
	}
return checkLists;
}

var convertTextForCard = function(text){
	switch(text.type){
		case 'title':
		return '#' + text.name + '\n';
		
		case 'subtitle1':
		return '##' + text.name + '\n';
		
		case 'subtitle2':
		return '###' + text.name + '\n';
		
		case 'subtitle3':
		return '####' + text.name + '\n';
		
		case 'subtitle4':
		return '#####' + text.name + '\n';
		
		case 'text':
		return '**' + text.name + ': **' + text.value + '\n';
		
		case 'list':
		var thisText = '1. ' + text.name + '\n';
		if (Array.isArray(text.value)){
			for (var j = 0; j < text.value.length;j++){
				thisText += '  - ' + text.value[j] + '\n';
			}
		}else if (text.value && text.value.length>0){
			thisText += '  - ' + text.value + '\n';
		}
		return thisText + '\n';
	}
}

function add(accumulator, a) {
	return accumulator + a;
}

var createTextForCard = function(estimate){
	var texts = createGeneralText(estimate,true);
	for (var i = 0; i < estimate.work.items.length;i++){
		texts = texts.concat(createItemText(estimate,estimate.work.items[i],true,true,true,false,true));
	}
	texts = texts.concat(createCommentsText(estimate,true,false)); 

	texts = texts.concat(createPriceText(estimate,getExtraPricesFromEstimate(estimate))); 

	texts = texts.concat(createCustomerText(estimate));

	var text = ''; 
	for (var i = 0; i < texts.length;i++){
		text +=convertTextForCard(texts[i]);
	}
	return text;
}

var createText = function(type,name,value){
	return {
		type: type,
		name: name?name+'':name,
		value: (!value || Array.isArray(value))?value:value+''
	};
}

var getExtraPricesFromEstimate = function(estimate){
	var extraPrice = 0;
	if(estimate.selectedExtraPrices && estimate.selectedExtraPrices.length > 0){
		return estimate.selectedExtraPrices.map(extraPrice => extraPrice.price).reduce(add);
	}
	return extraPrice;
}

var createOptionalFinishesText = function(estimate,dontTakeCareOfSelectedOption){
	var selectedOption = estimate.SelectedOption!=null && !dontTakeCareOfSelectedOption;
	var texts = [];
	if (estimate.optionalFinishes && estimate.optionalFinishes.length >0){
		if(!selectedOption){
			estimate.optionalFinishes.sort(sortOptionalFinishes());
			var names = estimate.optionalFinishes.map(optionalFinish => optionalFinish.name);
			var uniqueNames = names.filter(function(item, pos) {
				return names.indexOf(item) == pos;
			});
			uniqueNames.forEach(name => {
				var currentFinishes = estimate.optionalFinishes.filter(optionalFinish => optionalFinish.name == name);
				texts.push(createText('subtitle3','Opcional ' + currentFinishes[0].name  + ((currentFinishes[0].itemOrdinal!=-1 && estimate.work.items.length>1)?' en ' + estimate.work.items.filter(item => item.ordinal == currentFinishes[0].itemOrdinal)[0].name:''),''));
				currentFinishes.forEach(currentFinish => {
					texts.push(createText('text','Sub-Total extra (' + currentFinish.quantity + ' unidades)', '$ ' +  currentFinish.price.toLocaleString() + ' + IVA'));
				});
			});
		}else{
			finishes = groupFinishes(estimate.selectedExtraPrices);
			
		}
		//texts = [].concat.apply([],finishes.map(finish => [].concat.apply([],[createText('subtitle3','Opcional ' + finish.finish  + ((finish.item!=-1 && estimate.items.length>1)?' en ' + estimate.items[finish.item].name:''),''), finish.price.map(price => createText('text','Sub-Total extra (' + price.quantity + ' unidades)', '$ ' +  price.price.toLocaleString() + ' + IVA'))])));
	}
	return texts;
}

var createMandatoryFinishText = function(currentMandatoryFinish, text, includeOpcional){
	if (currentMandatoryFinish.showToClient){
		var group = currentMandatoryFinish.name.split(" ")[0];
		var name = currentMandatoryFinish.name.split(" ");
		delete name[0];
		name = name.filter(Boolean).join(" ");
		var currentText = text.filter(currentText => currentText.name == group);
		if (currentText && currentText.length>0){
			currentText[0].value = currentText[0].value.substr(0,currentText[0].value.indexOf(" (opcional)")>0?currentText[0].value.indexOf(" (opcional)"):currentText[0].value.length) + " // " + name + (includeOpcional?" (opcional)":"");
		}else{
			text.push(createText('text',group,name + (includeOpcional?" (opcional)":"")));
		}
	}
	return text;
}

var createGeneralText = function(estimate,includeOptionalFinishes,dontTakeCareOfSelectedOption){  
	var text = [];
	var selectedOption = estimate.SelectedOption!=null && !dontTakeCareOfSelectedOption;
	text.push(createText('title',estimate.work.name,''));
	text.push(createText('text','Cantidad',(selectedOption?estimate.prices[estimate.SelectedOption].quantity:estimate.work.quantity.join(' // '))));
	text.push(createText('text','Tamaño cerrado',(selectedOption?estimate.prices[estimate.SelectedOption].closedSize:estimate.work.closedSize.join(' // '))));
	if (estimate.work.mandatoryFinishes && estimate.work.mandatoryFinishes.length >0){	
		var currentMandatoryFinish  = estimate.work.mandatoryFinishes;
		if(!(!selectedOption || dontTakeCareOfSelectedOption)){
			currentMandatoryFinish = estimate.prices[estimate.SelectedOption].mandatoryFinishes;
		}
		for(var i = 0; i < currentMandatoryFinish.length;i++){
			text = createMandatoryFinishText(currentMandatoryFinish[i],text);
		}
	}
	if (estimate.work.optionalFinishes && estimate.work.optionalFinishes.length >0){
		var currentOptionalFinish = estimate.work.optionalFinishes;
		if(!(!selectedOption || dontTakeCareOfSelectedOption)){
			currentOptionalFinish = estimate.selectedExtraPrices;
		}
		var notTitlePlaced = true;
		for(var i = 0; i < currentOptionalFinish.length;i++){
			if (includeOptionalFinishes){
				if(notTitlePlaced){
					text.push(createText('subtitle2','Terminaciones',''));
					notTitlePlaced = false;
				}
				text.push(createText('list',currentOptionalFinish[i].name + (currentOptionalFinish[i].comment && currentOptionalFinish[i].comment!=""?" (" + currentOptionalFinish[i].comment + ")":''),''));
			}else{
				text = createMandatoryFinishText(currentOptionalFinish[i],text,true);
			}
		}
	}
	return text;
}
var createItemText = function(estimate, item, showBleedPrint, showAllDifferentPages, showOptionalFinishes,dontTakeCareOfSelectedOption,showPrivatePrinterInformation){
	var texts = [];
	var selectedItem;
	var selectedOption = estimate.SelectedOption!=null && !dontTakeCareOfSelectedOption;
	if(item){
		if (selectedOption){
			if(item.ordinal!=null){
				selectedItem = estimate.prices[estimate.SelectedOption].items.filter(currentItem => currentItem.ordinal == item.ordinal)[0];
			}else{
				selectedItem = item;
			}
		}
		if (estimate.work.items.length>1){
			texts.push(createText('subtitle1',item.name + (item.comment?' con ' + item.comment:''),''));
		}
		if (selectedItem){
			if(selectedItem.material){
				texts.push(createText('text','Papel', selectedItem.material.name + ' ' + selectedItem.material.gr + 'gr'));
			}
			if(selectedItem.ink){
				var inks = selectedItem.ink.inksDetails + (showBleedPrint?(selectedItem.bleedPrint?'(Impresión al Vivo)':''):'');
    			inks += ' - ' + (selectedItem.faces=='DOBLE_FAZ'?'Doble faz':'Simple faz');
	    		texts.push(createText('text','Impresión',inks));
			}
			if (selectedItem.openedSize && selectedItem.openedSize != estimate.work.closedSize){
				texts.push(createText('text','Tamaño Abierto',selectedItem.openedSize));
			}
			if (selectedItem.quantityOfPages && selectedItem.quantityOfPages !=1){
				var quantityOfPages = selectedItem.quantityOfPages + (selectedItem.allTheSame?' (Todas iguales)':(showAllDifferentPages?' (Todas diferentes)':''));
				texts.push(createText('text','Páginas',quantityOfPages));
			}
			if (selectedItem.quantityOfSheets && selectedItem.quantityOfSheets !=1){
				var quantityOfSheets = selectedItem.quantityOfSheets + (selectedItem.allTheSame?' (Todas iguales)':(showAllDifferentPages?' (Todas diferentes)':''));
				texts.push(createText('text','Hojas',quantityOfSheets));
			}



			if (selectedItem.mandatoryFinishes && selectedItem.mandatoryFinishes.length >0){	
				var currentMandatoryFinish  = selectedItem.mandatoryFinishes;
				for(var i = 0; i < currentMandatoryFinish.length;i++){
					texts = createMandatoryFinishText(currentMandatoryFinish[i],texts);
				}
			}

			var notTitlePlaced = true;
			if (estimate.selectedExtraPrices){
				var currentOptionalFinish = estimate.selectedExtraPrices;	
				for(var i = 0; i < currentOptionalFinish.length;i++){	
				    if(currentOptionalFinish[i].itemOrdinal == selectedItem.ordinal){
						if (showOptionalFinishes){
							if (notTitlePlaced){
								texts.push(createText('subtitle2','Terminaciones',''));
								notTitlePlaced = false;
							}
						}
						if (showOptionalFinishes){
							texts.push(createText('list',currentOptionalFinish[i].name + (currentOptionalFinish[i].comment && currentOptionalFinish[i].comment!=""?" (" + currentOptionalFinish[i].comment + ")":''),''));
						}else{
							texts = createMandatoryFinishText(currentOptionalFinish[i],texts,true);
						}
					}
				}
			}
			if(showPrivatePrinterInformation && estimate.SelectedOption){
				texts.push(createText('text','Hoja', selectedItem.processDetails.sheetSize + " cortado en " + selectedItem.processDetails.cutsPerSheet));
				texts.push(createText('text','Pliego', selectedItem.processDetails.paperSize + " armado de a " + selectedItem.processDetails.quantityPerPaper + " (" + selectedItem.processDetails.excess + " de demasía)"));
				texts.push(createText('text','Máquina', selectedItem.processDetails.machine));
			}  
			if(selectedItem.subItem){
				texts = texts.concat(createItemText(estimate,selectedItem.subItem,true,true,true,false,true));
			}
		}else{
			if (item.material){
				var materials = item.material.map(material => material.name + " " + material.gr + 'gr').join(' // ');
				texts.push(createText('text','Papel',materials));
			}
			if (item.ink){
					var inks = item.ink.map(ink => ink.inksDetails).join(' // ') + (showBleedPrint?' ' + (item.bleedPrint?'(Impresión al Vivo)':''):'');
					inks += (item.faces?' - ' + item.faces.map(faz => faz=='DOBLE_FAZ'?'Doble faz':'Simple faz').join(' // '):'');
					texts.push(createText('text','Impresión',inks));
			}
			if (item.openedSize && (JSON.stringify(item.openedSize.sort()) != JSON.stringify([...new Set(estimate.prices.map(price => price.closedSizes))].sort()))){
				texts.push(createText('text','Tamaño Abierto',item.openedSize.join(' // ')));
			}
			if (item.quantityOfPages){
				item.quantityOfPages = item.quantityOfPages.filter(Boolean);
				if (item.quantityOfPages.length>1 || (item.quantityOfPages.length==1 && item.quantityOfPages!=1)){
					var quantityOfPages = item.quantityOfPages.join(' // ') + (item.allTheSame?' (Todas iguales)':(showAllDifferentPages?' (Todas diferentes)':''))
					texts.push(createText('text','Páginas',quantityOfPages));
				}
			}
			if (item.quantityOfSheets){
				item.quantityOfSheets = item.quantityOfSheets.filter(Boolean);
				if(item.quantityOfSheets.length>1 || (item.quantityOfSheets.length==1 && item.quantityOfSheets!=1)){
					var quantityOfSheets = item.quantityOfSheets.join(' // ') + (item.allTheSame?' (Todas iguales)':(showAllDifferentPages?' (Todas diferentes)':''))
					texts.push(createText('text','Hojas',quantityOfSheets));
				}
			}
			if (item.mandatoryFinishes && item.mandatoryFinishes.length >0){	
				var currentMandatoryFinish  = item.mandatoryFinishes;
				for(var i = 0; i < currentMandatoryFinish.length;i++){
					texts = createMandatoryFinishText(currentMandatoryFinish[i],texts);
				}
			}

			var notTitlePlaced = true;
			if (item.optionalFinishes && item. optionalFinishes.length >0){
				if (showOptionalFinishes){
					if (notTitlePlaced){
						texts.push(createText('subtitle2','Terminaciones',''));
						notTitlePlaced = false;
					}
				}
				var currentOptionalFinish = item.optionalFinishes;				
				for(var i = 0; i < currentOptionalFinish.length;i++){
					if (showOptionalFinishes){
						texts.push(createText('list',currentOptionalFinish[i].name + (currentOptionalFinish[i].comment && currentOptionalFinish[i].comment!=""?" (" + currentOptionalFinish[i].comment + ")":''),''));
					}else{
						texts = createMandatoryFinishText(currentOptionalFinish[i],texts,true);
					}
				}
			}
		
		}
		return texts;
	}
}

var createCommentsText = function(estimate, showInternalComments, showCustomerComments){
	var texts =[];
	if (estimate.comments){
		if (showInternalComments){
			texts.push(createText('subtitle1','Comentario: ' + estimate.comments.internalComments,''));
		}
		if(showCustomerComments){
			texts.push(createText('subtitle1','Comentario: ' + estimate.comments.clientComments,''));
		}
	}
	return texts;
}

var createVariant = function(currentItem, originalValue, route, relatedVariants, textValue,putItemName){
	variant = {
		"originalValue": JSON.parse(JSON.stringify(originalValue)),
		"route": JSON.parse(JSON.stringify(route))
	};
	var newVariant;
	if (relatedVariants && relatedVariants.length>0){
		relatedVariants.forEach(currentRelatedVariant =>
		{
			newVariant = JSON.parse(JSON.stringify(currentRelatedVariant));
			newVariant.variant.push(variant);
			newVariant.text = currentRelatedVariant.text + textValue;
		});
	}else{
		var text = 	(putItemName?currentItem.name + ' ':'') + textValue;
		newVariant = {
			"variant": [variant],
			"text": text
		};
	}
	return newVariant;

}

var getInsidePriceObjectByRoute = function(price,route){
	var routes = route.split(".");
	var currentItem = price;
	routes.forEach(currentRoute => {
		var number;
		var name;
		if(currentRoute.indexOf("[")>-1){
			number = currentRoute.match('\\[([0-9]*?)\\]')[1];
			name = currentRoute.match('\(.*?)\[[0-9]*?\]')[1];
		}else{
			name = currentRoute;
		}
		if (number !=null){
			currentItem = currentItem[name][number];
		}else{
			currentItem = currentItem[name];
		}
		return currentItem;
	});
	return currentItem;
}

var createCompletePriceText = function(estimate){
	textToAdd = [];
	if(estimate.prices){
			if (estimate.prices.length>1){
				textToAdd.push(createText('subtitle1','Precios', ''));  
			}

			//var lastPriceText = '';
			var lastGeneralFinishesText = '';
			var isList = false;
			
			//Hay variación en los papeles?
			var quantityOfPapersOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.material).size>1);

			//Hay variación en los tamaños?
			var quantityOfSizesOnOriginalEstimate = estimate.work.items.map(currentItem =>  typeof currentItem.openedSize =='object' && new Set(currentItem.openedSize).size>1);

			//Hay variación en tintas?
			var quantityOfInksOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.ink).size>1);

			//Hay variación en faces
			var quantityOfFacesOnOriginalEstimate = estimate.work.items.map(currentItem =>  typeof currentItem.faces =='object' && new Set(currentItem.faces).size>1);
			
			//Hay variación en páginas
			var quantityOfPagesOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.quantityOfPages).size>1);

			//Hay variación en hojas
			var quantityOfSheetsOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.quantityOfSheets).size>1);

			//Hay variación en vías
			var quantityOfViasOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.quantityOfVias).size>1);

			var inksVariants = [];
			var facesVariants = [];
			var sizeVariants = [];
			var materialVariants = [];
			var quantityOfPagesVariants = [];
			var quantityOfSheetsVariants = [];
			var quantityOfViasVariants = [];
			var closedSizeVariants = [];
			var mandatoryFinishVariants = [];
			var mandatoryFinishItemVariants = [];
			estimate.work.items.forEach(currentItem => 
			{
				if (new Set(currentItem.ink).size>1){
					var putItemName = quantityOfInksOnOriginalEstimate.filter(v => v).length>1 || quantityOfFacesOnOriginalEstimate.filter(v => v).length>1;
					currentItem.ink.forEach(currentInk => 
					{
						inksVariants.push(createVariant(currentItem,currentInk,"items[" + currentItem.ordinal + "].ink",null,currentInk.inksDetails,putItemName));
					});
				}
				if(new Set(currentItem.faces).size>1){
					var putItemName = quantityOfInksOnOriginalEstimate.filter(v => v).length>1 || quantityOfFacesOnOriginalEstimate.filter(v => v).length>1;
					currentItem.faces.forEach(currentFace =>
					{
						facesVariants.push(createVariant(currentItem, currentFace, "items[" + currentItem.ordinal + "].faces", inksVariants, (currentFace =='DOBLE_FAZ'?'Doble faz':'Simple faz'),putItemName));
					});
					inksVariants = [];
				}
				if(typeof currentItem.openedSize =='object' && new Set(currentItem.openedSize).size>1){
					var putItemName = quantityOfSizesOnOriginalEstimate.filter(v => v).length>1;
					currentItem.openedSize.forEach(currentOpenedSize =>
					{
						sizeVariants.push(createVariant(currentItem, currentOpenedSize, "items[" + currentItem.ordinal + "].openedSize", null, currentOpenedSize,putItemName));
					
					});
				}
				if(new Set(currentItem.material).size>1){
					var putItemName = quantityOfPapersOnOriginalEstimate.filter(v => v).length>1;
					currentItem.material.forEach(currentMaterial =>
					{
						materialVariants.push(createVariant(currentItem, currentMaterial, "items[" + currentItem.ordinal + "].material", null, currentMaterial.name + ' '  + currentMaterial.gr + 'gr' ,putItemName));
					});
				}
				if(new Set(currentItem.quantityOfPages).size>1){
					var putItemName =  quantityOfPagesOnOriginalEstimate.filter(v => v).length>1 || quantityOfViasOnOriginalEstimate.filter(v => v).length>1;
					currentItem.quantityOfPages.forEach(currentQuantityOfPages =>
					{
						quantityOfPagesVariants.push(createVariant(currentItem, currentQuantityOfPages, "items[" + currentItem.ordinal + "].quantityOfPages", null,  currentQuantityOfPages + ' páginas ',putItemName));
					});
				}
				if(new Set(currentItem.quantityOfSheets).size>1){
					var putItemName =  quantityOfSheetsOnOriginalEstimate.filter(v => v).length>1 || quantityOfViasOnOriginalEstimate.filter(v => v).length>1;
					currentItem.quantityOfSheets.forEach(currentQuantityOfSheets =>
					{
						quantityOfSheetsVariants.push(createVariant(currentItem, currentQuantityOfSheets, "items[" + currentItem.ordinal + "].quantityOfSheets", null, currentQuantityOfSheets + ' páginas ',putItemName));
					});
				}
				if (new Set(currentItem.quantityOfVias).size>1){
					var putItemName =  quantityOfSheetsOnOriginalEstimate.filter(v => v).length>1 || quantityOfPagesOnOriginalEstimate.filter(v => v).length>1 || quantityOfViasOnOriginalEstimate.filter(v => v).length>1;
					currentItem.quantityOfVias.forEach(currentQuantityOfVias =>
					{
						quantityOfViasVariants.push(createVariant(currentItem, currentQuantityOfVias, "items[" + currentItem.ordinal + "].quantityOfVias", (quantityOfSheetsVariants.length>0?quantityOfSheetsVariants:(quantityOfSheetsVariants.length>0?quantityOfSheetsVariants:null)), currentQuantityOfVias + ' vías ',putItemName));
					});
					quantityOfSheetsVariants = [];
					quantityOfPagesVariants = [];
				}
				if(currentItem.mandatoryFinishes && currentItem.mandatoryFinishes.length>1){
					var currentMandatoryFinishes = JSON.parse(JSON.stringify(currentItem.mandatoryFinishes));
					currentMandatoryFinishes = currentMandatoryFinishes.filter(currentMandatoryFinish => currentMandatoryFinish.showToClient);
					while (currentMandatoryFinishes.length>1){
						var similarMandatoryFinishes = currentMandatoryFinishes.filter(currentMandatoryFinish => currentMandatoryFinish.name.indexOf(currentMandatoryFinishes[0].name.substr(0,currentMandatoryFinishes[0].name.indexOf(" "))))
						if(similarMandatoryFinishes.length>1){
							similarMandatoryFinishes.forEach(currentSimilarMandatoryFinish =>
							{
								mandatoryFinishItemVariants.push(createVariant(null, currentSimilarMandatoryFinish, "items[" + currentItem.ordinal + "]mandatoryFinishes", null, currentSimilarMandatoryFinish.name,false));
								currentMandatoryFinishes.splice(currentMandatoryFinishes.indexOf(currentSimilarMandatoryFinish),1); //borra el primer elemento con el que acabo de trabajar
							});
						}else{
							currentMandatoryFinishes.splice(0,1); //borra el primer elemento con el que acabo de trabajar
						}
					}	
				}
			});

			if(estimate.work.closedSize.length>1){
				estimate.work.closedSize.forEach(currentClosedSize =>
				{
					closedSizeVariants.push(createVariant(null, currentClosedSize, "closedSize", null, 'Tamaño ' + currentClosedSize,false));
				});
			}

			if(estimate.work.mandatoryFinishes && estimate.work.mandatoryFinishes.length>1){
				var currentMandatoryFinishes = JSON.parse(JSON.stringify(estimate.work.mandatoryFinishes));
				currentMandatoryFinishes = currentMandatoryFinishes.filter(currentMandatoryFinish => currentMandatoryFinish.showToClient);
				while (currentMandatoryFinishes.length>0){
					var similarMandatoryFinishes = currentMandatoryFinishes.filter(currentMandatoryFinish => currentMandatoryFinish.name.indexOf(currentMandatoryFinishes[0].name.substr(0,currentMandatoryFinishes[0].name.indexOf(" "))))
					if(similarMandatoryFinishes.length>1){
						similarMandatoryFinishes.forEach(currentSimilarMandatoryFinish =>
						{
							mandatoryFinishVariants.push(createVariant(null, currentSimilarMandatoryFinish, "mandatoryFinishes", null, currentSimilarMandatoryFinish.name,false));
							currentMandatoryFinishes.splice(currentMandatoryFinishes.indexOf(currentSimilarMandatoryFinish),1); //borra el primer elemento con el que acabo de trabajar
						});
					}else{
						currentMandatoryFinishes.splice(0,1); //borra el primer elemento con el que acabo de trabajar
					}
				}	
			}
			var variants = [mandatoryFinishVariants, closedSizeVariants, sizeVariants, materialVariants, inksVariants, facesVariants, quantityOfPagesVariants, quantityOfSheetsVariants, 
							quantityOfViasVariants, mandatoryFinishItemVariants];
			variants = variants.filter(n => n!=null && n!="" && n.length>0);

			var combinations = cartesian.apply(null,variants); //este apply null se hace para separar el array, que es como cartesian necesita recibirlo
			var lastTitle = [];
			combinations.forEach(combination =>
			{
				var i = 0;
				var titleChanged = false;
				var prices = JSON.parse(JSON.stringify(estimate.prices));
				var firstTitleNumber = 7 - combination.length + 1;
				combination.forEach(currentVariants =>
				{
					currentVariants.variant.forEach(variant =>{
						prices = prices.filter(price => JSON.stringify(getInsidePriceObjectByRoute(price,variant.route)) == JSON.stringify(variant.originalValue));
					});
				});
				if (prices.length>0){
				    combination.forEach(currentVariants =>
				    {
					
						if(lastTitle[i] != currentVariants.text || titleChanged){
							var arrow = '';
							if (i>0){
								if(titleChanged){
									arrow = String.fromCharCode("8618");
								}else{
									arrow = '↳';
								}
							}
							textToAdd.push(createText('subtitle' + (firstTitleNumber + i) + "price", currentVariants.text, "  ".repeat(i) + arrow));  
							titleChanged = true;
							lastTitle[i] = currentVariants.text;
						}
					    i++;
					});
				
					var isFirst = true;
					prices.forEach(price =>
					{
							//Si estoy agregando una variante nueva (que no solo cambia en la cantidad)
							if(isFirst){
								textToAdd.push(createText('list', 'Sub-Total (' + price.quantity + ' unidades)', '$ ' + price.totalPrice.toLocaleString() + ' + IVA'));  
								isFirst = false;
							}else{
								textToAdd[textToAdd.length-1].value.push(['Sub-Total (' + price.quantity + ' unidades)','$ ' + price.totalPrice.toLocaleString() + ' + IVA']);  
							}
					})
				}
			});
	}
	return textToAdd;
}

function cartesian() {
    var r = [], arg = arguments, max = arg.length-1;
    function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}

var createPriceText = function(estimate,extraPrice){
	var texts = [];
	if (estimate.SelectedOption){
		texts.push(createText('subtitle1','Precio: $' + (estimate.prices[estimate.SelectedOption].totalPrice + extraPrice).toLocaleString() + ' + IVA' ,''));
	}
	return texts;
}

var createCustomerText = function(estimate){
	var customer = estimate.customer;
	var texts = [];
	if (customer){
		texts.push(createText('subtitle1','Cliente' ,''));
		if (customer.comercialName){
			texts.push(createText('text','Nombre Fantasía' ,customer.comercialName ));
		}
		if (customer.businessName){
			texts.push(createText('text','Razón Social' ,customer.businessName ));
		}
		if (customer.rut){
			texts.push(createText('text','RUT' ,customer.rut ));
		}
		if (customer.address){
			texts.push(createText('text','Dirección' ,customer.address ));
		}
		if (estimate.paymentWay){
			texts.push(createText('text','Forma de Pago' ,estimate.paymentWay ));
		}
		texts.push(createText('subtitle3','Contacto' ,''));
		if (customer.contactName){
			texts.push(createText('text','Nombre' ,customer.contactName ));
		}		
		if (customer.contactEmail){
			texts.push(createText('text','Mail' ,customer.contactEmail ));
		}
		if (customer.contactPhone){
			texts.push(createText('text','Teléfono' ,customer.contactPhone ));
		}
	}
	return texts;
}

var createTrelloCardName = function(estimate){
	var contactAndBusinessInfo = estimate.customer?[estimate.customer.comercialName, estimate.customer.businessName, estimate.customer.contactName]:[];
	var quantity = estimate.work.quantity.join(' // ');
	if (estimate.SelectedOption){
		quantity = estimate.prices[estimate.SelectedOption].quantity;
	}
	return quantity + " " + estimate.work.name + " - " + contactAndBusinessInfo.filter(Boolean).join(' - ');
}

function sortOptionalFinishes(order = 'asc'){
	return function(a,b){
		let comparison = 0;
		if(a.itemOrdinal > b.itemOrdinal){
			return ((order == 'desc') ? -1:1);
		} else if (a.itemOrdinal <  b.itemOrdinal) {
			return ((order == 'desc') ? 1:-1);
		}else if(a.name > b.name){
			return ((order == 'desc') ? -1:1);
		} else if (a.name <  b.name) {
			return ((order == 'desc') ? 1:-1);
		}else if (a.quantity > b.quantity){
			return ((order == 'desc') ? -1:1);
		} else if (a.quantity <  b.quantity) {
			return ((order == 'desc') ? 1:-1);
		}
	}
} 

var order = function(estimate){
	estimate.prices.forEach(price => price.items.sort(orderItems()));
	estimate.prices.sort(compareValues());
	return estimate;
}

function orderItems(order = 'asc'){
	return function(a,b){
		let comparison = 0;
		if(a.ordinal > b.ordinal){
			return ((order == 'desc') ? -1:1);
		} else if (a.ordinal <  b.ordinal) {
			return ((order == 'desc') ? 1:-1);
		}
		return 0;
	}
}

function compareValues(order='asc') {
    return function(a, b) {
		let comparison = a.quantity - b.quantity;
		if(a.mandatoryFinish && b.mandatoryFinish){
			if (a.mandatoryFinish.length == b.mandatoryFinish.length){
				for (var j = 0; j < a.mandatoryFinish.length;j++){
					const varA = (typeof a.mandatoryFinish[j].finishes.finish === 'string') ?a.mandatoryFinish[j].finishes.finish.toUpperCase() : a.mandatoryFinish[j].finishes.finish;
					const varB = (typeof b.mandatoryFinish[j].finishes.finish === 'string') ?b.mandatoryFinish[j].finishes.finish.toUpperCase() : b.mandatoryFinish[j].finishes.finish;
					if (a.mandatoryFinish[j].finishes.finish != b.mandatoryFinish[j].finishes.finish){
						if (varA > varB) {
							return ((order == 'desc') ? -1:1);
						} else if (varA < varB) {
							return ((order == 'desc') ? 1:-1);
						}
					}
				}
			}
		}
		if(a.closedSize && b.closedSize){
			if (a.closedSize > b.closedSize) {
				return ((order == 'desc') ? -1:1);
			} else if (a.closedSize < b.closedSize) {
				return ((order == 'desc') ? 1:-1);
			}
		}
        key = ['material','openedSize','ink','faces','quantityOfPages','quantityOfSheets','quantityOfVias'];
        if(a.items.length==b.items.length){
            for (var j = 0; j < a.items.length;j++){
                var item1 = a.items[j];
                var item2 = b.items[j];
                for (var i = 0; i < key.length;i++){
                    var currentKey = key[i];
                    const varA = (typeof item1[currentKey] === 'string') ?item1[currentKey].toUpperCase() : item1[currentKey];
                    const varB = (typeof item2[currentKey] === 'string') ?item2[currentKey].toUpperCase() : item2[currentKey];
                    if(typeof varA !='object'){
                        if (varA > varB) {
                            return ((order == 'desc') ? -1:1);
                        } else if (varA < varB) {
                            return ((order == 'desc') ? 1:-1);
                            
                        }
                    }else{
                        for (var currentKey in varA) {
                            var varAA = (typeof varA[currentKey] === 'string') ? varA[currentKey].toUpperCase() :  varA[currentKey];
                            var varBA = (typeof varB[currentKey] === 'string') ? varB[currentKey].toUpperCase() :  varB[currentKey];
                            if (varAA > varBA) {
                                return ((order == 'desc') ? -1:1);
                            } else if (varAA < varBA) {
                                return ((order == 'desc') ? 1:-1);
                                
                            }
                        }
                    }
               }      

            }
        }else{
            return a.items.length - b.items.length;
        }
       return ((order == 'desc') ? (comparison * -1) : comparison);
    }
}



