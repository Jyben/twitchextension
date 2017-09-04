var TwitchAlert = function()
{
	this.imgPath = "img/";
	this.iconStatusName = "line.png";
	this.title = "Sratuke est en live !";
	this.message = "Clique-ici pour rejoindre le live";
	this.apiTwitchUrl = "https://api.twitch.tv/kraken/streams/lestream?client_id=nrnediurh6n5oiqqeyfimlfjfpcwb5";
	this.tickRate = 5000;
}

TwitchAlert.prototype.updateExtensionPage = function()
{
	var elm  = document.getElementById("info");

	if (this.isOnAir()) 
	{
		elm.style.color = "red";
		elm.innerHTML = "Sratuke n'est pas en live actuellement";
	}
	else 
	{
		elm.style.color = "green";
		elm.innerHTML = "Sratuke est en live !" ;
	}
}

TwitchAlert.prototype.isOnAir = function(callback) 
{
	var req = new XMLHttpRequest();
	
	req.onreadystatechange = function () 
	{
		if (req.readyState != 4 || req.status != 200)
            return;

		var data = JSON.parse(req.responseText);
		callback(data["stream"] !== null);
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
	var liveUrl = "http://twitch.com/sratuke";

	chrome.tabs.create({
		url : liveUrl
	});
}

TwitchAlert.prototype.pushNotification = function()
{
	chrome.browserAction.setIcon({path:this.imgPath.concat("on").concat(this.iconStatusName)});
	chrome.notifications.create({
		type: 'basic',
		iconUrl: this.imgPath.concat("on").concat(this.iconStatusName),
		title: this.title,
		message: this.message,
		isClickable: true
	});
	
	chrome.notifications.onClicked.addListener(this.openTab);
}