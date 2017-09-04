var isNotified = false;
window.TwitchAlert = new TwitchAlert();

setInterval(function(){
	TwitchAlert.isOnAir(updateStatus);
}, TwitchAlert.tickRate);

function updateStatus(isOnAir)
{
	if (isOnAir && !isNotified)
	{
		TwitchAlert.pushNotification();
		TwitchAlert.setIcon("on");
	}
	else if (!isOnAir)
	{
		TwitchAlert.setIcon("off");
	}
		
	isNotified = isOnAir;
}