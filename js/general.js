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


var updateCard = function(estimate) {
	startLoader();
	var checkLists = createCheckListsForCard(estimate);
	var trelloCheckList = [];
	var trelloCheckListItems = [];
	var estimateToSave = translateEstimate(JSON.parse(JSON.stringify(estimate)));
	var estimateToSave = LZString.compress(JSON.stringify(estimate));
	t.card('all')
	.then(function(card) {
	  t.set('card', 'shared', cardInfoKey, estimateToSave)
		.then(function(){
			updateTrelloCard(t, {id: card.id, desc: createTextForCard(estimate), name: createTrelloCardName(estimate)})
			.then(function(){
				//var checkListToCard = [];
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
		var estimateToSave = JSON.parse(JSON.stringify(translateEstimate(estimate)));
		var estimateToSave = LZString.compress(JSON.stringify(estimate));
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
	var generalCheckList = {
		name:"Terminaciones Generales",
		checkItems:[]
	};
	if (estimate.mandatoryFinishGroups && estimate.mandatoryFinishGroups.length >0){
		var currentMandatoryFinishGroups = estimate.mandatoryFinishGroups;
		if(estimate.SelectedOption!=null){
			currentMandatoryFinishGroups = estimate.prices[estimate.SelectedOption].mandatoryFinishGroups;
			for (var i = 0; i < currentMandatoryFinishGroups.length;i++){
				var item = currentMandatoryFinishGroups[i].groupName + " - " + currentMandatoryFinishGroups[i].finishes.finish + 
				(currentMandatoryFinishGroups[i].finishes.finishComment!=""?' - ' +currentMandatoryFinishGroups[i].finishes.finishComment:'');
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
				if (optionalFinishesPrices[i].optionalFinishes){
					for (var j = 0; j < optionalFinishesPrices[i].optionalFinishes.length;j++){
						var item = optionalFinishesPrices[i].optionalFinishes[j].finish + 
						(optionalFinishesPrices[i].optionalFinishes[j].finishComment!=""?' - ' +optionalFinishesPrices[i].optionalFinishes[j].finishComment:'');
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
	}
	if(generalCheckList.checkItems.length>0){
		checkLists.push(generalCheckList);
	}
	for (var i = 0; i< estimate.items.length;i++){
		var currentCheckList = {
			name:"Terminaciones de " + estimate.items[i].name,
			checkItems:[]
		};
		if (estimate.items[i].mandatoryFinishGroups && estimate.items[i].mandatoryFinishGroups.length >0){
			var currentItemMandatoryFinishGroups = estimate.items[i].mandatoryFinishGroups;
			if(estimate.SelectedOption!=null){
				currentItemMandatoryFinishGroups = estimate.prices[estimate.SelectedOption].items[i].mandatoryFinishGroups;
				for (var k = 0; k < currentItemMandatoryFinishGroups.length;k++){
					var item = currentItemMandatoryFinishGroups[k].groupName + ' - ' + currentItemMandatoryFinishGroups[k].finishes.finish + 
					(currentItemMandatoryFinishGroups[k].finishes.finishComment?' - ' +currentItemMandatoryFinishGroups[k].finishes.finishComment:'');
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
		if (estimate.items[i].optionalFinishes && estimate.items[i].optionalFinishes.length >0){
			if(estimate.SelectedOption!=null){
				var optionalFinishesPrices = estimate.selectedExtraPrices;
				for (var j = 0; j < optionalFinishesPrices.length; j++){
					if(optionalFinishesPrices[j].items && optionalFinishesPrices[j].items[i] && optionalFinishesPrices[j].items[i].optionalFinishes){
						for (var k = 0; k < optionalFinishesPrices[j].items[i].optionalFinishes.length;k++){
							var item = optionalFinishesPrices[j].items[i].optionalFinishes[k].finish +  
							(optionalFinishesPrices[j].items[i].optionalFinishes[k].finishComment!=""?' - ' + optionalFinishesPrices[j].items[i].optionalFinishes[k].finishComment:'');
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
		}
		if(currentCheckList.checkItems.length>0){
			checkLists.push(currentCheckList);
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
	for (var i = 0; i < estimate.items.length;i++){
		texts = texts.concat(createItemText(estimate,estimate.items[i],true,true,true));
	}
	texts = texts.concat(createCommentsText(estimate,true,false)); 

	var extraPrice = 0;
	if(estimate.selectedExtraPrices && estimate.selectedExtraPrices.length > 0){
		extraPrice += estimate.selectedExtraPrices.map(optionalFinishes => optionalFinishes.optionalFinishes?optionalFinishes.optionalFinishes.map(optionalFinish => optionalFinish.price).reduce(add):0).reduce(add);
		extraPrice += estimate.selectedExtraPrices.map(optionalFinishes => optionalFinishes.items?optionalFinishes.items.filter(Boolean).map(item => item.optionalFinishes?item.optionalFinishes.filter(Boolean).map(optionalFinish => optionalFinish.price).reduce(add):0).reduce(add):0).reduce(add);
	}
	texts = texts.concat(createPriceText(estimate,extraPrice)); 

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
		value: value?value+'':value
	};
}

var createGeneralText = function(estimate,includeOptionalFinishes){  
	var text = [];
	text.push(createText('title',estimate.name,''));
	text.push(createText('text','Cantidad',(estimate.SelectedOption?estimate.prices[estimate.SelectedOption].quantity:estimate.quantity.join(' // '))));
	text.push(createText('text','Tamaño cerrado',estimate.clossedSize));
	if (estimate.mandatoryFinishGroups && estimate.mandatoryFinishGroups.length >0){	
		//text.push(createText('subtitle2','Terminaciones Generales',''));
		var currentMandatoryFinishGroups = estimate.mandatoryFinishGroups;
		if(estimate.SelectedOption!=null){
			currentMandatoryFinishGroups = estimate.prices[estimate.SelectedOption].mandatoryFinishGroups;
			for (var i = 0; i < currentMandatoryFinishGroups.length;i++){
				text.push(createText('text',currentMandatoryFinishGroups[i].groupName,currentMandatoryFinishGroups[i].finishes.finish + (currentMandatoryFinishGroups[i].finishes.finishComment!=""?currentMandatoryFinishGroups[i].finishes.finishComment:'')));
			}
		}else{
			for (var i = 0; i < currentMandatoryFinishGroups.length;i++){
				text.push(createText('text',currentMandatoryFinishGroups[i].groupName,currentMandatoryFinishGroups[i].finishes.map(finishes => finishes.finish + finishes.finishComment).join(" // ")));
			}
		}
	}
	if (includeOptionalFinishes){
		if (estimate.optionalFinishes && estimate.optionalFinishes.length >0){
			text.push(createText('subtitle2','Terminaciones',''));
			if(estimate.SelectedOption==null){
				var currentOptionalFinish = estimate.optionalFinishes;
				for(var i = 0; i < currentOptionalFinish.length;i++){
					text.push(createText('list',currentOptionalFinish[i].finish + (currentOptionalFinish[i].finishComment!=""?currentOptionalFinish[i].finishComment:''),''));
				}
			}else{
				var optionalFinishesPrices = estimate.selectedExtraPrices;
				for (var i = 0; i < optionalFinishesPrices.length; i++){
					if (optionalFinishesPrices[i].optionalFinishes){
						for (var j = 0; j < optionalFinishesPrices[i].optionalFinishes.length;j++){
							text.push(createText('list',optionalFinishesPrices[i].optionalFinishes[j].finish + (optionalFinishesPrices[i].optionalFinishes[j].finishComment!=""?optionalFinishesPrices[i].optionalFinishes[j].finishComment:'')));
						}
					}
				}
			}
		}
	}
	return text;
}
var createItemText = function(estimate, item, showBBleedPrint, showAllDifferent, showOptionalFinishes){
	var texts = [];
	var selectedItem;
	if(item){
		if (estimate.SelectedOption){
			selectedItem = estimate.prices[estimate.SelectedOption].items[item.id];
		}
		texts.push(createText('subtitle1',item.name,''));
		if (selectedItem){
			var inks = selectedItem.inks.inksQuantity + ' ' + selectedItem.inks.inksDetails + (showBBleedPrint?(selectedItem.bleedPrint?'(Impresión al Vivo)':''):'');
			inks += ' ' + selectedItem.faces;
			texts.push(createText('text','Tintas',inks));
			if (selectedItem.openedSize != item.clossedSize){
				texts.push(createText('text','Tamaño Abierto',selectedItem.openedSize));
			}
			if (selectedItem.quantityOfPages !=1){
				var quantityOfPages = selectedItem.quantityOfPages + (selectedItem.allTheSame?' (Todas iguales)':(showAllDifferent?' (Todas diferentes)':''));
				texts.push(createText('text','Cantidad de páginas',quantityOfPages));
			}
			texts.push(createText('text','Materiales', selectedItem.materials.paper + ' ' + selectedItem.materials.gr + 'gr'));
			if (selectedItem.mandatoryFinishGroups && selectedItem.mandatoryFinishGroups.length >0){
				currentItemMandatoryFinishGroups = selectedItem.mandatoryFinishGroups;
				for (var k = 0; k < currentItemMandatoryFinishGroups.length;k++){
					texts.push(createText('text',currentItemMandatoryFinishGroups[k].groupName,currentItemMandatoryFinishGroups[k].finishes.finish +currentItemMandatoryFinishGroups[k].finishes.finishComment));
				}
			}
			var notTitlePlaced = true;
			if(showOptionalFinishes){
				var optionalFinishesPrices = estimate.selectedExtraPrices;
				if (optionalFinishesPrices){
					for (var j = 0; j < optionalFinishesPrices.length; j++){
						if(optionalFinishesPrices[j].items && optionalFinishesPrices[j].items[selectedItem.id] && optionalFinishesPrices[j].items[selectedItem.id].optionalFinishes){
							for (var k = 0; k < optionalFinishesPrices[j].items[selectedItem.id].optionalFinishes.length;k++){
								if (notTitlePlaced){
									texts.push(createText('subtitle2','Terminaciones',''));
									notTitlePlaced = false;
								}
								texts.push(createText('list',optionalFinishesPrices[j].items[selectedItem.id].optionalFinishes[k].finish + (optionalFinishesPrices[j].items[selectedItem.id].optionalFinishes[k].finishComment!=""?optionalFinishesPrices[j].items[i].optionalFinishes[k].finishComment:'')));
							}
						}
					}
				}
			}



		}else{
			if (item.inks){
					var inks = item.inks.map(function(ink) {
						return ink.inksQuantity + " " + ink.inksDetails;
					}).join(' // ') + (showBBleedPrint?' ' + (item.bleedPrint?'(Impresión al Vivo)':''):'');
					inks += (item.faces?' ' + item.faces.join(' // '):'');
					texts.push(createText('text','Tintas',inks));
			}
			if (item.openedSize && item.openedSize !== estimate.clossedSize){
				texts.push(createText('text','Tamaño Abierto',item.openedSize.join(' // ')));
			}
			if (item.quantityOfPages.length>1 || (item.quantityOfPages.length==1 && item.quantityOfPages!=1)){
				var quantityOfPages = item.quantityOfPages.join(' // ') + (item.allTheSame?' (Todas iguales)':(showAllDifferent?' (Todas diferentes)':''))
				texts.push(createText('text','Cantidad de páginas',quantityOfPages));
			}
			if (item.materials){
				var materials = item.materials.map(function(material) {
					return material.paper + " " + material.gr + 'gr';
				}).join(' // ');
				texts.push(createText('text','Materiales',materials));
			}
			if (item.mandatoryFinishGroups && item.mandatoryFinishGroups.length >0){
				var currentItemMandatoryFinishGroups = item.mandatoryFinishGroups;
				for (var k = 0; k < currentItemMandatoryFinishGroups.length;k++){
					texts.push(createText('text',currentItemMandatoryFinishGroups[k].groupName,currentItemMandatoryFinishGroups[k].finishes.map(finishes => finishes.finish + finishes.finishComment).join(" // ")));
				}
			}
			var notTitlePlaced = true;
			if(showOptionalFinishes){
				if (item.optionalFinishes && item. optionalFinishes.length >0){
					var currentItemOptionalFinish = item.optionalFinishes;
					for(var k = 0; k < currentItemOptionalFinish.length;k++){
						if (notTitlePlaced){
							texts.push(createText('subtitle2','Terminaciones',''));
							notTitlePlaced = false;
						}
						texts.push(createText('list',currentItemOptionalFinish[k].finish + (currentItemOptionalFinish[k].finishComment!=""?currentItemOptionalFinish[k].finishComment:''),''));
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

var createPriceText = function(estimate,extraPrice){
	var texts = [];
	if (estimate.SelectedOption){
		texts.push(createText('subtitle1','Precio: ' + (estimate.prices[estimate.SelectedOption].price + extraPrice) + ' + IVA' ,''));
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
	var quantity = estimate.quantity.join(' // ');
	if (estimate.SelectedOption){
		quantity = estimate.prices[estimate.SelectedOption].quantity;
	}
	return quantity + " " + estimate.name + " - " + contactAndBusinessInfo.filter(Boolean).join(' - ');
}


function compareValues(key, order='asc') {
    return function(a, b) {
				let comparison = 0;
				if(a.mandatoryFinishGroups && b.mandatoryFinishGroups){
					if (a.mandatoryFinishGroups.length == b.mandatoryFinishGroups.length){
						for (var j = 0; j < a.mandatoryFinishGroups.length;j++){
							const varA = (typeof a.mandatoryFinishGroups[j].finishes.finish === 'string') ?a.mandatoryFinishGroups[j].finishes.finish.toUpperCase() : a.mandatoryFinishGroups[j].finishes.finish;
							const varB = (typeof b.mandatoryFinishGroups[j].finishes.finish === 'string') ?b.mandatoryFinishGroups[j].finishes.finish.toUpperCase() : b.mandatoryFinishGroups[j].finishes.finish;
							if (a.mandatoryFinishGroups[j].finishes.finish != b.mandatoryFinishGroups[j].finishes.finish){
								if (varA > varB) {
									return ((order == 'desc') ? -1:1);
								} else if (varA < varB) {
										return ((order == 'desc') ? 1:-1);
										
								}
							}
						}
					}
				}
        key = ['openedSize','quantityOfPages','quantityOfVias','faces','materials','inks'];
        if(a.items.length==b.items.length){
            for (var j = 0; j < a.items.length;j++){
                var item1 = a.items[j];
                var item2 = b.items[j];
                for (var i = 0; i < key.length;i++){
                    var currentKey = key;
                    const varA = (typeof item1[currentKey] === 'string') ?item1[currentKey].toUpperCase() : item1[currentKey];
                    const varB = (typeof item2[currentKey] === 'string') ?item2[currentKey].toUpperCase() : item2[currentKey];
                    if(typeof varA !='object'){
                        if (varA > varB) {
                            return ((order == 'desc') ? -1:1);
                        } else if (varA < varB) {
                            return ((order == 'desc') ? 1:-1);
                            
                        }
                    }else{
                        for (var key in varA) {
                            var varAA = (typeof varA[key] === 'string') ? varA[key].toUpperCase() :  varA[key];
                            var varBA = (typeof varB[key] === 'string') ? varB[key].toUpperCase() :  varB[key];
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
