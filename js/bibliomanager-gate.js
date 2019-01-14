var Promise = TrelloPowerUp.Promise;
var bibliomanagerGateHost = "https://bibliomanager-gate.lad.uy/api";

var getCardStatus = function(cardId) {
  return Promise.resolve(
    $.get(bibliomanagerGateHost + "/trello/card/" + cardId + "/status")
  );
};

var getLadStatusBadge = function(cardId) {
  return getCardStatus(cardId)
    .then(function(cardStatus) {
      t.set('card', 'shared', 'pappira.bmgStatus', cardStatus);
      return {
        title: "Estado BMG",
        text: cardStatus,
        refresh: 60
      };
    })
    .catch(function(error) {
      console.error(error);
    });
};
