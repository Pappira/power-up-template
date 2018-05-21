"use strict";

/* global TrelloPowerUp */
// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var ID_ICON = './images/fingerprint.svg';
var ERROR_ICON = './images/error.svg';
var OK_ICON = './images/check.svg';
var ERROR_COLOR = 'red';
var SUCCESS_COLOR = 'green';

var setPappiraCardId = function(t, id){
  t.set('card', 'shared', 'pappira.id', id);
};
var getPappiraCardId = function(t){
  return t.get('card', 'shared', 'pappira.id');
};
var removePappiraCardId = function(t){
  return t.remove('card', 'shared', 'pappira.id');
};
var isAuthorized = function(t){
  return t.get('member', 'private', 'token')
  .then(function(token){
    if(token){
      if(!Trello.token()){
        setTrelloToken(token);
      }
      return { authorized: true };
    } 
    return { authorized: false };
  });  
};
var setTrelloToken = function(token){
  Trello.setToken(token);
};
var setTrelloCardName = function(t, card, name){
  return isAuthorized(t).then(function(authorized){
    if(authorized.authorized){
      return Trello.put("/cards/"+card.id, {name: name});
    }
  });
};
var validateCard = function(t, cardId){
  var valid = false;
  var invalidations = [];
  return isAuthorized(t).then(function(authorized){
    if(authorized.authorized){
      return Trello.get("/cards/"+cardId,{fields: "name,desc,idChecklists",checklists: "all"}, function(retrievedCard){
        if(!retrievedCard.desc){
          invalidations.push("No hay descripción");
        }
        if(!retrievedCard.name){
          invalidations.push("No hay título");
        }
        if(!retrievedCard.idChecklists || !retrievedCard.idChecklists.lenght){
          invalidations.push("No hay terminaciones");
        }
        return invalidations;
      }, function(error){
        console.error("Could not get the card "+cardId);
        return false;
      });
    } else {
      return false;
    }
  });
};

var getValidationBadge = function(t, card, detailed){
  return validateCard(t, card.id, detailed).then(function(invalidations){
    var badge = {}, text = '', refresh = 60, color = SUCCESS_COLOR, icon = OK_ICON, title = 'Validaciones';
    if(invalidations && invalidations.lenght){
      if(detailed) {
        for(i=0;i<invalidations.lenght;i++){
          text += ' - ' + invalidations[i] + '\n';
        }
        refresh = 10;
      } else {
        text = invalidations.lenght + ' errores';
      }
      color = ERROR_COLOR;
      icon = ERROR_ICON;
      title = 'Errores';
    } else {
      text = 'Tarjeta completa';
    }
    return {
      title: title,
      text: text,
      icon: icon,
      color: color,
      refresh: refresh
    };
  });
};
var getIdBadge = function(){
  return {
    title: 'Número', // for detail badges only
    text: '',
    icon: ID_ICON, // for card front badges only
    color: null
  };
}; 

var getIdBadgeText = function(idPrefix, idStartNumber, idSuffix, cardId, card){
  if(!cardId){
    var badgeText = "";
    if(idPrefix) {
      badgeText += idPrefix;
    }
    var cardNumber = Number(idStartNumber) + card.idShort;
    badgeText += cardNumber.toString();
    if(idSuffix) {
      badgeText += idSuffix;
    } 
    cardId = badgeText;
  }
  return cardId;
};

var getBadges = function(t, card, detailed){
  var badges = [];
  return Promise.all([
    t.get('board', 'shared', 'pappira.idPrefix'),
    t.get('board', 'shared', 'pappira.idStartNumber', 0),
    t.get('board', 'shared', 'pappira.idSuffix'),
    t.get('board', 'shared', 'pappira.idEnabled', false),
    t.get('board', 'shared', 'pappira.idRemove', false),
    getPappiraCardId(t),
    getValidationBadge(t, card, detailed)
  ])
  .spread(function(idPrefix, idStartNumber, idSuffix, idEnabled, idRemove, cardId, validationBadge){
    if(idEnabled){
      var idBadge = getIdBadge();
      idBadge.text = getIdBadgeText(idPrefix, idStartNumber, idSuffix, cardId, card);
      if(idBadge.text !== cardId) {
        setPappiraCardId(t, idBadge.text);
        setTrelloCardName(t, card, idBadge.text + " - " + card.name);
      }
      badges.push(idBadge);
    } 
    if(idRemove){
      removePappiraCardId(t);
    }
    if(validationBadge){
      if(detailed){
        badges.push({
          dynamic: function(){
            return getValidationBadge(t, card, detailed);
          }
        });
      } else {
        badges.push(validationBadge);
      }
    }
    return badges;
  });
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  'card-badges': function(t, options){
    return t.card('all')
    .then(function (card) {
       return getBadges(t, card, false);
    });
  },
  'card-detail-badges': function(t, options) {
    return t.card('all')
    .then(function (card) {
       return getBadges(t, card, true);
    });
  },
  'card-from-url': function (t, options) {
    // options.url has the url in question
    // if we know cool things about that url we can give Trello a name and desc
    // to use when creating a card. Trello will also automatically add that url
    // as an attachment to the created card
    // As always you can return a Promise that resolves to the card details
    
    return new Promise(function (resolve) {
      resolve({
        name: '💻 ' + options.url + ' 🤔',
        desc: 'This Power-Up knows cool things about the attached url'
      });
    });
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  'show-settings': function(t, options){
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  },
  
  /*        
      
      🔑 Authorization Capabiltiies 🗝
      
      The following two capabilities should be used together to determine:
      1. whether a user is appropriately authorized
      2. what to do when a user isn't completely authorized
      
  */
  'authorization-status': function(t, options){
    // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
    // The boolean value determines whether your Power-Up considers the user to be authorized or not.
    
    // When the value is false, Trello will show the user an "Authorize Account" options when
    // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
    // below determines what should happen when the user clicks "Authorize Account"
    
    // For instance, if your Power-Up requires a token to be set for the member you could do the following:
    return isAuthorized(t);
    // You can also return the object synchronously if you know the answer synchronously.
  },
  'show-authorization': function(t, options){
    // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
    // which shows when 'authorization-status' returns { authorized: false }.
    
    // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
    // you'll need to add your API from trello.com/app-key below:
    let trelloAPIKey = '338a0019b5eb47ced79413a71191f169';
    // This key will be used to generate a token that you can pass along with the API key to Trello's
    // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.
    
    // In this case we'll open a popup to kick off the authorization flow.
    if (trelloAPIKey) {
      return t.popup({
        title: 'My Auth Popup',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});
