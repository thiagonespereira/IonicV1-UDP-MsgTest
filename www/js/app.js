// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

.controller('PlaylistsCtrl', function($scope, $ionicPopup, $timeout) {
  $scope.data = {}
  
  // Triggered on a button click, or some other target
  $scope.showPopup = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Just a test!',
      template: 'Just calling a function and printing in the console.'
    });
    alertPopup.then(function(res) {
      console.log('This is what I printed in the console.');
    });
  };

  $scope.sendMessages = function(){
    prepareAndSendMessages($ionicPopup);
  }
})

// var chrome = cordova.require();

function prepareAndSendMessages($ionicPopup){
  var alertPopup = $ionicPopup.alert({
    title: 'UDP Messages',
    template: 'Sending UDP messages to server...'
  });

  console.log(chrome);
  

  connect();
}

function hexString(value) {
  return (0..toString(16) + parseInt(value).toString(16)).substr(-2);
}

function hexString256p(value) {
  return (0..toString(16) + parseInt(value).toString(16)).substr(-4);
}

function a2hex(str) {
  var arr = [];
  for (var i = 0, l = str.length; i < l; i++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
}

function toByteArray(hexString) {
  var result = [];
  while (hexString.length >= 2) {
    result.push(parseInt(hexString.substring(0, 2), 16));
    hexString = hexString.substring(2, hexString.length);
  }
  return result;
}

function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str[i];
  }
  return buf;
}

async function connect() {

  let splitAddressIp = [];
  let addressTRB = '10.100.228.232';
  let portTRB = 4011;
  let addressIP = '10.100.229.82'; //address mobile
  let portIP = 4011;
  let radioId = 8888;
  let message = '';
  let mensagemTexto = 'Mensagem de teste 1234.';

  // console.log('Server Address: ' + addressTRB + ' Port: ' + portTRB);
  // console.log('My Address: ' + addressIP + ' My Port: ' + portIP);
  

  splitAddressIp = addressIP.split('.');

  // console.log(splitAddressIp);
  

  for (const partIp of splitAddressIp) {
    message += hexString(partIp);
  }

  
  var hash = (+ new Date()).toString();
  
  message += hexString256p(portIP) + 'aabb';
  
  // console.log(message);

  var splitMessage = JSON.stringify(mensagemTexto).match(/.{1,450}/g);
  var msgToSend = [];
  for (var i = 0; i < splitMessage.length; i++) {
    var txtJson = {
      radioId: radioId,
      hash: hash,
      parte: ("000" + (i + 1)).slice(-4) + "/" + ("000" + splitMessage.length).slice(-4),
      message: splitMessage[i]
    };

// console.log(txtJson);


    msgToSend.push(message + a2hex(JSON.stringify(txtJson)));

    // var paraBanco = {
    // 	dadoHex: this.message + this.a2hex(JSON.stringify(txtJson)),
    // 	hash: hash,
    // 	parte: ("000" + (i + 1)).slice(-4) + "/" + ("000" + splitMessage.length).slice(-4),
    // 	status: 'enviando'
    // }

    // //this.banco.push(paraBanco);
    // this.shareService.data.push(paraBanco);

  }

  // console.log(msgToSend);
  
  //this.shareService.setData(this.banco);
  for (const [index, value] of msgToSend.entries()) {
    ////////// bolar metodo de mandar 10 a cada 10s
    var messageUDP = toByteArray(value);
    // console.log(value);
    sendUDPMessage(messageUDP, portTRB, addressTRB, 20000, 20000);
    
    if(index%10==0){
      await timeout(5*1000);
    }
  }

}

function hex2a(hexx) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}


async function sendUDPMessage(message, portTRB, addressTRB, ttl, timetolisten) {

  // debug;
  

  // only do udp stuff if there is plugin defined
  if (typeof chrome.sockets !== 'undefined') {
    console.log("HERE");
    
    // register the listeners
    chrome.sockets.udp.onReceive.addListener(
      (info) => {

        // +++++++++++++++++++++++++++++++++++++++
        // TODO: FUNC
        // +++++++++++++++++++++++++++++++++++++++

        //String.fromCharCode.apply(null,new Uint8Array(info.data))
        // we have found one
        // console.log(String.fromCharCode.apply(null, new Uint8Array(info.data)));
        var res = String.fromCharCode.apply(null, new Uint8Array(info.data));
        var splitRes;
        var receivedResponse;

        receivedMSG = res;
        
        
        // if (this.DEBUG) {
          splitRes = res.split('0d0a');
          receivedResponse = JSON.parse(hex2a(splitRes[1]));
        // } else {
          // splitRes = res;
          // receivedResponse = JSON.parse(this.hex2a(splitRes));
        // }

        console.log(receivedResponse);
        
        // this.shareService.data.filter((reccord) => {
        //   if ((reccord.hash == receivedResponse.hash) &&
        //     (reccord.parte == receivedResponse.parte)) {
        //     reccord.status = 'confirmed';
        //   }
        // })

        //this.presentAlert(this.hex2a(splitRes[1]));
        // udpstream.next(info);
      }
    );

    chrome.sockets.udp.onReceiveError.addListener(
      (error) => {
        console.log('Recv  ERROR from socket: ', error);
        // this.udpstream.next({ 'error': error });
      }
    );

    // translate the string into ArrayBuffer
    let SENDBUFFER = str2ab(message);


    // send  the UDP search as captures in UPNPSTRING and to port PORT
    chrome.sockets.udp.create((createInfo) => {
      chrome.sockets.udp.bind(createInfo.socketId, addressTRB, portTRB, (bindresult) => { //'0.0.0.0', port,
        socketid = createInfo.socketId;

        chrome.sockets.udp.setMulticastTimeToLive(createInfo.socketId, ttl, (ttlresult) => {

          chrome.sockets.udp.setBroadcast(createInfo.socketId, true, function (sbresult) {

            // do all adresses 
            chrome.sockets.udp.send(createInfo.socketId, SENDBUFFER, addressTRB, portTRB, (sendresult) => {
              if (sendresult < 0) {
                console.log('send fail: ' + sendresult);
                // this.udpstream.next({ 'error': sendresult });
              } else {
                console.log('sendTo: success ' + portTRB, createInfo, bindresult, ttlresult, sbresult, sendresult);
              }
            });

          });
        });
      });
    });

    // and close the listener after a while
    setTimeout(() => {
      closeUDPService();
    }, timetolisten);
  }
  // return the stream
  // return await this.udpstream.asObservable().skip(1);

}

function closeUDPService() {
  // close the socket
  if (typeof chrome.sockets !== 'undefined') chrome.sockets.udp.close(socketid);

  // close the stream
  // this.udpstream.complete();
}