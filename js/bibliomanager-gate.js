var Promise = TrelloPowerUp.Promise;
var bibliomanagerGateHost = "https://bibliomanager-gate.lad.uy/api";

var getCardStatus = function(cardId) {
  return Promise.resolve(
    $.get(
      bibliomanagerGateHost + "/trello/card/5c389be96404ec44a8367438/status"
    )
  );
};
