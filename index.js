var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var simple_prefs = require("sdk/simple-prefs");
const {Cc,Ci} = require("chrome");
var contextMenu = require("sdk/context-menu");

function play_video(url) {
    var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
    file.initWithPath(simple_prefs.prefs.player);

    var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
    process.init(file);

    var args = simple_prefs.prefs.params.split(" ")
    args.push(url)

    process.runAsync(args, args.length);
}

function play_current_url() {
    play_video(tabs.activeTab.url);
}

var linkMenuItem = contextMenu.Item({
    label: "Watch with MPV",
    context: contextMenu.SelectorContext("[href]"),
    contentScript: 'self.on("click", function(node,data){self.postMessage(node.href);})',
    accessKey: "e",
    image: data.url("icon_button.png"),
    onMessage: function (url) {
        play_video(url);
    }
});

var pageMenuItem = contextMenu.Item({
    label: "Watch with MPV",
    context: contextMenu.PageContext()
    contentScript: 'self.on("click", function(node,data){self.postMessage();})',
    accessKey: "e",
    image: data.url("icon_button.png"),
    onMessage: play_current_url
});

var action_button = ui.ActionButton({
    id: "my-button",
    label: "Play with MPV",
    icon: data.url("icon_button.png"),
    onClick: play_current_url
});
