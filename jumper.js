/*
 * Jumping is fun. Riding pigs is even funnier!
 *
 * Learn how to make your bot interactive with this example.
 *
 * This bot can move, jump, ride vehicles, attack nearby entities and much more.
 */
var mineflayer = require('mineflayer');

if(process.argv.length < 4 || process.argv.length > 6) {
	console.log('Usage : node jumper.js <host> <port> [<name>] [<password>]');
	process.exit(1);
}

var bot = mineflayer.createBot({
	host: 'localhost',//process.argv[2],
	port: 52148,//parseInt(process.argv[3]),
	username: 'jumper',
	// password: process.argv[5],
	verbose: true,
});

var target = null;

bot.on('chat', function(username, message) {
	if(username === bot.username) return;
	target = bot.players[username].entity;
	var entity;
	switch(message) {
		case 'forward':
			bot.setControlState('forward', true);
			break;
		case 'back':
			bot.setControlState('back', true);
			break;
		case 'left':
			bot.setControlState('left', true);
			break;
		case 'right':
			bot.setControlState('right', true);
			break;
		case 'sprint':
			bot.setControlState('sprint', true);
			break;
		case 'stop':
			bot.clearControlStates();
			break;
		case 'jump':
			bot.setControlState('jump', true);
			bot.setControlState('jump', false);
			break;
		case 'jump a lot':
			bot.setControlState('jump', true);
			break;
		case 'stop jumping':
			bot.setControlState('jump', false);
			break;
		// case 'attack':
		// 	entity = mountToNearestEntity();
		// 	if(entity) {
		// 		bot.attack(entity, true);
		// 	} else {
		// 		bot.chat('no nearby entities');
		// 	}
		// 	break;
		case 'mount':
			mountToNearestEntity();
			// if(entity) {
			// 	try {
			// 		bot.mount(entity);
			// 	}
			// 	catch(e) {
			// 		bot.chat('Error!');
			// 		console.error(e);
			// 	}
			// } else {
			// 	bot.chat('no nearby objects');
			// }
			break;
		case 'dismount':
			bot.dismount();
			break;
		case 'stop vehicle':
			bot.moveVehicle(0.0, 0.0);
			break;
		case 'move vehicle forward':
			bot.moveVehicle(0.0, 1.0);
			break;
		case 'move vehicle backward':
			bot.moveVehicle(0.0, -1.0);
			break;
		case 'move vehicle left':
			bot.moveVehicle(1.0, 0.0);
			break;
		case 'move vehicle right':
			bot.moveVehicle(-1.0, 0.0);
			break;
		case 'tp':
			bot.entity.position.y += 10;
			break;
		case 'pos':
			bot.chat(bot.entity.position.toString());
			break;
		case 'yp':
			bot.chat('Yaw ' + bot.entity.yaw + ', pitch: ' + bot.entity.pitch);
			break;
		default:
			bot.chat('What? '+ message + '?');
	}
});

bot.once('spawn', function() {
	// keep your eyes on the target, so creepy!
	// setInterval(watchTarget, 50);

	function watchTarget() {
		if(!target) return;
		bot.lookAt(target.position.offset(0, target.height, 0));
	}
});

bot.on('mount', function() {
	bot.chat('mounted ' + bot.vehicle.objectType);
});

bot.on('dismount', function(vehicle) {
	bot.chat('dismounted ' + vehicle.objectType);
});

var minimalDistance = 2;

function mountToNearestEntity() {
	var id, entity, dist;
	var best = null;
	var bestDistance = null;
	for(id in bot.entities) {
		entity = bot.entities[id];
		// if ( entity.type === 'player' ) {
			// console.log('Found entity', entity.type, entity.displayName || entity.username);//, entity);
		// }
		if ( entity === bot.entity ) continue;
		// if ( ( /*entity.type === 'mob' &&*/ entity.displayName === 'Horse' )
		//   || ( /*entity.type === 'object' &&*/ entity.displayName === 'Minecart' )
		//   ) {
		if ( entity.displayName === 'Horse' || entity.displayName === 'Minecart' ) {
			dist = bot.entity.position.distanceTo(entity.position);
			console.log('Нашли объект', entity.type, entity.displayName || entity.username, dist);//entity);
			if(!best || dist < bestDistance) {
				best = entity;
				bestDistance = dist;
			}
		}
	}
	if (best) {
		bot.chat('Усаживаемся на ' + best.displayName || best.username + '...');
		bot.lookAt(best.position.offset(0, best.height, 0));
		bot.setControlState('forward', true);
		var goingTimer = setInterval(function(){
			var distance = bot.entity.position.distanceTo(best.position);
			// console.log('Расстояние', distance);
			bot.chat('Расстояние: ' + distance.toFixed(1));
			if ( distance <= minimalDistance ) {
				bot.clearControlStates();
				bot.mount(best);
				bot.chat('Уселись!');
				clearTimeout(goingTimer);
			}
			else {
				bot.lookAt(best.position.offset(0, best.height, 0));
				bot.chat('Идём...')
			}
		}, 200);
	}
	else {
		bot.chat('Не найден объект для усаживания!');
	}
	// return best;
}
