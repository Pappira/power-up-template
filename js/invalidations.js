/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var invalidations = t.arg('invalidations');

var list = document.getElementById('list');

t.render(function(){
  t.card('all')
  .then(function(card){
    if(invalidations && invalidations.length){
      for(var i=0;i<invalidations.length;i++){
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(invalidations[i]));
        list.appendChild(li);
      }
    }
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});


