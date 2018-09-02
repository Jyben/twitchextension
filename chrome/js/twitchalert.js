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
	this.apiBotUrl = "https://twitchbot-api.azurewebsites.net/v1/";
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
			document.getElementById("imgGame").style.visibility = 'visible';
			document.getElementById("imgViewers").style.visibility = 'visible';
		}
		else {
			document.getElementById("imgGame").style.visibility = 'hidden';
			document.getElementById("imgViewers").style.visibility = 'hidden';
			document.getElementById("offline").textContent = "Sratuke n'est pas en live :-(";
		}
	});

	this.getRanking(function(users)
	{
		users.forEach((user) => {
			if (user.points > 0) {
				let rank = document.createElement("li");
				let text = document.createTextNode(user.name.concat(" - ").concat(user.points).concat(" points"));
				rank.appendChild(text);
				document.getElementById("ranking").appendChild(rank);
			}
		})
	});

	this.getNews(function(extension)
	{
		document.getElementById("newsName").textContent = extension.newsName;
		document.getElementById("newsText").textContent = extension.newsText;
	});
}

TwitchAlert.prototype.isOnAir = function(callback)
{
	let req = new XMLHttpRequest();
	let streamData = null;
	let channelData = null;

	req.onreadystatechange = function ()
	{
		if (req.readyState != 4 || req.status != 200)
		return;

		let data = JSON.parse(req.responseText);

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
}

TwitchAlert.prototype.getRanking = function(callback)
{
	let req = new XMLHttpRequest();

	req.onreadystatechange = function ()
	{
		if (req.readyState != 4 || req.status != 200)
		return;

		let users = JSON.parse(req.responseText);

		if (callback && typeof(callback) === "function")
		{
			callback(users);
		}
	}

	req.open("GET", this.apiBotUrl.concat("viewers"), true);
	req.send();
}

TwitchAlert.prototype.getNews = function(callback)
{
	let req = new XMLHttpRequest();

	req.onreadystatechange = function ()
	{
		if (req.readyState != 4 || req.status != 200)
		return;

		let extension = JSON.parse(req.responseText);

		if (callback && typeof(callback) === "function")
		{
			callback(extension[0]);
		}
	}

	req.open("GET", this.apiBotUrl.concat("extension").concat("/sratuke"), true);
	req.send();
}

TwitchAlert.prototype.search = function() {
	let input, filter, ul, li, a, i;

	input = document.getElementById("search");
	filter = input.value.toUpperCase();
	ol = document.getElementById("ranking");
	li = ol.getElementsByTagName("li");

	for (i = 0; i < li.length; i++) {
		a = li[i].innerHTML;
		
		if (a.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}
