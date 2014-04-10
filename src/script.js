// uglifyjs peer.js -o peer.min.js -p 5 -c -m
// uglifyjs hammer.js -o hammer.min.js -p 5 -c -m

// http://peerjs.com/

(function(){
	var RADIUS = 15;

	var peer = new Peer("mainnode", { host: 'http://peeril.herokuapp.com', port: 80 });
	var connections = {};
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
		console.log('My peer ID is: ' + id);
	}

	function Handle_Peer_Connection (dataConnection) {
		console.log("Connection", dataConnection); 
		
		connections[dataConnection.peer] = dataConnection;

		var object = new Kinetic.Circle({
	        radius: RADIUS,
			fill: Utils_GetRandomColor(),
			stroke: 'black',
			strokeWidth: 1,
			x: window.innerWidth * 0.5,
			y: window.innerHeight * 0.5
		});
		objects[dataConnection.peer] = object;
		
		layer.add(object);
		dataConnection.on("data", function (data) {
			object.setPosition(data.x, data.y);
		});
		dataConnection.on("close", function () {
			console.log("Disconnect", dataConnection.peer); 
			layer.remove(objects[dataConnection.peer]);
			objects[dataConnection.peer] = null;
			delete objects[dataConnection.peer];
			dataConnection = null;
		});
		dataConnection.send("Connected");
	}

	function Handle_Peer_Call (mediaConnection) {
		console.log("Call", mediaConnection); 
	}

	function Handle_Peer_Data (data) {
		console.log("Recieve", data); 
	}

	peer.on('open', Handle_Peer_Open);
	peer.on('connection', Handle_Peer_Connection);
	peer.on('call', Handle_Peer_Call);
	peer.on('data', Handle_Peer_Data);


	function Utils_GetRandomColor () {
		return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	}

})()