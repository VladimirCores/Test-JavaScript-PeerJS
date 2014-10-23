// uglifyjs peer.js -o peer.min.js -p 5 -c -m
// uglifyjs hammer.js -o hammer.min.js -p 5 -c -m

// http://peerjs.com/

(function(){
	var peer;
	var initTime = 0;
	var startTime = 0;
	var deltaTime = 0;
	var localTime = 0;
	var cmConnection = {};
	var mcConnection;
	var stream;
	var systemtime;
	
	// if (sessionStorage.getItem("is_reloaded")) {
	// 	peer = new Peer(sessionStorage.getItem("is_reloaded"), {key: 'vnfzjzv992euq5mi'});
	// 	peer.disconnect();
	// } else {
	// peer = new Peer({host: 'http://peeril.herokuapp.com/', port: 80});
	// peer = new Peer({key: 'vnfzjzv992euq5mi'});
	peer = new Peer({ host: 'localhost', port: 9000 });
	// }

	function Handle_Peer_Open (id) {
		console.log('CLIENT OPEN, ID: ' + id);
	}

	function Handle_Peer_Connection (dataConnection) {
		// console.log("Handle_Peer_Connection");
		if(!mcConnection) {
			mcConnection = dataConnection;
			mcConnection.on('data', function(data) { 
				if(deltaTime == 0) {
					deltaTime = Date.now() - initTime;
					// console.log("Delta Time: ", deltaTime);
					// console.log("Input Time: ", data);
					systemtime = parseInt(data) + deltaTime * 0.50
					startTime = Date.now();
					// console.log("Init Time: " + initTime);
					// systemtime.setTime((parseInt(data) + deltaTime * 0.50));
					// console.log("System Time: ", systemtime.getTime());
				} else {
					// console.log("\nInput Time: ", data);
					var now = systemtime + (Date.now() - startTime);
					var delta = now - parseInt(data);
					// console.log("Delta Time: ", delta);
					var shootTime = 5000 - delta;
					// console.log("Shoot Time: ", shootTime);
					responceTime.innerText = (now - 1413466000000) + " | " + delta + " || " + shootTime;
					setTimeout(function () {
						cmConnection.send(shootTime);
					}, shootTime)
				}
			});
		}
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

	function Handle_Connection_Error (error) {
		console.log('Error Connection', error);
	}

	function Handle_MouseMove (e) {
		if(cmConnection.open)
		cmConnection.send({ x:e.x, y:e.y });
	}

	peer.on('open', Handle_Peer_Open);
	peer.on('connection', Handle_Peer_Connection);
	peer.on('call', Handle_Peer_Call);

	initTime = Date.now();
	responceTime.innerText = initTime;

	cmConnection = peer.connect('mainnode');
	cmConnection.on('data', Handle_Connection_Data);
	cmConnection.on('open', Handle_Connection_Open);
	cmConnection.on('error', Handle_Connection_Error);

})()