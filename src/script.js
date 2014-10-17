// uglifyjs peer.js -o peer.min.js -p 5 -c -m
// uglifyjs hammer.js -o hammer.min.js -p 5 -c -m

// http://peerjs.com/

(function(){
	var RADIUS = 15;
	var peerID = "mainnode";
	// var peer = new Peer(peerID, { host: 'http://peeril.herokuapp.com', port: 80 });
	var peer = new Peer(peerID, { host: 'localhost', port: 9000 });
	// var peer = new Peer(peerID, {key: 'vnfzjzv992euq5mi'});
	var connections = {};
	var connectionsArr = [];
	var objects = {};

	var stage = new Kinetic.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight
    });
	var layer = new Kinetic.Layer({clearBeforeDraw:false});
	stage.add(layer);
	
	var anim = new Kinetic.Animation(function(frame){ layer.batchDraw(); })
	anim.start();

	function Handle_Peer_Open (id) {
		console.log('MAIN peer ID is: ' + id);
	}

	function Handle_Peer_Connection (dataConnection) {
		var peerConnectedID = dataConnection.peer;
		var returnConnection = peer.connect(peerConnectedID);
		returnConnection.on('open', function () {
			console.log("OPEN");
			returnConnection.send(Date.now());
		});
		console.log("Connection", peerConnectedID); 
		console.log("returnConnection", returnConnection); 

		connections[peerConnectedID] = returnConnection;
		connectionsArr.push(returnConnection);

		AddDrawLayer(peerConnectedID);
		
		dataConnection.on("data", function (data) { 
			if(typeof data == "object") 
			objects[peerConnectedID].setPosition(data.x, data.y); 
			else console.log(data);
		});
		dataConnection.on("close", function () {
			console.log("Disconnect", peerConnected); 
			layer.remove(objects[peerConnectedID]);
			objects[peerConnectedID] = null;
			delete objects[peerConnectedID];
			dataConnection = null;
			peerConnected = null;
			peerConnectedID = null;
		});
		
	}

	function Handle_Peer_Call (mediaConnection) {
		console.log("Call", mediaConnection); 
	}

	function Handle_Peer_Data (data) {
		console.log("Recieve", data); 
	}

	function Handle_KeyPressed (event) {
		var key = parseInt(event.keyCode || event.which);
  		var keychar = String.fromCharCode(key);
  		if(key === 32) {
  			SendSync();
  		}
	}

	function Handle_SendClick (argument) {
		SendSync();
	}

	function AddDrawLayer(id) {
		var object = new Kinetic.Circle({
	       radius: RADIUS,
			fill: Utils_GetRandomColor(),
			stroke: 'black',
			strokeWidth: 1,
			x: window.innerWidth * 0.5,
			y: window.innerHeight * 0.5
		});
		layer.add(object);
		objects[id] = object;
	}

	function SendSync() {
		console.log("Send Sync")
		var connection;
		var connectionID = "";
		var now = Date.now();
		for(connectionID in connections) {
			connection = connections[connectionID];
			// console.log("conntection:", connectionID, connection);
			connection.send(now);
		};
		// for (var i = connectionsArr.length - 1; i >= 0; i--) {
		// 	connection = connectionsArr[i];
		// 	connection.send("Sync");
		// };
	}

	peer.on('open', Handle_Peer_Open);
	peer.on('connection', Handle_Peer_Connection);
	peer.on('call', Handle_Peer_Call);
	peer.on('data', Handle_Peer_Data);

	window.addEventListener("keypress", Handle_KeyPressed)
	// btnSend.addEventListener("click", Handle_SendClick)

	function Utils_GetRandomColor () {
		return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	}

})()