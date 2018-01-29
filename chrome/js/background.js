chrome.storage.local.set({'live' : false});
window.TwitchAlert = new TwitchAlert();

chrome.storage.local.get(['live'],function(res)
{
	setInterval(function(){
		TwitchAlert.isOnAir(function(isOnAir, context) {
			if (isOnAir && !res.live)
			{
				TwitchAlert.pushNotification(TwitchAlert.message, context.title);
				TwitchAlert.setIcon("on");
				res.live = true;
			}
			else if (!isOnAir)
			{
				TwitchAlert.setIcon("off");
				res.live = false;
			}
		});
	}, TwitchAlert.tickRate);
});