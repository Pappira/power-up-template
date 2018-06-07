var fontType = "arial";
var fontSize = 10;
var rowSize = 5;
var leftMargin = 10;
var normalBoxLength = 28;
var separation = 4.4; 
var heigthSeparation = 11;

var workOrderPDF = function(){
    var diagonalLogo = 'data:image/jpeg;base64,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';
    var doc = new jsPDF();
    doc.setFont(fontType);
    doc.setFontSize(fontSize);
    var firstColumn = leftMargin;
    var secondColumn = (separation+normalBoxLength)+leftMargin
    var thirdColumn = 2*(separation+normalBoxLength)+leftMargin;
    var fourthColumn = 3*(separation+normalBoxLength)+leftMargin;
    var fifthColumn = 4*(separation+normalBoxLength)+leftMargin;
    var sixthColumn = 5*(separation+normalBoxLength)+leftMargin;

    doc.addImage(diagonalLogo, 'JPEG', leftMargin, 5, 97, 26); 
    writeTextInDoc(doc,"Prometido","<Prometido>",fifthColumn,8,normalBoxLength*2+separation);
    writeTextInDoc(doc,"Orden N°","<Orden n°>",fifthColumn,19,normalBoxLength);
    writeTextInDoc(doc,"Fecha de Ingreso","<Fecha de Ingreso>",sixthColumn,19,normalBoxLength);

    var heigth = heigthSeparation*3;
    writeTextInDoc(doc,"Nombre / Empresa","<Nombre / Empresa>",firstColumn,heigth,normalBoxLength*4+separation*3);
    writeTextInDoc(doc,"Cantidad","<Cantidad>",fifthColumn,heigth,normalBoxLength*2+separation);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"Trabajo","<Trabajo>",firstColumn,heigth,normalBoxLength*4 + separation*3 );
    writeTextInDoc(doc,"Páginas","<Páginas>",fifthColumn,heigth,normalBoxLength);
    writeTextInDoc(doc,"Vías","<Vías>",sixthColumn,heigth,normalBoxLength);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"Armado x Pliego","<Armado>",firstColumn,heigth,normalBoxLength);
    writeTextInDoc(doc,"Faces","<Faces>",secondColumn ,heigth, normalBoxLength);
    writeTextInDoc(doc,"Tamaño Abierto","<Abierto>",thirdColumn, heigth, normalBoxLength);
    writeTextInDoc(doc,"Tamaño Cerrado","<Vías>",fourthColumn,heigth, normalBoxLength);
    writeTextInDoc(doc,"Numerado","<Numerado>",fifthColumn, heigth, normalBoxLength);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"","Papel",firstColumn, heigth, normalBoxLength,[0,0,0],[255,255,255]);
    doc.line(firstColumn, heigth+rowSize, firstColumn + normalBoxLength*6+separation*5, heigth+rowSize); 

    heigth += heigthSeparation;
    writeTextInDoc(doc,"Tipo de Papel","<Tipo de papel>",firstColumn,heigth,normalBoxLength*3 + separation*2);
    writeTextInDoc(doc,"Gr.","<Gr.>",fourthColumn ,heigth, normalBoxLength);
    writeTextInDoc(doc,"Tamaño de papel","<Tamaño de papel>",fifthColumn, heigth, normalBoxLength*2 + separation);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"Cantidad de hojas a cortar x cada vía","<Cantidad de hojas a cortar x cada vía>",firstColumn,heigth, normalBoxLength*2 + separation);
    writeTextInDoc(doc,"Cortado en","<Cortado en>",thirdColumn, heigth, normalBoxLength);
    writeTextInDoc(doc,"Tamaño del Pliego","<Tamaño del pliego>",fourthColumn, heigth, normalBoxLength);
    writeTextInDoc(doc,"Cantidad de trozos x cada vía","<Cantidad de trozos x cada vía>",fifthColumn, heigth, normalBoxLength*2 + separation);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"","Impresión  " + "<Impresora>",firstColumn, heigth, normalBoxLength*2+separation,[0,0,0],[255,255,255]);
    doc.line(firstColumn, heigth+rowSize, firstColumn + normalBoxLength*6+separation*5, heigth+rowSize); 

    heigth += heigthSeparation;
    writeTextInDoc(doc,"Armado","<Armado>",firstColumn,heigth,normalBoxLength);
    writeTextInDoc(doc,"Tamaño del pliego","<Tamaño del pliego>",secondColumn ,heigth, normalBoxLength);
    writeTextInDoc(doc,"Demasía","<Demasía>",thirdColumn, heigth, normalBoxLength);
    writeTextInDoc(doc,"Tiraje con Demasía","<Tiraje con Demasía>",fourthColumn,heigth, normalBoxLength);
    //TODO sacar el recuadro negro, o hacerle un recuadro blanco
    doc.text(fifthColumn, heigth+rowSize + rowSize-1.5, "Por cada vía y color");
   // writeTextInDoc(doc,"","Por cada vía y color",fifthColumn, heigth, normalBoxLength*2);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"Tamaño final abierto","<Tamaño final abierto>",firstColumn,heigth,normalBoxLength*2 + separation);
    writeTextInDoc(doc,"Cantidad final de pasadas de máquina por color con demasía","<Cantidad final de pasadas de máquina por color con demasía>",thirdColumn ,heigth, normalBoxLength*2 + separation);
    
    heigth += heigthSeparation;
    writeTextInDoc(doc,"Tintas","<Tintas>",firstColumn, heigth, normalBoxLength);
    writeTextInDoc(doc,"Chapas","<chapas>",secondColumn,heigth, normalBoxLength);
    writeTextInDoc(doc,"Descripción de las tintas","<Descripción de las tintas>",thirdColumn, heigth, normalBoxLength*3 + separation);

    heigth += heigthSeparation;
    writeTextInDoc(doc,"","Terminaciones",firstColumn, heigth, normalBoxLength*2+separation,[0,0,0],[255,255,255]);
    doc.line(firstColumn, heigth+rowSize, firstColumn + normalBoxLength*6+separation*5, heigth+rowSize); 

    heigth += rowSize;
    var terminacionesDeOrigen = ["marcado","laminado","doblado"];
    for (var i = 0; i < terminacionesDeOrigen.length;i++){
        var boxLength = normalBoxLength*3 + separation*2;
        doc.text(firstColumn, heigth+rowSize + rowSize-1.5, " - " + terminacionesDeOrigen[i]);
        heigth += rowSize;
    }  
    heigth += heigthSeparation - rowSize;
    
    writeTextInDoc(doc,"","Terminaciones Generales",firstColumn, heigth, normalBoxLength*2+separation,[0,0,0],[255,255,255]);
    doc.line(firstColumn, heigth+rowSize, firstColumn + normalBoxLength*6+separation*5, heigth+rowSize); 

    heigth += rowSize;
    var terminacionesDeOrigen = ["Encuadernado con Lomo","Corte","empaquetado"];
    for (var i = 0; i < terminacionesDeOrigen.length;i++){
        var boxLength = normalBoxLength*3 + separation*2;
        doc.text(firstColumn, heigth+rowSize + rowSize-1.5, " - " + terminacionesDeOrigen[i]);
        heigth += rowSize;
    }  
    heigth += heigthSeparation - rowSize;

    writeTextInDoc(doc,"","Comentarios",firstColumn, heigth, normalBoxLength*2+separation,[0,0,0],[255,255,255]);
    doc.line(firstColumn, heigth+rowSize, firstColumn + normalBoxLength*6+separation*5, heigth+rowSize); 
    heigth += rowSize;
    doc.text(firstColumn, heigth+rowSize + rowSize-1.5, "<Comentarios>");

    doc.save('demo.pdf');
};

var writeTextInDoc = function(doc,name,value,x,y,boxLength,boxBackgroundColor,fontColor){
    var fill;
    doc.text(x, y + rowSize-1.5, name);

    if (boxBackgroundColor && boxBackgroundColor.length === 3){
        fill = 'F';
        doc.setFillColor(boxBackgroundColor[0],boxBackgroundColor[1],boxBackgroundColor[2]);
    }
    doc.rect(x, y+rowSize, boxLength, rowSize,fill);

    doc.setFontType("bold");
    if(fontColor && fontColor.length === 3){
        doc.setTextColor(fontColor[0],fontColor[1],fontColor[2]);
    }
    doc.text(x+boxLength/2, y+rowSize + rowSize-1.5, value, null, null, 'center');

    resetDocProperties(doc);
    return doc;
};

var resetDocProperties = function (doc){
    doc.setFillColor(255,255,255);
    doc.setFontType("normal");
    doc.setTextColor(0,0,0);

}
