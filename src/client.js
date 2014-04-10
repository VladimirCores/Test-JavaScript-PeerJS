// uglifyjs peer.js -o peer.min.js -p 5 -c -m
// uglifyjs hammer.js -o hammer.min.js -p 5 -c -m

// http://peerjs.com/

(function(){
	var peer;
	var connection = {};
	
	// if (sessionStorage.getItem("is_reloaded")) {
	// 	peer = new Peer(sessionStorage.getItem("is_reloaded"), {key: 'vnfzjzv992euq5mi'});
	// 	peer.disconnect();
	// } else {
	peer = new Peer({host: 'http://peeril.herokuapp.com/', port: 80});
	// }

	function Handle_Peer_Open (id) {
		console.log('My peer ID is: ' + id);
	}

	function Handle_Peer_Connection (dataConnection) {
		connections.push(dataConnection);
		console.log(dataConnection); 
	}

	function Handle_Peer_Call (mediaConnection) {
		console.log(mediaConnection); 
	}

	function Handle_Connection_Open () {
		document.addEventListener("mousemove", Handle_MouseMove);
	}

	function Handle_Connection_Data (data) {
		console.log('Received', data);
	}

	function Handle_MouseMove (e) {
		console.log(e)
		connection.send({ x:e.x, y:e.y });
	}

	peer.on('open', Handle_Peer_Open);
	peer.on('connection', Handle_Peer_Connection);
	peer.on('call', Handle_Peer_Call);

	connection = peer.connect('mainnode');
	connection.on('data', Handle_Connection_Data);
	connection.on('open', Handle_Connection_Open);

})()