var isNotified = false;
window.TwitchAlert = new TwitchAlert();

setInterval(function(){
	TwitchAlert.isOnAir(updateStatus);
}, TwitchAlert.tickRate);

function updateStatus(isOnAir, context)
{
	if (isOnAir && !isNotified)
	{
		TwitchAlert.pushNotification(context.title, TwitchAlert.message);
		TwitchAlert.setIcon("on");
	}
	else if (!isOnAir)
	{
		TwitchAlert.setIcon("off");
	}

	if (isOnAir)
	{
		// Save data
	}

	isNotified = isOnAir;
}
