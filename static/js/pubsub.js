// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
  var ws_scheme = "wss://";
} else {
  var ws_scheme = "ws://"
};

var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

inbox.onmessage = function(message) {
  var data = JSON.parse(message.data);
  console.log("onmessage", data)
  $("#chat-text").append("<div >" + $('<span/>').text(data.handle).html() + ": " + $('<span/>').text(data.text).html() + "</div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);
};

inbox.onclose = function() {
  console.log('inbox reconnecting...');
};

outbox.onclose = function() {
  console.log('outbox reconnecting...');
};


$("#input-form-chat").on("submit", function(event) {
    event.preventDefault();
    var handle = $("#input-handle")[0].value;
    var text = $("#input-text")[0].value;
    outbox.send(JSON.stringify({
        handle: handle,
        text: text
    }));
    $("#input-text")[0].value = "";
});