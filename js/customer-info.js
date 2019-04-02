var t = TrelloPowerUp.iframe();

var commentsDiv = document.getElementById('commentsDiv');
var customerDiv = document.getElementById('customerDiv');
var addCardButton = document.getElementById('addCardButton');


var paymentWays = ['Contado','Seña del 50% y saldo contra-entrega','Seña del 40% y saldo contra-entrega','SIIF 30 días','SIIF 60 días'];


var comments = ['internalComments','clientComments'];
var customer = ['comercialName','businessName','rut','address','contactName','contactEmail','contactPhone','paymentWay'];
var estimate = {};

var cardInfoKey = 'pappira.cardInfo';

t.render(function(){
	return t.get('card', 'shared', cardInfoKey)
	.then(function(cardInfo){
		if (addCardButton){
		    addCardButton.addEventListener('click', createEstimateAndUpdateCard);
		}
	  if(cardInfo){
			estimate = deTranslateEstimate(JSON.parse( LZString.decompress(cardInfo)));
			createComments(estimate);
			createCustomer(estimate);
	  }else{
			createComments();
			createCustomer();
	  }
	});
});

var createObject = function(){
	commentsObject = {};
	for (var i = 0; i < comments.length;i++){
		var input = document.getElementById(comments[i]);
		if (input && input.value.length>0 && input.value !== 'Selecciona'){
			commentsObject[comments[i]] = input.value;
		}else{
			commentsObject[comments[i]] = '';
		}
	}
	estimate.comments = commentsObject;

	customerObject = {};
	for (var i = 0; i < customer.length;i++){
		var input = document.getElementById(customer[i]);
		if (input && input.value.length>0 && input.value !== 'Selecciona'){
			customerObject[customer[i]] = input.value;
		}else{
			customerObject[customer[i]] = '';
		}
	}
	estimate.customer = customerObject;

	return estimate;

};

var createComments = function(estimateObject){
	var divContainer = createElement('div','container','commentsContainer');
	var formItem = createElement('form','col s12','commentsForm');

	var h1 = createElement('h1','titulo','commentsTitle','Comentarios');
	var divRow = createElement('div','row','','');

	var divInternalComments = createTextInput('s6','internalComments','Internos','text',(estimateObject && estimateObject.comments)?estimateObject.comments.internalComments:null);
	divRow.appendChild(divInternalComments);
	
	var divClientComments = createTextInput('s6','clientComments','Al Cliente','text',(estimateObject && estimateObject.comments)?estimateObject.comments.clientComments:null);
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

	divRow.appendChild(createTextInput('s6','comercialName','Nombre comercial o fantasia','text',(estimateObject && estimateObject.customer)?estimateObject.customer.comercialName:null));
	divRow.appendChild(createTextInput('s6','businessName','Razón social','text',(estimateObject && estimateObject.customer)?estimateObject.customer.businessName:null));

	divRow.appendChild(createTextInput('s6','rut','RUT','text',(estimateObject && estimateObject.customer)?estimateObject.customer.rut:null));
	divRow.appendChild(createTextInput('s6','address','Dirección','text',(estimateObject && estimateObject.customer)?estimateObject.customer.address:null));

	divRow.appendChild(createTextInput('s6','contactName','Nombre','text',(estimateObject && estimateObject.customer)?estimateObject.customer.contactName:null));
	divRow.appendChild(createTextInput('s6','contactEmail','Email','text',(estimateObject && estimateObject.customer)?estimateObject.customer.contactEmail:null));

	divRow.appendChild(createTextInput('s6','contactPhone','Teléfono','text',(estimateObject && estimateObject.customer)?estimateObject.customer.contactPhone:null));
	var select = createSelect('s6','paymentWay',paymentWays,'Forma de pago');
	divRow.appendChild(select);

	formItem.appendChild(h1);
	formItem.appendChild(divRow);
	divContainer.appendChild(formItem);

	customerDiv.appendChild(divContainer);


	select.value = (estimateObject && estimateObject.customer)?estimateObject.customer.paymentWay:'';
	$('select#paymentWay').material_select();
}

var createEstimateAndUpdateCard = function() {
	estimate = createObject();
	updateCard(estimate);
	};
	
	$(window).bind("load", function() {
	var select = document.getElementById('paymentWay');
	select.value = (estimateObject && estimateObject.customer)?estimateObject.customer.paymentWay:'';
	$('select#paymentWay').material_select();
 });