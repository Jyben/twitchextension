window.TwitchAlert = new TwitchAlert();

TwitchAlert.updateExtensionPage();

document.getElementById("search").addEventListener("keyup", TwitchAlert.search);
