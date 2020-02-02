var socket = io.connect();
var Peer = require('simple-peer')
var initiateBtn = document.getElementById('initiateBtn');
var lookBtn = document.getElementById('lookBtn');
var video = document.querySelector('video');

var initiator = false;

initiateBtn.onclick = (e) => {
    initiator = true;
    geral();
    socket.emit('initiate');
}
lookBtn.onclick = (e) => {
    initiator = false;
    geral();
}/*
socket.on('consult_initiate', (response) => {
    alert(initiator)
    if (!initiator) {
        geral();
    }
    
});*/
 function geral(){
    try {
        var constraints = {
            audio: true, video:  {
                mediaSource: "screen",
                width: { max: '1920' },
                height: { max: '1080' },
                frameRate: { max: '10' }
            }
          };
          if (initiator) {
            navigator.getUserMedia_ = navigator.mediaDevices.getDisplayMedia(constraints)
      
          }else{
              console.log("usuarios")
            navigator.getUserMedia_ = navigator.mediaDevices.getUserMedia({audio: true})
          }
          navigator.getUserMedia_.then((stream)=>gotMedia(stream))
        .catch(function(err){
            console.log(err)
        });
    } catch (error) {
        console.log(error)
    }
}

const stunServerConfig = {  
    iceServers: [{  
      url: "stun:stun01.sipphone.com",  
      username: "gera",  
      credential: "123"  
    }]  
  };
function gotMedia(stream) {
    var peer = null;
    console.log("gotMedia initiator",initiator)
    if (initiator) {
        peer = new Peer({
            initiator:initiator,
            stream,
           // config: stunServerConfig
        });
    } else {
        peer = new Peer({
            trickle: false,
            //config: stunServerConfig
        });
    }
    if (!initiator) {
        socket.emit('traer_token');
        console.log('traer_token')

        socket.on('mostrar_token', (data) => {
            console.log('mostrar_token',data)
            peer.signal(JSON.parse(data))
        })
    }
    peer.on('signal', function (data) {
console.log("signal")
        socket.emit('offer', JSON.stringify(data));
    });
    socket.on('offer', (data) => {
        console.log(data)
        peer.signal(JSON.parse(data))
    })
    peer.on('stream', function (stream) {  
        // got remote video stream, now let's show it in a video tag  
        console.log("geral")
        var video = document.querySelector('video');  
        if ('srcObject' in video) {
            video.srcObject = stream
          } else {
            video.src = window.URL.createObjectURL(stream) // for older browsers
          }
        video.play();  
      })

   /* video.srcObject = stream;
    video.play();*/
}