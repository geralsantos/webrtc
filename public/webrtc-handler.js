var socket = io.connect();

var initiateBtn = document.getElementById('initiateBtn');
var initiator = false;

initiateBtn.onclick = (e) => {
    initiator = true;
    socket.emit('initiate');
}
async  function geral(){
    try {
        await navigator.mediaDevices.getUserMedia({
            video: {
                mediaSource: "screen",
                width: { max: '1920' },
                height: { max: '1080' },
                frameRate: { max: '10' }
            }
        }).then(gotMedia)
        .catch(function(err){
            console.log(err)
        });
    } catch (error) {
        console.log(error)
    }
}
geral();
function gotMedia(stream) {
    var video = document.querySelector('video');

    if (initiator) {
        var peer = new Peer({
            initiator,
            stream,
            config: stunServerConfig
        });
    } else {
        var peer = new Peer({
            config: stunServerConfig
        });
    }
    peer.on('signal', function (data) {
        socket.emit('offer', JSON.stringify(data));
    });
    socket.on('offer', (data) => {
        peer.signal(JSON.parse(data))
    })
    peer.on('stream', function (stream) {  
        // got remote video stream, now let's show it in a video tag  
        var video = document.querySelector('video');  
        video.srcObject = stream;  
        video.play();  
      })

    video.srcObject = stream;
    video.play();
}