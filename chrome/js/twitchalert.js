var TwitchAlert = function()
{
	this.imgPath = "img/";
	this.iconStatusName = "line.png";
	this.status = null;
	this.message = "🔴 SRATUKE LIVE";
	this.apiTwitchUrl = "https://api.twitch.tv/kraken/streams/sratuke?client_id=nrnediurh6n5oiqqeyfimlfjfpcwb5";
	this.tickRate = 30000;
	this.viewers = 0;
	this.title = null;
	this.liveUrl = "http://twitch.com/sratuke";
}

TwitchAlert.prototype.updateExtensionPage = function()
{
	this.isOnAir(function(isOnAir, context) 
	{
		if (isOnAir) 
		{
			document.getElementById("title").textContent = context.title;
			document.getElementById("game").textContent = context.game;
			document.getElementById("viewers").textContent = context.viewers;
		}
		else {
			document.getElementById("body").textContent = "";
			document.getElementById("offline").textContent = "Sratuke n'est pas en live :-(";
		}
	});

}

TwitchAlert.prototype.isOnAir = function(callback)
{
	var req = new XMLHttpRequest();
	var streamData = null;
	var channelData = null;

	req.onreadystatechange = function ()
	{
		if (req.readyState != 4 || req.status != 200)
			return;

		var data = JSON.parse(req.responseText);
		if (callback && typeof(callback) === "function")
		{
			if (data["stream"] !== null) {
				streamData = data["stream"];
				channelData = streamData["channel"];
				this.viewers = streamData.viewers;
				this.game = streamData.game;
				this.title = channelData.status;
			}
			callback(data["stream"] !== null, this);
		}
	}

	req.open("GET", this.apiTwitchUrl, true);
	req.send();
}

TwitchAlert.prototype.setIcon = function(status)
{
	chrome.browserAction.setIcon({path:this.imgPath.concat(status).concat(this.iconStatusName)});
}

TwitchAlert.prototype.openTab = function(notificationId)
{
	chrome.tabs.create({
		url : this.liveUrl
	});
}

TwitchAlert.prototype.pushNotification = function(title, message)
{
	chrome.browserAction.setIcon({path:this.imgPath.concat("on").concat(this.iconStatusName)});
	chrome.notifications.create({
		type: "basic",
		iconUrl: this.imgPath.concat("on").concat(this.iconStatusName),
		title: title,
		message: message,
		isClickable: false
	});

	//chrome.notifications.onClicked.addListener(this.openTab);
}
