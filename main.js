'use strict';
$( document ).ready(init);

function init() {

    dealHands();
    // $('#searchform').keyup(searchCall);
    // $(document).on('click', '#delete-contact', removeContact);
    // $(document).on('click', '#save-new', addContact);
    // $('div.results').on('click', '.name', sortListName);
    // loadFromLocal(true);
}

var gameState = {
  turntoggle: true,
  dealerHand: {},
  playerHand: {}
};





// var $newDOMresults = [];
// for (var i = 0; i < arrtoshow.length; i++) {
//   var $newResult = $('#template').clone().removeAttr('id').addClass('results fadein');
//   $newResult.find('div.name').text(contactsArray[i].firstname+" "+contactsArray[i].lastname);
//   $newResult.find('#photo').attr('src', contactsArray[i].image);
//   $newResult.find('.company').text(contactsArray[i].company);
//   $newResult.find('.email').text(contactsArray[i].email);
//   $newResult.find('.phone').text(contactsArray[i].phone);
//   $newResult.find('.address').text(contactsArray[i].address);
//   $newResult.find('.group').text(contactsArray[i].group);
//   $newResult.on('click', '.name', sortListName);
//   $newResult.on('click', '.company', sortListCompany);
//   $newResult.on('click', '.email-addy', sortListEmail);
//   $newResult.on('click', '.phone', sortListPhone);
//   $newResult.on('click', '.address', sortListAddress);
//   $newResult.on('click', '.group', sortListGroup);
//
//   $newDOMresults.push($newResult);
// }
function updateHandDOM(isdeal){
  //update dealer hand display
  $('#dealerhand').children().remove();
  if (!isdeal) {
    var dealerCards = gameState.dealerHand.currentCards;
    for (var i = 0;i < dealerCards.length;i++){
      var domPosition = dealerCards[i].dompos;
      var $cardToAdd = $('#cards').children().eq(domPosition).clone();
      $('#dealerhand').append($cardToAdd);
    }
  }
  if (isdeal) {
    var dealerCards = gameState.dealerHand.currentCards;
    for (var i = 1;i < dealerCards.length;i++){
      var domPosition = dealerCards[i].dompos;
      var $cardToAdd = $('#cards').children().eq(domPosition).clone();
      $('#dealerhand').append($cardToAdd);
    }
    var $blankcard = $('#cards').children().eq(52).clone();
    $('#dealerhand').append($blankcard);
  }

  $('#playerhand').children().remove();
  var playerCards = gameState.playerHand.currentCards;
  for (var i = 0;i < playerCards.length;i++){
    var domPosition = playerCards[i].dompos;
    var $cardToAdd = $('#cards').children().eq(domPosition).clone();
    $('#playerhand').append($cardToAdd);
  }
}


function hasBusted(currentHand){
  //currentHand will be passed gameState.playerHand
  var aceValue = 0;
  var valsToSumArray = currentHand.currentCards;
  //debugger;
  // var valsToSum = valsToSumArray.map(function(card){
  //   return card.value;
  // })
  var valsToSum = [];
  for (var i = 0;i<valsToSumArray.length;i++){
    valsToSum.push(valsToSumArray[i].value)
  }

  var onlyNumVals = _.without(valsToSum, "A");
  if (onlyNumVals === []) { var handValueWithoutAces = _.sum(onlyNumVals);
  }else{
    handValueWithoutAces = 0;
  }
  var acesQuantity = Math.abs(valsToSum.length - onlyNumVals.length);
  console.log("is this a num?"+acesQuantity);

  if (acesQuantity > 0 && handValueWithoutAces+11 > 21){
    aceValue = 1;
  }else {
    aceValue == 11;
  }

  currentHand.currentScore = (aceValue * acesQuantity) + handValueWithoutAces;

  console.log("is this a num?"+currentHand.currentScore);
  // debugger;
  console.log("turn: "+gameState.turntoggle+" total hand: "+currentHand.currentScore+"  onlyNumVals: "+onlyNumVals+"  acesQuantity: "+acesQuantity);
  if (currentHand.currentScore > 21) {
    console.log("You've Busted!")
  }


  //console.log("total hand: "+totalHandValue+"onlyNumVals: "+onlyNumVals+"acesQuantity: "+acesQuantity);
}



function playHand(hitstaytoggle){
  // var playerHand = ;
  // var dealerHand = ;

  //if player ("true") turn and hitting
  if (gameState.turntoggle === true && hitstaytoggle === true){
    gameState.playerHand.currentCards.push(pullRandomCard(1));
    hasBusted(gameState.playerHand);
  }
  //if dealer score < 17 hitting
  for (;gameState.dealerHand.currentScore < 17;){
    console.log("is this running?");
    gameState.dealerHand.currentCards.push(pullRandomCard(1));
    hasBusted(gameState.dealerHand);
    console.log("turn: "+gameState.turntoggle+" total hand: "+gameState.dealerHand.currentScore+"cards : "+gameState.dealerHand.currentCards.length);

  }
  //toggle the turn to next player
  gameState.turntoggle = !gameState.turntoggle ;
  updateHandDOM();
}


function dealHands(){
  var dealerHand = gameState.dealerHand;
  var playerHand = gameState.playerHand;
  dealerHand.currentCards = pullRandomCard(2);
  dealerHand.currentScore = 0;
  playerHand.currentCards = pullRandomCard(2);
  playerHand.currentScore = 0;
  hasBusted(gameState.playerHand);
  hasBusted(gameState.dealerHand);
  updateHandDOM(true);
}


function pullRandomCard(numOfCards, isdeal) {
  //if the deck doesn't exist create it
  if (!gameState.deck){
    var cardTypeArray = ['two','three','four', 'five','six','seven','eight','nine','ten','jack','queen','king','ace'];
    var cardSuitesArray = ['clubs','diamonds','spades','hearts'];
    var buildDeckArray = [];

    for (var i = 0;i < cardSuitesArray.length;i++){
      var currentSuit = cardSuitesArray[i];
      for (var x = 0;x < cardTypeArray.length;x++) {
        //set card value
        var currentCardValue = 0;
        if (x < 9){
          currentCardValue = x+2;
        }
        else if (x >= 9 && x < 12) {
          currentCardValue = 10;
        }
        else {
          currentCardValue = "A";
        }
        var card = {
          name: cardTypeArray[x]+" of "+cardSuitesArray[i],
          value: currentCardValue
        };
        buildDeckArray.push(card);
      }
    }
    for (var i = 0;i < buildDeckArray.length ; i++){
      buildDeckArray[i].dompos = i;
    }
      gameState.deck = _.shuffle(buildDeckArray);
  }
  //take n number of cards off the top of the shuffled deck and return them
  if (numOfCards > 1 || isdeal) {
    return gameState.deck.splice(0,numOfCards);
  }
  else {
    return gameState.deck.splice(0,numOfCards)[0];
  }
}
