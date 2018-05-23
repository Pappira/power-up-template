/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var validations = t.arg('validations');

var list = document.getElementById('list');

t.render(function(){
  t.card('all')
  .get('all')
  .then(function(card){
    if(validations && validations.length){
      for(var i=0;i<validations.length;i++){
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(validations[i]));
        list.appendChild(li);
      }
    }
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});


