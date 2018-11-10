var t = TrelloPowerUp.iframe();

var itemsDiv = document.getElementById('itemsDiv');	
var generalDiv = document.getElementById('generalDiv');	
var commentsDiv = document.getElementById('commentsDiv');
var customerDiv = document.getElementById('customerDiv');
var addItemButton = document.getElementById('addItemButton');
var addCardButton = document.getElementById('addCardButton');

var quantityOfQuantities = 0;
var quantitiesOfMaterials = [0];
var quantitiesOfquantityOfPages = [0];
var quanatityOfItemFinishes = [0];
var quantityOfGeneralFinishes = 0;
var quantityOfItems = 0;

var finishes = ['Laminado Mate', 'Laminado Brillo', 'Puntas redondeadas','Encuadernado HotMelt','Encuadernado con Rulo','Encuadernado con 2 grapas al medio', 'Encuadernado con una grapa','Encolado','Tapa Dura','Tapa SemiDura','Barniz UV Brillo Pleno', 'Barniz UV Brillo Sectorizado','Barniz UV Mate Pleno','Barniz UV Mate Sectorizado','Barniz mate','Barniz Brillo','Intercalado','Marcado', 'Doblado','Troquelado','Pegado'];
var materials = ['Coteado Mate','Coteado Brillo','Obra Blanco','Obra Color','Opalina Lisa','Opalina Texturada']
var workTypes = ['Revista','Libro','Recetario','Folleto','Volante'];
var paymentWays = ['Contado','Seña del 50% y saldo contra-entrega','Seña del 40% y saldo contra-entrega','SIIF 30 días','SIIF 60 días'];


var quantityChip = [];
var generalFinishes = [];
var generalIds =['workType','clossedSize'];
var comments = ['internalComments','clientComments'];
var customer = ['comenrcialName','businessName','rut','address','contactName','contactEmail','contactPhone','paymentWay'];
var estimate = {};
var item = [];
var itemFinishes = [];
var quantityOfPagesOfItems = [];
var materialsOfItems = [];
var items = [];

var cardInfoKey = 'pappira.cardInfo';
var listId = '5a9ef0ce024c776a21220836';

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
	  if(t.arg('update')){
		saveFunction = updateCard;
		addCardButton.firstChild.data = "Modificar";
	  } else {
		saveFunction = createCard;
	  }
  
	  addCardButton.addEventListener('click', saveFunction);
  
	  if(cardInfo){
		createGeneralInformation(cardInfo);
		createItem(cardInfo);
		createComments(cardInfo);
		createCustomer(cardInfo);
	  }
	});
  });

var createTextForCard = function(){
	var text = '';
	text += '#' + estimate['workType'] + '\n';
	text += '**Cantidad: **' + estimate['quantity'].join(' / ') + '\n';
	text += '**Tamaño cerrado: **' + estimate['clossedSize'] + '\n';
	if (estimate['finishes'].length >0){
		text += '###Terminaciones Generales' + '\n\n';
		for (var i = 0; i < estimate['finishes'].length;i++){
			text += i + '. ' + estimate['finishes'][i]['finish'] + '\n';
			if (estimate['finishes'][i]['finishComment']){
				text += '- ' + estimate['finishes'][i]['finishComment'] + '\n';
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
					if (estimate['items'][i]['finishes'][j]['finishComment']){
						text += '- ' + estimate['items'][i]['finishes'][j]['finishComment'] + '\n';
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

var createObject = function(){
	for (var i = 0; i < generalIds.length;i++){
		var input = document.getElementById(generalIds[i]);
		if (input.value.length>0 && input.value !== 'Selecciona'){
			estimate[generalIds[i]] = input.value;
		}else{
			estimate[generalIds[i]] = '';
		}
	}
	var quantity = [];
	for (var i = 0; i < quantityChip.length;i++){
		var input = document.getElementById(quantityChip[i]);
		if (input){
			quantity.push(input.getAttribute('quantity'));
		}
	}
	estimate['quantity'] = quantity;
	var finishes = [];
	for(var i =0; i < generalFinishes.length;i++){
		var finish = {};
		for(var j = 0; j < generalFinishes[i].length;j++){
			var input = document.getElementById(generalFinishes[i][j]);
			if (input && input.value.length>0 && input.value !== 'Selecciona'){
				if (input.type != "checkbox"){
					finish[generalFinishes[i][j].slice(7,-1)] = input.value;
				}else{
					finish[generalFinishes[i][j].slice(7,-1)] = input.checked;
				}
			}else{
				if (input && input.type == 'select-one'){
					break;
				}
			}
		}
		if (Object.keys(finish).length>0){
			finishes.push(finish);
		}
	}
	estimate['finishes'] = finishes;

	var itemsObject = [];
	for (var i = 0; i < items.length;i++){
		var item = {};
		for (var j = 0; j < items[i].length;j++){
			var input = document.getElementById(items[i][j]);
			if (input.value.length>0 && input.value !== 'Selecciona'){
				if (input.type != "checkbox"){
					item[items[i][j].slice(5)] = input.value;
				}else{
					item[items[i][j].slice(5)] = input.checked;
				}
			}else{
				item[items[i][j].slice(5)] = '';
			}
		}
		var quantityOfPages = [];
		if (quantityOfPagesOfItems[i]){
			for (var j = 0; j < quantityOfPagesOfItems[i].length;j++){
				var input = document.getElementById(quantityOfPagesOfItems[i][j]);
				if (input){
					quantityOfPages.push(input.getAttribute('quantityOfPages'));
				}
			}
		}
		item['quantityOfPages'] = quantityOfPages;

		var materials=[];
		if (materialsOfItems[i]){
			for (var j = 0; j < materialsOfItems[i].length;j++){
				var material = {};
				var input = document.getElementById(materialsOfItems[i][j]);
				if (input){
					material['paper'] = input.getAttribute('paper');
					material['gr'] = input.getAttribute('gr');
				}
				materials.push(material);
			}
		}
		item['materials'] = materials;

		var finishes = [];
		if (itemFinishes[i]){
			for (var j = 0; j < itemFinishes[i].length;j++ ){
				var finish = {};
				if (itemFinishes[i][j]){
					for (var k = 0; k < itemFinishes[i][j].length;k++ ){
						var input = document.getElementById(itemFinishes[i][j][k]);
						if (input.value.length>0 && input.value !== 'Selecciona'){
							if (input.type != "checkbox"){
								finish[itemFinishes[i][j][k].slice(5,-1)] = input.value;
							}else{
								finish[itemFinishes[i][j][k].slice(5,-1)] = input.checked;
							}
						}else{
							if (input && input.type == 'select-one'){
								break;
							}else{
								finish[itemFinishes[i][j][k].slice(5,-1)]  = '';
							}
						}	
					}
				}
				if (Object.keys(finish).length>0){
					finishes.push(finish);
				}
			}
		}
		item['finishes'] = finishes;
		
		itemsObject.push(item);
	}
	estimate['items'] = itemsObject;

	commentsObject = {};
	for (var i = 0; i < comments.length;i++){
		var input = document.getElementById(comments[i]);
		if (input.value.length>0 && input.value !== 'Selecciona'){
			commentsObject[comments[i]] = input.value;
		}else{
			commentsObject[comments[i]] = '';
		}
	}
	estimate['comments'] = commentsObject;

	customerObject = {};
	for (var i = 0; i < customer.length;i++){
		var input = document.getElementById(customer[i]);
		if (input.value.length>0 && input.value !== 'Selecciona'){
			customerObject[customer[i]] = input.value;
		}else{
			customerObject[customer[i]] = '';
		}
	}
	estimate['customer'] = customerObject;

	return estimate;

};


var focusOutOnQuantity = function(elementFocusedOut){
	if (elementFocusedOut.value.length > 0){
		var chip = createChip('quantityChip' + ++quantityOfQuantities,elementFocusedOut.value,['quantity'],[elementFocusedOut.value])
		var quantityChipsDiv = document.getElementById('quantityChipsDiv');	
		quantityChip.push('quantityChip' + quantityOfQuantities);
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
		if (quantityOfPagesOfItems[itemNumber-1]){
			quantityOfPagesOfItems[itemNumber-1].push('item' + itemNumber + 'quantityOfPagesChip' + quantityOfPages);
		}else{
			quantityOfPagesOfItems[itemNumber-1] = ['item' + itemNumber + 'quantityOfPagesChip' + quantityOfPages];
		}
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

var createItem = function(thisItem){
	quantityOfItems++;
	var divContainer = createElement('div','container','item' + quantityOfItems + 'container');
	var formItem = createElement('form','col s12','item' + quantityOfItems + 'form');

	var h1 = createElement('h1','titulo','item' + quantityOfItems + 'title','Item ' + quantityOfItems);
	var divRow = createElement('div','row','','');

	var divItemName = createTextInput('s6','item' + quantityOfItems + 'name','Nombre del item','text',thisItem?thisItem['name']:null);
	divRow.appendChild(divItemName);
	item.push('item' + quantityOfItems + 'name');
	
	var divItemInks = createTextInput('s4','item' + quantityOfItems + 'inks','Tintas F/D','text',thisItem?thisItem['inks']:null);
	divRow.appendChild(divItemInks);
	item.push('item' + quantityOfItems + 'inks');

	var switchAlVivo = createSwitch('s2','item' + quantityOfItems + 'bleedPrint','¿Impresión al vivo?',thisItem?thisItem['bleedPrint']:null);
	divRow.appendChild(switchAlVivo);
	item.push('item' + quantityOfItems + 'bleedPrint');

	var divInksDetails = createTextInput('s6','item' + quantityOfItems + 'inksDetails','Detalle de tintas','text',thisItem?thisItem['inksDetails']:null);
	divRow.appendChild(divInksDetails);
	item.push('item' + quantityOfItems + 'inksDetails');

	var divOpenedSize = createTextInput('s6','item' + quantityOfItems + 'openedSize','Tamaño Abierto','text',thisItem?thisItem['openedSize']:null);
	divRow.appendChild(divOpenedSize);
	item.push('item' + quantityOfItems + 'openedSize');

	var selectMaterial = createSelect('s4','item' + quantityOfItems + 'material',materials,'Material')
	divRow.appendChild(selectMaterial);

	var switchgr = createTextInput('s2','item' + quantityOfItems + 'paperGr','Gramaje','number');
	divRow.appendChild(switchgr);

	var divChips = createElement('div','input-field col s6','item' + quantityOfItems + 'paperChips');
	divRow.appendChild(divChips);

	var divQuantityOfPages = createTextInput('s6','item' + quantityOfItems + 'quantityOfPages','Cantidad de Páginas','number');
	divRow.appendChild(divQuantityOfPages);
	
	var divAllTheSame = createSwitch('s2','Item' + quantityOfItems + 'allTheSame','¿Todas Iguales?',thisItem?thisItem['allTheSame']:null);
	divRow.appendChild(divAllTheSame);
	item.push('Item' + quantityOfItems + 'allTheSame');

	items.push(item);
	item = [];

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


	if (thisItem && thisItem['quantityOfPages']){
		for (var i = 0; i < thisItem['quantityOfPages'].length;i++){
			//Busco el DIV donde va el chip (depende del número de item)
			var quantityOfPagesChipsDiv = document.getElementById('item' + quantityOfItems + 'quantityOfPagesChips');
			//Busco cuantos chips ya hay, si no hay ninguno pongo 0
			var quantityOfPages = quantitiesOfquantityOfPages[quantityOfItems-1];
			if(!quantityOfPages){
				quantityOfPages=0;
			}
			quantitiesOfquantityOfPages[quantityOfItems-1] = ++quantityOfPages;
			//creo el chip
			var chip = createChip('item' + quantityOfItems + 'quantityOfPagesChip' + quantityOfPages,thisItem['quantityOfPages'][i],['quantityOfPages'],[thisItem['quantityOfPages'][i]]);
			quantityOfPagesChipsDiv.appendChild(chip);
			if (quantityOfPagesOfItems[quantityOfItems-1]){
				quantityOfPagesOfItems[quantityOfItems-1].push('item' + quantityOfItems + 'quantityOfPagesChip' + quantityOfPages);
			}else{
				quantityOfPagesOfItems[quantityOfItems-1] = ['item' + quantityOfItems + 'quantityOfPagesChip' + quantityOfPages];
			}
		}
	}

	if(thisItem && thisItem['materials']){
		for (var i = 0; i < thisItem['materials'].length;i++){
			//Busco el DIV donde va el chip (depende del número de item)
			var materialChipsDiv = document.getElementById('item' + quantityOfItems + 'paperChips');
			//Busco cuantos chips ya hay, si no hay ninguno pongo 0
			var quantityOfMaterials = quantitiesOfMaterials[quantityOfItems-1]?quantitiesOfMaterials[quantityOfItems-1]:0;
			quantitiesOfMaterials[quantityOfItems-1] = ++quantityOfMaterials;	
			//creo el chip
			var chip = createChip('item' + quantityOfItems + 'MaterialChip' + quantityOfMaterials, thisItem['materials'][i]['paper'].substring(0,3) + ' ' + thisItem['materials'][i]['gr'],['paper','gr'],[thisItem['materials'][i]['paper'],thisItem['materials'][i]['gr']])
			materialChipsDiv.appendChild(chip);
			if (materialsOfItems[quantityOfItems-1]){
				materialsOfItems[quantityOfItems-1].push('item' + quantityOfItems + 'MaterialChip' + quantityOfMaterials);
			}else{
				materialsOfItems[quantityOfItems-1] = ['item' + quantityOfItems + 'MaterialChip' + quantityOfMaterials];
			}			
		}
	}

	if (thisItem && thisItem['finishes']){
		for (var i = 0; i < thisItem['finishes'].length;i++){
      		var finishSelect = document.getElementById('item' + quantityOfItems + 'finish' + (i+1));
      		finishSelect.value = thisItem['finishes'][i]['finish'];
      		$('#item' + quantityOfItems + 'finish' + (i+1)).material_select();
      		if (thisItem['finishes'][i]['comment']){
	      		var finishSelect = document.getElementById('item' + quantityOfItems + 'comment' + (i+1));
	      		finishSelect.value = thisItem['finishes'][i]['comment'];
				var label = $('label[for="item' + quantityOfItems + 'comment' + (i+1) + '"]');
				label[0].setAttribute('class','active');
			}
			if (thisItem['finishes'][i]['showToClient']){
				var showToClientCheck = document.getElementById('item' + quantityOfItems + 'showToClient' + (i+1));
				showToClientCheck.checked = thisItem['finishes'][i]['showToClient'];
			}
			addItemFinish(quantityOfItems);
		}
	}
}


var createComments = function(estimateObject){
	var divContainer = createElement('div','container','commentsContainer');
	var formItem = createElement('form','col s12','commentsForm');

	var h1 = createElement('h1','titulo','commentsTitle','Comentarios');
	var divRow = createElement('div','row','','');

	var divInternalComments = createTextInput('s6','internalComments','Internos','text',estimateObject?estimateObject['comments']['internalComments']:null);
	divRow.appendChild(divInternalComments);
	
	var divClientComments = createTextInput('s6','clientComments','Al Cliente','text',estimateObject?estimateObject['comments']['clientComments']:null);
	divRow.appendChild(divClientComments);

	formItem.appendChild(h1);
	formItem.appendChild(divRow);
	divContainer.appendChild(formItem);

	commentsDiv.appendChild(divContainer);
}

var createCustomer = function(estimateObject){
	var divContainer = createElement('div','container','customerContainer');
	var formItem = createElement('form','col s12','customerForm');

	var h1 = createElement('h1','titulo','customerTitle','Datos del cliente');
	var divRow = createElement('div','row','','');

	divRow.appendChild(createTextInput('s6','comenrcialName','Nombre comercial o fantasia','text',estimateObject?estimateObject['customer']['comenrcialName']:null));
	divRow.appendChild(createTextInput('s6','businessName','Razón social','text',estimateObject?estimateObject['customer']['businessName']:null));

	divRow.appendChild(createTextInput('s6','rut','RUT','text',estimateObject?estimateObject['customer']['rut']:null));
	divRow.appendChild(createTextInput('s6','address','Dirección','text',estimateObject?estimateObject['customer']['address']:null));

	divRow.appendChild(createTextInput('s6','contactName','Nombre','text',estimateObject?estimateObject['customer']['contactName']:null));
	divRow.appendChild(createTextInput('s6','contactEmail','Email','text',estimateObject?estimateObject['customer']['contactEmail']:null));

	divRow.appendChild(createTextInput('s6','contactPhone','Teléfono','text',estimateObject?estimateObject['customer']['contactPhone']:null));
	divRow.appendChild(createSelect('s6','paymentWay',paymentWays,'Forma de pago'));

	formItem.appendChild(h1);
	formItem.appendChild(divRow);
	divContainer.appendChild(formItem);

	customerDiv.appendChild(divContainer);


	$('select#paymentWay').material_select();
}


var createGeneralInformation = function(estimateObject){
	var divContainer = createElement('div','container','generalContainer');
	var formItem = createElement('form','col s12','generalForm');

	var h1 = createElement('h1','titulo','generalTitle','General');
	var divRow = createElement('div','row','','');

	var workTypeFinish = createSelect('s4','workType',workTypes,'Tipo de Trabajo',estimateObject?estimateObject['workType']:null);
	divRow.appendChild(workTypeFinish);

	var divQuantity = createTextInput('s4','quantity','Cantidad','number');
	divRow.appendChild(divQuantity);

	var divChips = createElement('div','input-field col s4','quantityChipsDiv');
	divRow.appendChild(divChips);
	
	var divClossedSize = createTextInput('s12','clossedSize','Tamaño cerrado (mm)','text',estimateObject?estimateObject['clossedSize']:null);
	divRow.appendChild(divClossedSize);

	formItem.appendChild(h1);
	formItem.appendChild(divRow);

	var subtitleFinishes = createElement('p','subtitulo','','Terminaciones');
	formItem.appendChild(subtitleFinishes);


	var divRowFinishes = createElement('div','row','generalFinishesRow','');
	
	formItem.appendChild(divRowFinishes);
	divContainer.appendChild(formItem);

	generalDiv.appendChild(divContainer);

 	addGeneralFinish(quantityOfGeneralFinishes);


	$('select#workType').material_select();

	var quantity = document.getElementById('quantity');

	quantity.addEventListener('focusout',function(e){
	        focusOutOnQuantity(e.srcElement);
	});

	quantity.addEventListener('keyup',function(e){
	    if(e.keyCode === 13 || e.keyCode === 32){
	        focusOutOnQuantity(e.srcElement);
	    }
	});

	if (estimateObject && estimateObject['quantity']){
		for (var i = 0; i < estimateObject['quantity'].length;i++){
			var chip = createChip('quantityChip' + ++quantityOfQuantities,estimateObject['quantity'][i],['quantity'],[estimateObject['quantity'][i]])
			var quantityChipsDiv = document.getElementById('quantityChipsDiv');	
			quantityChip.push('quantityChip' + quantityOfQuantities);
			quantityChipsDiv.appendChild(chip);
		}
	}

	if (estimateObject && estimateObject['finishes']){
		for (var i = 0; i < estimateObject['finishes'].length;i++){
      		var finishSelect = document.getElementById('generalfinish' + (i+1));
      		finishSelect.value = estimateObject['finishes'][i]['finish'];
      		$('#generalfinish' + (i+1)).material_select();
      		if (estimateObject['finishes'][i]['finishComment']){
	      		var finishSelect = document.getElementById('generalfinishComment' + (i+1));
	      		finishSelect.value = estimateObject['finishes'][i]['finishComment'];
				var label = $('label[for="generalfinishComment' + (i+1) + '"]');
				label[0].setAttribute('class','active');
			}
			if (estimateObject['finishes'][i]['showToClientFinish']){
				var showToClientCheck = document.getElementById('generalshowToClientFinish' + (i+1));
				showToClientCheck.checked = estimateObject['finishes'][i]['showToClientFinish'];
			}
			addGeneralFinish();
		}
	}
}



var createItemFinish = function(itemNumber,finishNumber){
	var itemFinish = [];
	var divRowFinishes = document.getElementById('item' + itemNumber + 'finishes');
	var selectFinish = createSelect('s6','item' + itemNumber + 'finish' + finishNumber,finishes,'Tipo');
	divRowFinishes.appendChild(selectFinish);
	itemFinish.push('item' + itemNumber + 'finish' + finishNumber);

	var divFinishComment = createTextInput('s4','item' + itemNumber + 'comment'+finishNumber,'Comentario');
	divRowFinishes.appendChild(divFinishComment);
	itemFinish.push('item' + itemNumber + 'comment'+finishNumber);


	var switchShowToClient = createSwitch('s2','item' + itemNumber + 'showToClient'+finishNumber,'¿Mostrar al cliente?');
	divRowFinishes.appendChild(switchShowToClient);
	itemFinish.push('item' + itemNumber + 'showToClient'+finishNumber);

	if(itemFinishes[itemNumber-1]){
		itemFinishes[itemNumber-1].push(itemFinish);
	}else{
		itemFinishes[itemNumber-1] = [itemFinish];
	}
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
	var generalFinish = [];
	var divRowFinishes = document.getElementById('generalFinishesRow');
	var selectFinish = createSelect('s6','generalfinish' + quantity,finishes,'Tipo');
	generalFinish.push('generalfinish' + quantity);
	divRowFinishes.appendChild(selectFinish);

	var divFinishComment = createTextInput('s4','generalfinishComment' + quantity,'Comentario');
	generalFinish.push('generalfinishComment' + quantity);
	divRowFinishes.appendChild(divFinishComment);


	var switchShowToClient = createSwitch('s2','generalshowToClientFinish' + quantity,'¿Mostrar al cliente?');
	generalFinish.push('generalshowToClientFinish' + quantity);
	divRowFinishes.appendChild(switchShowToClient);

	generalFinishes.push(generalFinish);
	

	$('select#generalfinish' + quantity).material_select();

	$('#generalfinish' + quantity).on('change', function(e) {
		if(e.target.getAttribute('id') == ('generalfinish' + quantityOfGeneralFinishes )){
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
		if (materialsOfItems[itemNumber-1]){
			materialsOfItems[itemNumber-1].push('item' + itemNumber + 'MaterialChip' + quantityOfMaterials);
		}else{
			materialsOfItems[itemNumber-1] = ['item' + itemNumber + 'MaterialChip' + quantityOfMaterials];
		}
		//vuelvo a cero o a vacio los inputs que crean este chip, para que se pueda crear otro chip
		materialSelectFocusedOut.selectedIndex = 0;
		$('select#item' + itemNumber + 'material').material_select();
		materialGrFocusedOut.value = '';
	}
};

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
	var label = createElement('label','','',inputLabelValue,'',inputId);
	if (valueForInput){
		input.value=valueForInput;
		label.setAttribute('class','active');
	}
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


/*$(window).on('load', function() {
	createGeneralInformation();
	createItem();
	createComments();
	createCustomer();
});*/

var createTrelloCardName = function(){
	return estimate.quantity + "x" + estimate.workType + " - " + estimate.customer.comenrcialName;
}


var updateCard = function() {
	startLoader();
	t.card('all')
	.then(function(card) {
	  var estimate = createObject();
	  t.set('card', 'shared', cardInfoKey, estimate)
		.then(function(){
		  updateTrelloCard(t, {id: card.id, desc: createTextForCard(estimate)},
			function(){
			  t.closeModal();
			});
		});
	});
  };

var createCard = function(){
	var estimate = createObject();
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


addCardButton.addEventListener('click',createCard);