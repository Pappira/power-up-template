var quantity = document.getElementById('quantity');
var quantityChipsDiv = document.getElementById('quantityChipsDiv');	
var itemsDiv = document.getElementById('itemsDiv');	
var addItemButton = document.getElementById('addItemButton');	
var itemHTML = '<div class="container" id="item$container"><form class="col s12" id="item$form"><h1 class="titulo">Item +</h1><div class="row"><div class="input-field col s6"><div class="input-wrapper"><input id="item+Name" type="text" class="validate"><label for="item+Name">Nombre del item</label></div></div><div class="input-field col s4"><div class="input-wrapper"><input id="item+Inks" type="text" class="validate"><label for="item+Inks">Tintas F/D</label></div></div><div class="col s2 switch-div switch"><p class="switch">¿Impresión al vivo?</p><div class="switch"><label class="puntas"> <input type="checkbox" id="Item+bleedPrint"><span class="lever"></span></label></div></div><div class="input-field col s6"><div class="input-wrapper"><input id="item+inksDetails" type="text" class="validate"><label for="item+inksDetails">Detalle de tintas</label></div></div><div class="input-field col s6"><div class="input-wrapper"><input id="item+openedSize" type="text" class="validate"><label for="item+openedSize">Tamaño Abierto</label></div></div><div class="input-field col s4"><div class="input-wrapper"><select id="item+material"><option value="" disabled selected>Selecciona</option><option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option></select><label for="item+material">Materiales</label></div></div><div class="input-field col s2"><div class="input-wrapper"><input id="item+paperGr" type="text" class="validate"><label for="item+paperGr">Gramaje</label></div></div><div id="item+paperChips" class="input-field col s6"><div class = "chip"> Coteado 130<i class = "material-icons">close</i></div> <div class = "chip"> Coteado 170<i class = "material-icons">close</i></div><div class = "chip"> Coteado 170<i class = "material-icons">close</i></div><div class = "chip"> Coteado 170<i class = "material-icons">close</i></div><div class = "chip"> Coteado 170<i class = "material-icons">close</i></div></div><div class="input-field col s6"><div class="input-wrapper"><input id="item+quantityOfPages" type="text" class="validate"><label for="item+quantityOfPages">Cantidad de Páginas</label></div></div><div class="col s2 switch-div switch"><p class="switch">¿Todas Iguales?</p><div class="switch"><label class="puntas"> <input type="checkbox" id="itemAllTheSame"><span class="lever"></span></label></div></div><div id="item+quantityOfPagesChips" class="input-field col s4"><div class = "chip"> 100<i class = "material-icons">close</i></div> <div class = "chip"> 150<i class = "material-icons">close</i></div></div></div><p class="subtitulo">Terminaciones</p><div class="row"><div class="input-field col s6"><div class="input-wrapper"><select id = "item+finish"><option value="" disabled selected>Selecciona</option><option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option></select><label for="item+finish">Tipo</label></div></div><div class="input-field col s4"><div class="input-wrapper"><input id="item+finishComment" type="text" class="validate"><label for="item+finishComment">Comentario</label></div></div><div class="col s2 switch-div switch"><p class="switch">¿Mostrar al cliente?</p><div class="switch"><label class="puntas"> <input type="checkbox" id="item+showToClient"><span class="lever"></span></label></div></div></div></form></div>'

var quantityOfQuantities = 0;
var quantityOfItems = 1;

var focusOutOnQuantity = function(){
	if (quantity.value.length > 0){
		var div = document.createElement("div");
		div.setAttribute('class','chip');
		div.setAttribute('id','quantityChip' + ++quantityOfQuantities);
		div.append(quantity.value);
		var i = document.createElement("i");
		i.setAttribute('class','material-icons');
		i.append('close');
		div.appendChild(i);
		quantityChipsDiv.appendChild(div);
		quantity.value = '';
	}
};

/*var createItem = function(){
	quantityOfItems++;
	var h1 = createElement('h1','titulo','','Item' + quantityOfItems);
	var divRow = createElement('div','row','','');

	var divItemName = createTextInput('s6','item' + quantityOfItems + 'name','Nombre del item');
	divRow.appendChild(divItemName);
	
	var divItemInks = createTextInput('s4','item' + quantityOfItems + 'Inks','Tintas F/D');
	divRow.appendChild(divItemInks);

	var switchAlVivo = createSwitch('s2','Item' + quantityOfItems + 'bleedPrint','¿Impresión al vivo?');
	divRow.appendChild(switchAlVivo);

	var divInksDetails = createTextInput('s6','Item' + quantityOfItems + 'inksDetails','Detalle de tintas');
	divRow.appendChild(divInksDetails);

	var divOpenedSize = createTextInput('s6','Item' + quantityOfItems + 'openedSize','Tamaño Abierto');
	divRow.appendChild(divOpenedSize);

	var option1 = createElement('optoin','','','option1');
	var option2 = createElement('optoin','','','option2');
	var option3 = createElement('optoin','','','option3');
	var select = createElement('select');
	select.appendChild(option1);
	select.appendChild(option2);
	select.appendChild(option3);
	var divInput = createElement('div','input-wrapper');
	divInput.appendChild(select);
	var divCol = createElement('div','input-field col s4');
	divCol.appendChild(divInput);
	divRow.appendChild(divCol);

	var selectMaterial = document.getElementById('item1material').cloneNode(true);
	selectMaterial.removeAttribute('id');
	selectMaterial.setAttribute('id','item' + quantityOfItems + 'material');
	var divInput = createElement('div','input-wrapper');
	divInput.appendChild(selectMaterial);
	var divCol = createElement('div','input-field col s4');
	divCol.appendChild(divInput);
	divRow.appendChild(divCol);

	var selectMaterialDiv = document.getElementById('item1materialDiv').cloneNode(true);
	divRow.appendChild(selectMaterialDiv);

	var switchgr = createTextInput('s2','Item' + quantityOfItems + 'paperGr','Gramaje');
	divRow.appendChild(switchgr);

	var divChips = createElement('div','input-field col s6','item' + quantityOfItems + 'paperChips');
	divRow.appendChild(divChips);

	var divQuantityOfPages = createTextInput('s6','item' + quantityOfItems + 'quantityOfPages','Cantidad de Páginas');
	divRow.appendChild(divQuantityOfPages);
	
	var divAllTheSame = createSwitch('s2','Item' + quantityOfItems + 'allTheSame','¿Todas Iguales?');
	divRow.appendChild(divAllTheSame);

	var divChipsQuantityOfPages = createElement('div','input-field col s4','item' + quantityOfItems + 'quantityOfPagesChips');
	divRow.appendChild(divChipsQuantityOfPages);




	itemsDiv.appendChild(divRow);
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

var createTextInput = function(colType,inputId,inputLabelValue){
	var divCol = createElement('div','input-field col ' + colType);
	var divInput = createElement('div','input-wrapper','','');
	var input = createElement('input','validate',inputId + quantityOfItems,'','text');
	var label = createElement('label','','',inputLabelValue,'','itemName');
	divInput.appendChild(input);
	divInput.appendChild(label);
	divCol.appendChild(divInput);

	return divCol;
};

var createElement = function(typeValue,className,id,value,type,forValue){
	var createElement=document.createElement(typeValue);
	if(className && className.length>0){
		createElement.setAttribute('class',className);
	}
	if(id && id.length>0){	
		createElement.setAttribute('id',id);
	}
	if(value  && value.length>0){
		createElement.append(value);
	}
	if(type  && type.length>0){
		createElement.setAttribute('type',type);
	}	
	if(forValue  && forValue.length>0){
		createElement.setAttribute('for',forValue);
	}
	return createElement;
};*/



quantity.addEventListener('focusout',focusOutOnQuantity);


var addItem = function(){
	itemsDiv.innerHTML = itemsDiv.innerHTML +  itemHTML.replace(/\+/g ,++quantityOfItems);
	$('select#item' + quantityOfItems + 'material').material_select();
	$('select#item' + quantityOfItems + 'finish').material_select();
}

addItemButton.addEventListener('click',addItem);

quantity.addEventListener('keyup',function(e){
    if(e.keyCode === 13 || e.keyCode === 32){
        focusOutOnQuantity();
    }
});
