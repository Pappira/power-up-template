﻿(function (jsPDFAPI) {
var callAddFont = function () {
this.addFileToVFS('Cambria Math-normal.ttf', font);
this.addFont('Cambria Math-normal.ttf', 'Cambria Math', 'normal');
};
jsPDFAPI.events.push(['addFonts', callAddFont])
 })(jsPDF.API);