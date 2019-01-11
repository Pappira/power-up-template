var Promise = TrelloPowerUp.Promise;
var bibliomanagerGateHost = "https://bibliomanager-gate.lad.uy/api";

var getCardStatus = function(cardId) {
  return new Promise(function(resolve,reject) {
    $.ajax({
      type: "GET",
      url:
        bibliomanagerGateHost + "/trello/card/5c389be96404ec44a8367438/status",
      success: function(result) {
        return resolve(result);
      },
      error: function(result) {
        //handle the error
        console.log(result);
        return reject();
      }
    });
    resolve({
      name: "💻 " + options.url + " 🤔",
      desc: "This Power-Up knows cool things about the attached url"
    });
  });
};
