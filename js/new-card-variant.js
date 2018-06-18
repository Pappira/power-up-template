var variantSelect = document.getElementById('variantSelect');
var variantName = document.getElementById('variantName');
var variantType = document.getElementById('variantType');
var variantTable = document.getElementById('variantTable');
var variantsTable = document.getElementById('variantsTable');
var variantAddButton = document.getElementById('variantAddButton');
var additionalPrice = document.getElementById('additionalPrice');
var variantPrice = document.getElementById('variantPrice');
var variantContainer = document.getElementById('variantContainer');
var variants = [];

var addItemToVariantSelect = function(items, index){
    var option = createOption(index, items[index].itemName);
    variantSelect.appendChild(option);
  };
  
  var addVariantTypesOnVariantSelectChange = function(){
    var index = variantSelect.selectedIndex;
    var item = items[index-1];
    var input = document.createElement('input');
    input.setAttribute("type","number");
    var rows = variantTable.rows.length;
    for (i = 1; i < rows;i++){
      variantTable.deleteRow(1);
    }
    var variantType = document.createElement("select");
    variantType.options.length = 0;
    if (index === 0){
      variantType.appendChild(createOption("quantity","Cantidad"));
    }else{
      variantType.appendChild(createOption("vias","Vías"));
      variantType.appendChild(createOption("pages","Páginas"));
      if(item.openSize === item.closedSize){
        variantType.appendChild(createOption("size","Tamaño"));
      }else{
        variantType.appendChild(createOption("openSize","Tamaño Abierto"));
        variantType.appendChild(createOption("closedSize","Tamaño Cerrado"));
      }
      if (item.numbered){
        variantType.appendChild(createOption("numeration","Numeración"));
      }
      variantType.appendChild(createOption("material","Material"));
      variantType.appendChild(createOption("weight","Peso"));
      variantType.appendChild(createOption("color","Color"));
      variantType.appendChild(createOption("inksQuantity","Cantidad de tintas"));
      variantType.appendChild(createOption("inksDescription","Detalle de tintas"));
      variantType.appendChild(createOption("phases","Fases"));
    }
    variantType.addEventListener("change",changeType);
    var tr = document.createElement("tr");
    var tdVariant = document.createElement("td");
    tdVariant.appendChild(input);
    var tdValue = document.createElement("td");
    tdValue.appendChild(variantType);
    var button = document.createElement("button");
    button.onclick = addVariantTypeRow;
    button.innerHTML = "+";
    var tdButton = document.createElement("td");
    tdButton.appendChild(button);
    tr.appendChild(tdValue);
    tr.appendChild(tdVariant);
    tr.appendChild(tdButton);
    variantTable.appendChild(tr);
  }
  
  var createOption = function (value,name){
    var option = document.createElement('option');
    option.value = value;
    option.innerHTML = name;
    return option;
  }
  
  var addVariantTypeRow = function(){
    var currentTr = this.parentNode.parentNode;
    var newTr = currentTr.cloneNode(true);
    var input = document.createElement("input");
    input.setAttribute("type","number");
    newTr.getElementsByTagName('td')[1].innerHTML = "";
    newTr.getElementsByTagName('td')[1].appendChild(input);
    newTr.getElementsByTagName('td')[2].getElementsByTagName('button')[0].onclick = addVariantTypeRow;
    newTr.getElementsByTagName('td')[0].getElementsByTagName('select')[0].addEventListener("change",changeType);
    currentTr.getElementsByTagName('td')[2].getElementsByTagName('button')[0].onclick = removeVariantTypeRow;
    currentTr.getElementsByTagName('td')[2].getElementsByTagName('button')[0].innerHTML = "-";
    variantTable.appendChild(newTr);
  }
  
  var removeVariantTypeRow = function(){
    var currentTr = this.parentNode.parentNode.rowIndex;
    variantTable.deleteRow(currentTr);
  }
  
  var changeType = function(){
    var currentTr = this.parentNode.parentNode;
    switch (this.options[this.selectedIndex].value){
      case "quantity":
      case "vias":
      case "pages":
      case "weight":
      case "inksQuantity":
        var input = currentTr.getElementsByTagName('td')[1].getElementsByTagName('input')[0];
        if(input){
          input.setAttribute("type","number");
        }else{
          var input = document.createElement("input");
          input.setAttribute("type","number");
          currentTr.getElementsByTagName('td')[1].innerHTML = "";
          currentTr.getElementsByTagName('td')[1].appendChild(input);
        }
        break;
      case "material":
        var select = currentTr.getElementsByTagName('td')[1].getElementsByTagName('select')[0];
        var material2 = material.cloneNode(true);
        if(select){
          select = material2;
        }else{
          currentTr.getElementsByTagName('td')[1].innerHTML = "";
          currentTr.getElementsByTagName('td')[1].appendChild(material2);
        }
        break;
      default:
        var input = document.createElement("input");
        input.setAttribute("type","text");
        currentTr.getElementsByTagName('td')[1].innerHTML = "";
        currentTr.getElementsByTagName('td')[1].appendChild(input);
        break;
    }
  }
  
  variantType.addEventListener("change",changeType);
  variantSelect.addEventListener("change",addVariantTypesOnVariantSelectChange);
  variantTypeAddButton.onclick = addVariantTypeRow;

var addVariant = function(){
    var changes = [];
    for (var i = 1, row; row = variantTable.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        var variant ={};
        var name = "";
        var value = "";
        var option = row.cells[0].getElementsByTagName('select')[0];
        name = option[option.selectedIndex].innerHTML;
        var key = option[option.selectedIndex].value;
        var input = row.cells[1].getElementsByTagName('input')[0];
        if (input){
            value = input.value;
        }else{
            var select = row.cells[1].getElementsByTagName('select')[0];
            value = select[select.selectedIndex].value;
        }
        variant["name"] = name;
        variant["value"] = value;
        variant["key"] = key;
        changes.push(variant);
     }
     var variant = {};
     variant["name"] = variantName.value;
     variant["item"] = variantSelect[variantSelect.selectedIndex].value;
     variant["changes"] = changes;
     variant["aditionalPrice"] = additionalPrice.checked;
     variant["price"] = variantPrice.value;
     variants.push(variant);
     addVariantToTable(variant,items);
     addVariantTypesOnVariantSelectChange();
     variantName.value ="";
     variantPrice.value = "";
     additionalPrice.checked = false;
} 


var addVariantToTable = function(variant,items){
    var tr = document.createElement("tr");
    var tdName = document.createElement("td");
    tdName.textContent = variant.name;
    var tdItem = document.createElement("td");
    tdItem.textContent = items[variant.item].itemName;
    var tdChanges = document.createElement("td");
    var tdChangesText ="";
    for (var i = 0; i < variant.changes.length; i++){
        tdChangesText += variant.changes[i]["name"] + ": " + variant.changes[i]["value"] + "\n" ;
    }
    tdChanges.textContent = tdChangesText;
    var tdPrice = document.createElement("td");
    tdPrice.textContent = (variant.aditionalPrice?"Adicional: ":"") + variant.price;
    tr.appendChild(tdName);
    tr.appendChild(tdItem);
    tr.appendChild(tdChanges);
    tr.appendChild(tdPrice);
    variantsTable.appendChild(tr);
    variantContainer.classList.remove("hide");

};

variantAddButton.addEventListener("click",addVariant);

