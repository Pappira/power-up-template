var quantity = document.getElementById('quantity');
var itemsDiv = document.getElementById('itemsDiv');	
var generalDiv = document.getElementById('generalDiv');	
var addItemButton = document.getElementById('addItemButton');
var materialSelect = document.getElementById('item1material');
var materialGr = document.getElementById('item1paperGr');
var quantityOfPagesDiv = document.getElementById('item1quantityOfPages');
var item1name = document.getElementById('item1name');

var quantityOfQuantities = 0;
var quantitiesOfMaterials = [0];
var quantitiesOfquantityOfPages = [0];
var quanatityOfItemFinishes = [0];
var quantityOfGeneralFinishes = 0;
var quantityOfItems = 0;

var finishes = ['Laminado Mate', 'Laminado Brillo', 'Puntas redondeadas','Encuadernado HotMelt','Encuadernado con Rulo','Encuadernado con 2 grapas al medio', 'Encuadernado con una grapa','Encolado','Tapa Dura','Tapa SemiDura','Barniz UV Brillo Pleno', 'Barniz UV Brillo Sectorizado','Barniz UV Mate Pleno','Barniz UV Mate Sectorizado','Barniz mate','Barniz Brillo','Intercalado','Marcado', 'Doblado','Troquelado','Pegado'];
var materials = ['Coteado Mate','Coteado Brillo','Obra Blanco','Obra Color','Opalina Lisa','Opalina Texturada']

//TODO al crear el objeto cuando recorro los chips, se puede haber borrado alguno, hay que recorrer hasta el maximo pero siempre preguntar si no es null

var focusOutOnQuantity = function(elementFocusedOut){
	if (elementFocusedOut.value.length > 0){
		var chip = createChip('quantityChip' + ++quantityOfQuantities,elementFocusedOut.value,['quantity'],[elementFocusedOut.value])
		var quantityChipsDiv = document.getElementById('quantityChipsDiv');	
		quantityChipsDiv.appendChild(chip);
		elementFocusedOut.value = '';
	}
};

var itemNameChanged = function(elementFocusedOut){
	var itemNumber = elementFocusedOut.getAttribute('id').substring(4,5);
	var title = document.getElementById('item' + itemNumber + 'title');
	if(elementFocusedOut){
		if (elementFocusedOut.value.length>0){
			title.innerText = elementFocusedOut.value;
		}else{
			title.innerText = "Item " + itemNumber;
		}
	}
};



var focusOutOnQuantityOfPages = function(elementFocusedOut){
	var itemNumber = elementFocusedOut.getAttribute('id').substring(4,5);
	var quantityOfPagesFocusedOut = document.getElementById('item' + itemNumber + 'quantityOfPages');
	if (quantityOfPagesFocusedOut && quantityOfPagesFocusedOut.value.length > 0){
		//Busco el DIV donde va el chip (depende del número de item)
		var quantityOfPagesChipsDiv = document.getElementById('item' + itemNumber + 'quantityOfPagesChips');
		//Busco cuantos chips ya hay, si no hay ninguno pongo 0
		var quantityOfPages = quantitiesOfquantityOfPages[itemNumber-1];
		if(!quantityOfPages){
			quantityOfPages=0;
		}
		quantitiesOfquantityOfPages[itemNumber-1] = ++quantityOfPages;
		//creo el chip
		var chip = createChip('item' + itemNumber + 'quantityOfPagesChip' + quantityOfPages,quantityOfPagesFocusedOut.value,['quantityOfPages'],[quantityOfPagesFocusedOut.value]);
		quantityOfPagesChipsDiv.appendChild(chip);
		//vuelvo a cero o a vacio los inputs que crean este chip, para que se pueda crear otro chip
		quantityOfPagesFocusedOut.value = '';
	}
};

var createChip = function(chipId,chipText,attirbuteName,attributeValue){
	var div = document.createElement("div");
	div.setAttribute('class','chip');
	div.setAttribute('id',chipId);
	if(attirbuteName && attributeValue){
		for(var i = 0; i <attirbuteName.length;i++){
			div.setAttribute(attirbuteName[i],attributeValue[i]);
		}
	}
	div.append(chipText);
	var i = document.createElement("i");
	i.setAttribute('class','material-icons');
	i.append('close');
	div.appendChild(i);
	return div;
}

var createItem = function(){
	quantityOfItems++;

	var divContainer = createElement('div','container','item' + quantityOfItems + 'container');
	var formItem = createElement('form','col s12','item' + quantityOfItems + 'form');

	var h1 = createElement('h1','titulo','item' + quantityOfItems + 'title','Item ' + quantityOfItems);
	var divRow = createElement('div','row','','');

	var divItemName = createTextInput('s6','item' + quantityOfItems + 'name','Nombre del item');
	divRow.appendChild(divItemName);
	
	var divItemInks = createTextInput('s4','item' + quantityOfItems + 'inks','Tintas F/D');
	divRow.appendChild(divItemInks);

	var switchAlVivo = createSwitch('s2','item' + quantityOfItems + 'bleedPrint','¿Impresión al vivo?');
	divRow.appendChild(switchAlVivo);

	var divInksDetails = createTextInput('s6','item' + quantityOfItems + 'inksDetails','Detalle de tintas');
	divRow.appendChild(divInksDetails);

	var divOpenedSize = createTextInput('s6','item' + quantityOfItems + 'openedSize','Tamaño Abierto');
	divRow.appendChild(divOpenedSize);

	var selectMaterial = createSelect('s4','item' + quantityOfItems + 'material',materials,'Material')
	divRow.appendChild(selectMaterial);

	var switchgr = createTextInput('s2','item' + quantityOfItems + 'paperGr','Gramaje','number');
	divRow.appendChild(switchgr);

	var divChips = createElement('div','input-field col s6','item' + quantityOfItems + 'paperChips');
	divRow.appendChild(divChips);

	var divQuantityOfPages = createTextInput('s6','item' + quantityOfItems + 'quantityOfPages','Cantidad de Páginas','number');
	divRow.appendChild(divQuantityOfPages);
	
	var divAllTheSame = createSwitch('s2','Item' + quantityOfItems + 'allTheSame','¿Todas Iguales?');
	divRow.appendChild(divAllTheSame);

	var divChipsQuantityOfPages = createElement('div','input-field col s4','item' + quantityOfItems + 'quantityOfPagesChips');
	divRow.appendChild(divChipsQuantityOfPages);

	formItem.appendChild(h1);
	formItem.appendChild(divRow);

	var subtitleFinishes = createElement('p','subtitulo','','Terminaciones');
	formItem.appendChild(subtitleFinishes);

 	var divRowFinishes = createElement('div','row','item' + quantityOfItems +'finishes','');

	formItem.appendChild(divRowFinishes);
	divContainer.appendChild(formItem);

	itemsDiv.appendChild(divContainer);

	var finish = addItemFinish(quantityOfItems);

	$('select#item' + quantityOfItems + 'material').material_select();
	$('select#item' + quantityOfItems + 'finish').material_select();


	$('#item' + quantityOfItems + 'material').on('change', function(e) {
    focusOutOnMaterial(e.target);
	});

	var materialSelect2 = document.getElementById('item' + quantityOfItems + 'material');
	var materialGr2 = document.getElementById('item' + quantityOfItems + 'paperGr');
	var quantityOfPagesDiv2 = document.getElementById('item' + quantityOfItems + 'quantityOfPages');
	var itemName2 = document.getElementById('item' + quantityOfItems + 'name');

	materialSelect2.addEventListener('keyup',function(e){
	    if(e.keyCode === 13 || e.keyCode === 32){
	        focusOutOnMaterial(e.srcElement);
	    }
	});

	materialGr2.addEventListener('focusout',function(e){
		focusOutOnMaterial(e.srcElement);
	});

	materialGr2.addEventListener('keyup',function(e){
	    if(e.keyCode === 13 || e.keyCode === 32){
	        focusOutOnMaterial(e.srcElement);
	    }
	});

	quantityOfPagesDiv2.addEventListener('focusout',function(e){
	        focusOutOnQuantityOfPages(e.srcElement);
	});

	quantityOfPagesDiv2.addEventListener('keyup',function(e){
	    if(e.keyCode === 13 || e.keyCode === 32){
	        focusOutOnQuantityOfPages(e.srcElement);
	    }
	});

	itemName2.addEventListener('keyup',function(e){
	    itemNameChanged(e.srcElement);
	});

}


var createGeneralInformation = function(){
	var divContainer = createElement('div','container','generalContainer');
	var formItem = createElement('form','col s12','generalForm');

	var h1 = createElement('h1','titulo','generalTitle','General');
	var divRow = createElement('div','row','','');

	var divQuantity = createTextInput('s6','quantity','Cantidad','number');
	divRow.appendChild(divQuantity);

	var divChips = createElement('div','input-field col s6','quantityChipsDiv');
	divRow.appendChild(divChips);
	
	var divClossedSize = createTextInput('s12','clossedSize','Tamaño cerrado (mm)');
	divRow.appendChild(divClossedSize);

	formItem.appendChild(h1);
	formItem.appendChild(divRow);

	quantityOfGeneralFinishes++;
	var subtitleFinishes = createElement('p','subtitulo','','Terminaciones');
	formItem.appendChild(subtitleFinishes);


	var divRowFinishes = createElement('div','row','generalFinishesRow','');
	
	formItem.appendChild(divRowFinishes);
	divContainer.appendChild(formItem);

	generalDiv.appendChild(divContainer);

 	var generalFinish = addGeneralFinish(quantityOfGeneralFinishes);


	var quantity = document.getElementById('quantity');

	quantity.addEventListener('focusout',function(e){
	        focusOutOnQuantity(e.srcElement);
	});

	quantity.addEventListener('keyup',function(e){
	    if(e.keyCode === 13 || e.keyCode === 32){
	        focusOutOnQuantity(e.srcElement);
	    }
	});
}

var createItemFinish = function(itemNumber,finishNumber){
	var divRowFinishes = document.getElementById('item' + itemNumber + 'finishes');
	var selectFinish = createSelect('s6','item' + itemNumber + 'finish' + finishNumber,finishes,'Tipo');
	divRowFinishes.appendChild(selectFinish);

	var divFinishComment = createTextInput('s4','item' + itemNumber + 'openedSize'+finishNumber,'Comentario');
	divRowFinishes.appendChild(divFinishComment);


	var switchShowToClient = createSwitch('s2','item' + itemNumber + 'showToClient'+finishNumber,'¿Mostrar al cliente?');
	divRowFinishes.appendChild(switchShowToClient);

	$('select#item' + itemNumber + 'finish' + finishNumber).material_select();

	$('select#item' + itemNumber + 'finish' + finishNumber).on('change', function(e) {
		var elementFocusedOut = e.target;
		var itemNumber = elementFocusedOut.getAttribute('id').substring(4,5);
		if(e.target.getAttribute('id') == ('item' + itemNumber + 'finish' + quanatityOfItemFinishes[itemNumber-1])){
    		addItemFinish(itemNumber);
    	}
	});
}

var createGeneralFinish = function(quantity){
	var divRowFinishes = document.getElementById('generalFinishesRow');
	var selectFinish = createSelect('s6','generalFinish' + quantity,finishes,'Tipo');
	divRowFinishes.appendChild(selectFinish);

	var divFinishComment = createTextInput('s4','generalFinishComment' + quantity,'Comentario');
	divRowFinishes.appendChild(divFinishComment);


	var switchShowToClient = createSwitch('s2','generalShowToClientFinish' + quantity,'¿Mostrar al cliente?');
	divRowFinishes.appendChild(switchShowToClient);

	$('select#generalFinish' + quantity).material_select();

	$('#generalFinish' + quantity).on('change', function(e) {
		if(e.target.getAttribute('id') == ('generalFinish' + quantityOfGeneralFinishes )){
    		addGeneralFinish();
    	}
	});
}

var addGeneralFinish = function (){
	quantityOfGeneralFinishes++;
	createGeneralFinish(quantityOfGeneralFinishes);
}

var addItemFinish = function (itemNumber){
	var quantityOfFinishes = quanatityOfItemFinishes[itemNumber-1];
	if(!quantityOfFinishes){
		quantityOfFinishes=0;
	}
	quanatityOfItemFinishes[itemNumber-1] = ++quantityOfFinishes;

	createItemFinish(itemNumber,quantityOfFinishes);
}

var focusOutOnMaterial = function(elementFocusedOut){
	var itemNumber = elementFocusedOut.getAttribute('id').substring(4,5);
	var materialSelectFocusedOut = document.getElementById('item' + itemNumber + 'material');
	var materialGrFocusedOut = document.getElementById('item' + itemNumber + 'paperGr');
	if (materialSelectFocusedOut.selectedIndex > 0 && materialGrFocusedOut.value.length > 0){
		//Busco el DIV donde va el chip (depende del número de item)
		var materialChipsDiv = document.getElementById('item' + itemNumber + 'paperChips');
		//Busco cuantos chips ya hay, si no hay ninguno pongo 0
		var quantityOfMaterials = quantitiesOfMaterials[itemNumber-1];
		if(!quantityOfMaterials){
			quantityOfMaterials = 0; 
		}
		quantitiesOfMaterials[itemNumber-1] = ++quantityOfMaterials;	
		//creo el chip
		var chip = createChip('item' + itemNumber + 'MaterialChip' + quantityOfMaterials, materialSelectFocusedOut.value.substring(0,3) + ' ' + materialGrFocusedOut.value,['paper','gr'],[materialSelectFocusedOut.value,materialGrFocusedOut.value])
		materialChipsDiv.appendChild(chip);
		//vuelvo a cero o a vacio los inputs que crean este chip, para que se pueda crear otro chip
		materialSelectFocusedOut.selectedIndex = 0;
		$('select#item' + itemNumber + 'material').material_select();
		materialGrFocusedOut.value = '';
	}
};

var createSelect = function(colType,selectId,values,labelName){
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
	var label = createElement('label','','',labelName,'',selectId);
	var divInput = createElement('div','input-wrapper');
	divInput.appendChild(select);
	divInput.appendChild(label);
	var divCol = createElement('div','input-field col ' + colType);
	divCol.appendChild(divInput);

	return divCol;
}

var createSwitch = function(colType,switchId,switchLabelValue){
	var divCol = createElement('div','col ' + colType +' switch-div switch');
	var p = createElement('p','switch','',switchLabelValue);
	var divSwitch = createElement('div','switch','','');
	var label = createElement('label','puntas');
	var input = createElement('input','',switchId,'','checkbox');
	var span = createElement('span','lever');
	label.appendChild(input);
	label.appendChild(span);
	divSwitch.appendChild(label);
	divCol.appendChild(p);
	divCol.appendChild(divSwitch);
	return divCol;
};

var createTextInput = function(colType,inputId,inputLabelValue,type){
	var divCol = createElement('div','input-field col ' + colType);
	var divInput = createElement('div','input-wrapper','','');
	var input = createElement('input','validate',inputId,'',type?type:'text');
	var label = createElement('label','','',inputLabelValue,'','itemName');
	divInput.appendChild(input);
	divInput.appendChild(label);
	divCol.appendChild(divInput);

	return divCol;
};

var createElement = function(typeValue,className,id,text,type,forValue,value){
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
	return createElement;
};

addItemButton.addEventListener('click',createItem);


$(window).on('load', function() {
	createGeneralInformation();
	createItem();
});