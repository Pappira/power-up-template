var getWorkOrderPDFCallBack = function(t){
    var cardInfoKey = 'pappira.cardInfo';
    return t.get('card', 'shared', cardInfoKey)
    .then(function(cardInfo){
        return t.modal({
            url: './show-pdf.html', // The URL to load for the iframe
            args: {estimate:cardInfo}, // Optional args to access later with t.arg('text') on './modal.html'
            accentColor: '#F2D600', // Optional color for the modal header 
            height: 1500, // Initial height for iframe; not used if fullscreen is true
            fullscreen: false, // Whether the modal should stretch to take up the whole screen
            title: 'Orden de Trabajo', // Optional title for modal header
            // You can add up to 3 action buttons on the modal header - max 1 on the right side.
            actions: [],
        });
    });
};

var getWorkOrderPDFCallBack2 = function(t){
    var cardInfoKey = 'pappira.cardInfo';
    return t.get('card', 'shared', cardInfoKey)
    .then(function(cardInfo){
        workOrderPDF(cardInfo,true);
    });
};