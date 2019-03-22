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

  var addCheckListToCard = function(t,currentCheckList,checkListItems){
    return isAuthorized(t).then(function(authorized){
      if(authorized.authorized){
        return Trello.post("/checklists", currentCheckList, function(checklist) {
          // Add items
          var trelloCheckList = [];
          for (var i = 0; i < checkListItems.length;i++){
            trelloCheckList.push(Trello.post("checklists/" + checklist.id + '/checkItems', checkListItems[i]));
          }
          TrelloPowerUp.Promise.all(trelloCheckList);
          });
      }
    });
  };

  var addCheckListItemToCheckList = function(t,checkListItem,checkListId){
    return isAuthorized(t).then(function(authorized){
      if(authorized.authorized){
        return Trello.post("/checklists/" + checkListId +"/checkItems",checkListItem);
      }
    });
  };