var isNotified = false;
window.TwitchAlert = new TwitchAlert();

setInterval(function(){
	TwitchAlert.isOnAir(function(isOnAir, context) {
		if (isOnAir && !isNotified)
		{
			TwitchAlert.pushNotification(context.title, TwitchAlert.message);
			TwitchAlert.setIcon("on");
		}
		else if (!isOnAir)
		{
			TwitchAlert.setIcon("off");
		}

		isNotified = isOnAir;
	});
}, TwitchAlert.tickRate);
