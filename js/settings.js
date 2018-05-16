/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var idPrefix = document.getElementById('idPrefix');
var idStartNumber = document.getElementById('idStartNumber');
var idSuffix = document.getElementById('idSuffix');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'pappira.idSuffix'),
    t.get('board', 'shared', 'pappira.idStartNumber'),
    t.get('board', 'shared', 'pappira.idSuffix')
  ])
  .spread(function(savedPrefix, savedStartedNumber, savedSuffix){
    if(savedPrefix){
      idPrefix.value = savedPrefix;
    }
    if(savedSuffix){
      idSuffix.value = savedSuffix;
    }
    if(savedStartedNumber && /[0-9]+/.test(savedStartedNumber)){
      idStartNumber.value = savedStartedNumber;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('board', 'shared', 'pappira.idSuffix', idPrefix.value)
  .then(function(){
    return t.set('board', 'shared', 'pappira.idStartNumber', idStartNumber.value);
  })
  .then(function(){
    return t.set('board', 'shared', 'pappira.idSuffix', idSuffix.value);
  })
  .then(function(){
    t.closePopup();
  })
})
