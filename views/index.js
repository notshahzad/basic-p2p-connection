var socket = io();
var peer;
function SendRoom() {
  room = document.getElementById("room").value;
  socket.emit("room", room);
}
socket.on("initiator", (initiator) => {
  if (initiator !== "roomfull") {
    peer = new SimplePeer({
      initiator: initiator[0],
      trickle: false,
    });
    if (!initiator[0]) {
      offer = JSON.stringify(initiator[1]);
      peer.signal(offer);
    }
    if (initiator[0]) {
      socket.on("answer", (sdp) => {
        peer.signal(sdp);
        socket.close();
      });
    }
    peer.on("signal", (sdp) => {
      socket.emit("sdp", { sdp, room });
      if (!initiator[0]) socket.close();
    });
    peer.on("data", (data) => console.log(data));
  } else alert("haha sucks to be you the room is already taken");
});
