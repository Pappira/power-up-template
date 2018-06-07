"use strict";
var Promise = TrelloPowerUp.Promise;

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
  var updateTrelloCard = function(t, card, success, error){
    return isAuthorized(t).then(function(authorized){
      if(authorized.authorized){
        return Trello.put("/cards/"+card.id, card, success, error);
      }
    });
  };
  var getTrelloCard = function(t, cardId){
    return isAuthorized(t).then(function(authorized){
      if(authorized.authorized){
        return Trello.get("/cards/"+cardId,{fields: "name,desc,idChecklists,dateLastActivity",checklists: "all"}, function(theCard){return theCard;});
      }
    });
  };
  var createNewTrelloCard = function(t, card, success, error){
    return isAuthorized(t).then(function(authorized){
      if(authorized.authorized){
        return Trello.post("/cards/",card, success, error);
      }
    });
  };