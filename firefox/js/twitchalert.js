var TwitchAlert = function()
{
	this.imgPath = "img/";
	this.iconStatusName = "line.png";
	this.status = null;
	this.message = "Clique-ici pour rejoindre le live";
	this.apiTwitchUrl = "https://api.twitch.tv/kraken/streams/sardochelol?client_id=nrnediurh6n5oiqqeyfimlfjfpcwb5";
	this.tickRate = 5000;
	this.viewers = 0;
	this.title = null;
}

TwitchAlert.prototype.updateExtensionPage = function()
{
	this.isOnAir(function(isOnAir, context) {
		if (isOnAir) {
			document.getElementById("title").innerHTML = context.title;
			document.getElementById("game").innerHTML = context.game;
			document.getElementById("viewers").innerHTML = context.viewers;
		}
		else {
			document.getElementById("body").innerHTML = "";
			document.getElementById("offline").innerHTML = "Sratuke n'est pas en live :-("
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
	browser.browserAction.setIcon({path:this.imgPath.concat(status).concat(this.iconStatusName)});
}

TwitchAlert.prototype.openTab = function(notificationId)
{
	var liveUrl = "http://twitch.com/sratuke";

	browser.tabs.create({
		url : liveUrl
	});
}

TwitchAlert.prototype.pushNotification = function(title, message)
{
	browser.browserAction.setIcon({path:this.imgPath.concat("on").concat(this.iconStatusName)});
	browser.notifications.create({
		type: "basic",
		iconUrl: this.imgPath.concat("on").concat(this.iconStatusName),
		title: title,
		message: message,
		isClickable: true
	});

	browser.notifications.onClicked.addListener(this.openTab);
}
