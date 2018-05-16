/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var idPrefix = document.getElementById('idPrefix');
var idStartNumber = document.getElementById('idStartNumber');
var idSuffix = document.getElementById('idSuffix');
var idEnabled = document.getElementById('idEnabled');
var idSaveButton = document.getElementById('idSave');
var idRemoveButton = document.getElementById('idRemove');
var idEnableButton = document.getElementById('idEnable');
var idDisableButton = document.getElementById('idDisable');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'pappira.idPrefix'),
    t.get('board', 'shared', 'pappira.idStartNumber'),
    t.get('board', 'shared', 'pappira.idSuffix'),
    t.get('board', 'shared', 'pappira.idEnabled', false)
  ])
  .spread(function(savedPrefix, savedStartedNumber, savedSuffix, savedEnabled){
    if(savedPrefix){
      idPrefix.value = savedPrefix;
    }
    if(savedSuffix){
      idSuffix.value = savedSuffix;
    }
    idEnabled.value = savedEnabled;
    if(savedEnabled){
      idEnableButton.parentNode.removeChild(idEnableButton);
    } else {
      idDisableButton.parentNode.removeChild(idDisableButton);
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

idSaveButton.addEventListener('click', function(){
  return t.set('board', 'shared', 'pappira.idPrefix', idPrefix.value)
  .then(function(){
    return t.set('board', 'shared', 'pappira.idStartNumber', idStartNumber.value);
  })
  .then(function(){
    return t.set('board', 'shared', 'pappira.idSuffix', idSuffix.value);
  })
  .then(function(){
    t.closePopup();
  })
});

idRemoveButton.addEventListener('click', function(){
  return t.set('board', 'shared', 'pappira.idEnabled', false)
  .then(function(){
    return t.set('board', 'shared', 'pappira.idRemove', true);
  })
  .then(function(){
    t.closePopup();
  })
});
idEnableButton.addEventListener('click', function(){
  return t.set('board', 'shared', 'pappira.idEnabled', true)
  .then(function(){ 
    return t.set('board', 'shared', 'pappira.idRemove', false);
  })
  .then(function(){
    t.closePopup();
  })
});
idDisableButton.addEventListener('click', function(){
  return t.set('board', 'shared', 'pappira.idEnabled', false)
  .then(function(){ 
    return t.set('board', 'shared', 'pappira.idRemove', false);
  })
  .then(function(){
    t.closePopup();
  })
});
