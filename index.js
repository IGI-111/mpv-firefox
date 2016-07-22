var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var simple_prefs = require("sdk/simple-prefs");
var child_process = require("sdk/system/child_process");
var system = require("sdk/system");
var contextMenu = require("sdk/context-menu");

function play_video(url) {
    let args = [];
    if(simple_prefs.prefs.params !== ''){
        args = simple_prefs.prefs.params.split(" ");
    }

    args.push(url);

    let ls = child_process.spawn(simple_prefs.prefs.player, args, {
        shell: true,
        env: { DISPLAY: system.env.DISPLAY, XAUTHORITY: system.env.XAUTHORITY }
    });

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
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
    label: "Watch page with MPV",
    context: contextMenu.PageContext(),
    contentScript: 'self.on("click", function(node,data){self.postMessage();})',
    accessKey: "e",
    image: data.url("icon_button.png"),
    onMessage: play_current_url
});

var action_button = ui.ActionButton({
    id: "mpv-firefox",
    label: "Play with MPV",
    icon: data.url("icon_button.png"),
    onClick: play_current_url
});
