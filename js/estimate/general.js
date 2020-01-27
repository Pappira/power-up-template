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
	prices = httpGetAsync("http://localhost:8080/api2/googlesheet/estimateid/" + estimate.id,functionCallBack,estimate)
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
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
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
									for (var i = 0; i < checkLists.length;i++){
										if(checkLists[i].name == checkList.name){
											for (var j = 0; j < checkLists[i].checkItems.length;j++){ 
												trelloCheckListItems.push(addCheckListItemToCheckList(t,checkLists[i].checkItems[j],checkList.id));
											}
											break;
										}
									}
								})
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


var createCard = function(estimate){
	var cardToSave = {idList: listId, desc: createTextForCard(estimate), name: createTrelloCardName(estimate)};
	startLoader();
	createNewTrelloCard(t, cardToSave, function(card) {
	  setTimeout(function () {
		var estimateToSave = JSON.parse(JSON.stringify(estimate));
		delete estimateToSave.prices;
		t.set(card.id, 'shared', cardInfoKey, estimateToSave)
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
		var generalCheckList = {
			name:"Terminaciones Generales",
			checkItems:[]
		};
		if (estimate.work.mandatoryFinishes && estimate.work.mandatoryFinishes.length >0){
			var currentMandatoryFinishGroups = estimate.work.mandatoryFinishes;
			if(estimate.SelectedOption!=null){
				currentMandatoryFinishGroups = estimate.prices[estimate.SelectedOption].mandatoryFinishes;
				for (var i = 0; i < currentMandatoryFinishGroups.length;i++){
					var item = currentMandatoryFinishGroups[i].name + (currentMandatoryFinishGroups[i].comment && currentMandatoryFinishGroups[i].comment!=""?' - ' +currentMandatoryFinishGroups[i].comment:'');
					generalCheckList.checkItems.push(
						{
							checkListName: "Terminaciones Generales",
							checked:false,
							name:item,
							pos:'bottom'
						}
					);
				}
			}
		}
		if (estimate.optionalFinishes && estimate.optionalFinishes.length >0){
			if(estimate.SelectedOption!=null){
				var optionalFinishesPrices = estimate.selectedExtraPrices;
				for (var i = 0; i < optionalFinishesPrices.length; i++){
					if (optionalFinishesPrices[i].itemOrdinal == -1){
						var item = optionalFinishesPrices[i].name + 
						(optionalFinishesPrices[i].comment && optionalFinishesPrices[i].comment!=""?' - ' +optionalFinishesPrices[i].comment:'');
						generalCheckList.checkItems.push(
							{
								checkListName: "Terminaciones Generales",
								checked:false,
								name:item,
								pos:'bottom'
							}
						);
					}
				}
			}
		}
		if(generalCheckList.checkItems.length>0){
			checkLists.push(generalCheckList);
		}
		for (var i = 0; i< estimate.work.items.length;i++){
			var currentCheckList = {
				name:"Terminaciones de " + estimate.work.items[i].name,
				checkItems:[]
			};
			if (estimate.work.items[i].mandatoryFinishes && estimate.work.items[i].mandatoryFinishes.length >0){
				var currentItemMandatoryFinishGroups = estimate.work.items[i].mandatoryFinishes;
				if(estimate.SelectedOption!=null){
					currentItemMandatoryFinishGroups = estimate.prices[estimate.SelectedOption].items.filter(currentItem => currentItem.ordinal == estimate.work.items[i].ordinal)[0].mandatoryFinishes;
					for (var k = 0; k < currentItemMandatoryFinishGroups.length;k++){
						var item = currentItemMandatoryFinishGroups[k].name +
						(currentItemMandatoryFinishGroups[k].comment && currentItemMandatoryFinishGroups[k].comment!=''?' - ' +currentItemMandatoryFinishGroups[k].comment:'');
						currentCheckList.checkItems.push(
							{
								checkListName: "Terminaciones de " + estimate.work.items[i].name,
								checked:false,
								name:item,
								pos:'bottom'
							}
						);
					}
				}
			}
			if (estimate.work.items[i].optionalFinishes && estimate.work.items[i].optionalFinishes.length >0){
				if(estimate.SelectedOption!=null){
					var optionalFinishesPrices = estimate.selectedExtraPrices;
					for (var j = 0; j < optionalFinishesPrices.length; j++){
						if(optionalFinishesPrices[j].itemOrdinal == estimate.work.items[i].ordinal){
							var item = optionalFinishesPrices[j].name +  
							(optionalFinishesPrices[j].items[i].comment && optionalFinishesPrices[j].items[i].comment!=""?' - ' + optionalFinishesPrices[j].comment:'');
							currentCheckList.checkItems.push(
								{
									checkListName: "Terminaciones de " + estimate.items[i].name,
									checked:false,
									name:item,
									pos:'bottom'
								}
							);
							
						}
					}
				}
			}
			if(currentCheckList.checkItems.length>0){
				checkLists.push(currentCheckList);
			}
		}
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
	return text;
}

var createGeneralText = function(estimate,includeOptionalFinishes,dontTakeCareOfSelectedOption){  
	var text = [];
	var selectedOption = estimate.SelectedOption!=null && !dontTakeCareOfSelectedOption;
	text.push(createText('title',estimate.work.name,''));
	text.push(createText('text','Cantidad',(selectedOption?estimate.prices[estimate.SelectedOption].quantity:estimate.work.quantity.join(' // '))));
	text.push(createText('text','Tamaño cerrado',estimate.work.closedSize));
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
		if (includeOptionalFinishes){
			text.push(createText('subtitle2','Terminaciones',''));
		}
		var currentOptionalFinish = estimate.work.optionalFinishes;
		if(!(!selectedOption || dontTakeCareOfSelectedOption)){
			currentOptionalFinish = estimate.selectedExtraPrices;
		}
		for(var i = 0; i < currentOptionalFinish.length;i++){
			if (includeOptionalFinishes){
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
			selectedItem = estimate.prices[estimate.SelectedOption].items.filter(currentItem => currentItem.ordinal == item.ordinal)[0];
		}
		if (estimate.work.items.length>1){
			texts.push(createText('subtitle1',item.name,''));
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
			if (selectedItem.openedSize && selectedItem.openedSize != estimate.closedSize){
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
				    if(currentOptionalFinish[i].ordinal == selectedItem.ordinal){
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
		}else{
			if (item.material){
				var materials = item.material.map(function(material) {
					return material.name + " " + material.gr + 'gr';
				}).join(' // ');
				texts.push(createText('text','Papel',materials));
			}
			if (item.ink){
					var inks = item.ink.map(function(ink) {
						return ink.inksDetails;
					}).join(' // ') + (showBleedPrint?' ' + (item.bleedPrint?'(Impresión al Vivo)':''):'');
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
			var materialChange = quantityOfPapersOnOriginalEstimate.filter(v => v).length >0;

			//Hay variación en los tamaños?
			var quantityOfSizesOnOriginalEstimate = estimate.work.items.map(currentItem =>  typeof currentItem.openedSize =='object' && new Set(currentItem.openedSize).size>1);
			var sizeChange = quantityOfSizesOnOriginalEstimate.filter(v => v).length >0;

			//Hay variación en tintas?
			var quantityOfInksOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.ink).size>1);
			var inksChange = quantityOfInksOnOriginalEstimate.filter(v => v).length >0;

			//Hay variación en fases
			var quantityOfFacesOnOriginalEstimate = estimate.work.items.map(currentItem =>  typeof currentItem.faces =='object' && new Set(currentItem.faces).size>1);
			var facesChange = quantityOfFacesOnOriginalEstimate.filter(v => v).length >0;

			//Hay variación en páginas
			var quantityOfPagesOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.quantityOfPages).size>1);
			var pagesChange = quantityOfPagesOnOriginalEstimate.filter(v => v).length >0;

			//Hay variación en vías
			var quantityOfViasOnOriginalEstimate = estimate.work.items.map(currentItem => new Set(currentItem.quantityOfVias).size>1);
			var viasChange = quantityOfViasOnOriginalEstimate.filter(v => v).length >0;

		//	quantityOfOpenedSizesPerItemOnOriginalEstimate.push(quantityOfClosedSizesOnOriginalEstimate);
			var lastPaperText = '';
			var lastsizeText = '';
			var lastInkText = '';
			var lasPagesText = '';
			var lastItemsFinishesText = '';
			var changeMade = false;
			for (var i = 0; i < estimate.prices.length;i++){
				var quantityOfTitles = 2;
					var price = estimate.prices[i];
					var generalFinishesText = "";
					if(estimate.work.mandatoryFinishes){
						if (estimate.work.mandatoryFinishes.length>1){
							for (var j = 0; j < estimate.work.mandatoryFinishes.length;j++){
								var mandatoryFinish = price.mandatoryFinishes.filter(currentMandatoryFinish => currentMandatoryFinish.name = estimate.work.mandatoryFinishes[j].name)[0];
								generalFinishesText += (generalFinishesText.length >0?" ":"") + mandatoryFinish.name;
							}
						}
					}
					if (generalFinishesText && generalFinishesText.length>0){
						quantityOfTitles++;
						if(generalFinishesText != lastGeneralFinishesText){
							textToAdd.push(createText('subtitle' + quantityOfTitles + "price",generalFinishesText, ''));  
							changeMade = true;
						}
						lastGeneralFinishesText = generalFinishesText;
					}

					var priceText = '';

					if(materialChange){
						quantityOfTitles++;
						var putItemName = quantityOfPapersOnOriginalEstimate.filter(v => v).length>1;
						var paperText = 'Papel' + price.items.map(currentItem => quantityOfPapersOnOriginalEstimate[currentItem.ordinal]?
														(putItemName?' de '+currentItem.name:'') + ' ' + currentItem.material.name + ' '  + 
														currentItem.material.gr + 'gr':'').filter(Boolean).join(", ");
						if(paperText && paperText != lastPaperText){
							textToAdd.push(createText('subtitle' + quantityOfTitles + "price",paperText, ''));  
							changeMade = true;
						}
						lastPaperText = paperText;
					}

					if(sizeChange){
						quantityOfTitles++;
						var putItemName = quantityOfSizesOnOriginalEstimate.filter(v => v).length>1;
						var sizeText = price.items.map(function(currentItem){
							if(quantityOfSizesOnOriginalEstimate[currentItem.ordinal]){
								var quantityOfClosedSizesOnOriginalEstimate = (new Set(estimate.work.closedSize)).size;
								var quantityOfOpenedSizesPerItemOnOriginalEstimate = estimate.work.items.map(currentItem1 => new Set(currentItem1.openedSize).size);
								quantityOfOpenedSizesPerItemOnOriginalEstimate.push(quantityOfClosedSizesOnOriginalEstimate);
	
								//Si hay la misma cantidad de diferentes tamaños cerrados que abiertos, pongo el cerrado, sino el abierto
									return (quantityOfOpenedSizesPerItemOnOriginalEstimate.every(val => val == quantityOfOpenedSizesPerItemOnOriginalEstimate[0])?	
										'Tamaño' + (putItemName?' de '+currentItem.name:'') + ' ' + price.closedSizes:							
										'Tamaño abierto' + (putItemName?' de '+currentItem.name:'') + ' ' + item.openedSize);
							}
						}).join(", ");
						if(sizeText && sizeText != lastsizeText){
							textToAdd.push(createText('subtitle' + quantityOfTitles + "price",sizeText, ''));  
							changeMade = true;
						}
						lastsizeText = sizeText;
					}
					if(inksChange || facesChange){
						quantityOfTitles++;
						var putItemName = quantityOfInksOnOriginalEstimate.filter(v => v).length>1 || quantityOfFacesOnOriginalEstimate.filter(v => v).length>1;
						var inkText = price.items.map(currentItem => ((quantityOfInksOnOriginalEstimate[currentItem.ordinal] || quantityOfFacesOnOriginalEstimate[currentItem.ordinal])?
													(putItemName?currentItem.name:'') +
													 (inksChange?' ' + currentItem.ink.inksDetails:'') + (facesChange?' ' + (currentItem.faces=='DOBLE_FAZ'?'Doble faz':'Simple faz'):''):'')).filter(Boolean).join(" // ")
						if(inkText && inkText != lastInkText){
							textToAdd.push(createText('subtitle' + quantityOfTitles + "price",inkText, ''));  
						}
						lastInkText = inkText;
					}
					if(viasChange || pagesChange){
						quantityOfTitles++;
						var putItemName =  quantityOfPagesOnOriginalEstimate.filter(v => v).length>1 || quantityOfViasOnOriginalEstimate.filter(v => v).length>1;
						var pagesText = 
														price.items.map(currentItem => 
															((quantityOfPagesOnOriginalEstimate[currentItem.ordinal] || quantityOfViasOnOriginalEstimate[currentItem.ordinal])?
															(putItemName?currentItem.name + ' de ':'') + 
															(quantityOfPagesOnOriginalEstimate[currentItem.ordinal]?((pagesChange && currentItem.quantityOfPages>1)?item.quantityOfPages + ' páginas ':''):'') + 
															(quantityOfViasOnOriginalEstimate[currentItem.ordinal]?((viasChange && currentItem.quantityOfVias>1)?item.quantityOfVias + ' vías':''):''):'')
															
															
														).join(", ");
						if(pagesText && pagesText != lasPagesText){
							textToAdd.push(createText('subtitle' + quantityOfTitles + "price",pagesText, ''));  
							changeMade = true;
						}
						lasPagesText = pagesText;
					}

					//mandatoryFinishGroups inside item
					itemsFinishesText = price.items.map(currentItem => currentItem.mandatoryFinishes?currentItem.mandatoryFinishes.map(
						currentMandatoryFinish => currentItem.name + " " + currentMandatoryFinish.name).filter(Boolean).join(" "):''
					).filter(Boolean).join(' ');
					if(itemsFinishesText && itemsFinishesText !=lastItemsFinishesText){
						quantityOfTitles++;
						textToAdd.push(createText('subtitle' + quantityOfTitles,itemsFinishesText, ''));  
						changeMade = true;
						lastItemsFinishesText = itemsFinishesText;
					}
					
					//Si hay más de una cantidad
					if(estimate.work.quantity.length>1){
							//Si estoy agregando una variante nueva (que no solo cambia en la cantidad)
							if(changeMade){
								textToAdd.push(createText('list', 'Sub-Total (' + price.quantity + ' unidades)', '$ ' + price.totalPrice.toLocaleString() + ' + IVA'));  
							}else{
								textToAdd[textToAdd.length-1].value.push(['Sub-Total (' + price.quantity + ' unidades)','$ ' + price.totalPrice.toLocaleString() + ' + IVA']);  
							}
					}else{
						textToAdd.push(createText('text', 'Sub-Total (' + price.quantity + ' unidades)', '$ ' + price.totalPrice.toLocaleString() + ' + IVA'));  
					}
			}
	}
	return textToAdd;
}

var createPriceText = function(estimate,extraPrice){
	var texts = [];
	if (estimate.SelectedOption){
		texts.push(createText('subtitle1','Precio: $' + (estimate.prices[estimate.SelectedOption].totalPrice + extraPrice) + ' + IVA' ,''));
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



