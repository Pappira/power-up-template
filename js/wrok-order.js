
var workOrderPDF = function(){

    var pdf = new jsPDF('p', 'pt', 'letter');
    var source = '<div style="text-align:center;">Page <span class="pageCounter"></span>/<span class="totalPages"></span></div><footer><div style="text-align:center;">Page <span class="pageCounter"></span>/<span class="totalPages"></span></div></footer>';

    specialElementHandlers = {
        '#bypassme': function (element, renderer) {
            return true
        }
    };
    margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };

    pdf.fromHTML(
        source, 
        margins.left, // x coord
        margins.top, { // y coord
            'width': margins.width, 
            'elementHandlers': specialElementHandlers
        },

        function (dispose) {
            pdf.save('Prueba.pdf');
        }, margins
    );

};