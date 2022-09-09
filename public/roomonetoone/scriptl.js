const socket = io("/");
const myPeer = new Peer();
const peers = {};

let user1 = document.getElementsByClassName("user1")[0]
let user2 = document.getElementsByClassName("user2")[0]

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    user1.muted=true
    user1.srcObject= stream
    user1.play()
    myPeer.on("call" , (call)=>{
        call.answer(stream)
        call.on("stream" , (userStream)=>{
            user2.srcObject=userStream
            user2.play()
        })
    })
})