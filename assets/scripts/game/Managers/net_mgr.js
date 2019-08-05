var event_mgr       = require("event_mgr");
var proto_man       = require("proto_man");
var Cmd             = require("../ui_ctrls/node_modules/Cmd")
var cmd_name_map    = require("../ui_ctrls/node_modules/cmd_name_map")
var Stype           = require("../ui_ctrls/node_modules/Stype")
var event_name      = require("../ui_ctrls/node_modules/event_name")
var ConfigKeyWord   = require("ConfigKeyWord")

var State = {
    Disconnected: 0, // 断开连接
    Connecting: 1, // 正在连接
    Connected: 2, // 已经连接;
};

/*
WebSocket.CONNECTING = 0 // The connection is not yet open.
WebSocket.OPEN = 1 // The connection is open and ready to communicate.
WebSocket.CLOSING = 2 // The connection is in the process of closing.
WebSocket.CLOSED = 3 // The connection is closed or couldn't be opened.
*/

var W_STATE = {
    [0] : "CONNECTING",
    [1] : "OPEN",
    [2] : "CLOSING",
    [3] : "CLOSED",
}

var net_mgr = cc.Class({
    extends: cc.Component,

    statics: {
        Instance: null,
    },

    properties: {
        // url: "ws://192.168.2.130:6081/ws",
        url: "ws://" + ConfigKeyWord.remoteip + ":" + ConfigKeyWord.remoteport + "/ws",
        proto_type: 1, //0:json , 1:protobuf
    },

    onLoad () {
        if (net_mgr.Instance === null) {
            net_mgr.Instance = this;
        }
        else {
            this.destroy();
            cc.error("[error]:net_mgr has multi instances");
            return;
        }

        this.state = State.Disconnected;
    },

    _on_opened(event) {
        this.state = State.Connected;
        cc.log("connect to server: " + this.url + " sucess!");
        event_mgr.dispatch_event(event_name.net_connect);
    },

    _on_recv_data(event) {
        var str_or_buf = event.data;
        var msg_data = proto_man.decode_cmd(this.proto_type, str_or_buf);
        if (!msg_data) {
            return;
        }
        var cmd_name = cmd_name_map[msg_data.ctype];
        if (cmd_name){
            event_mgr.dispatch_event(cmd_name, msg_data.body);    
        }

        if(msg_data.ctype != Cmd.eHeartBeatRes){
            cc.log("###########################>>>start")
            console.log("hcc>>recv_data: " + "stype: " + Stype.name[msg_data.stype] + " ,ctype: " + cmd_name_map[msg_data.ctype]);
            if (msg_data.body){
                for(var key in msg_data.body){
                    var type = String(typeof(msg_data.body[key]))
                    if (type != "function" && type != "object"){
                        cc.log( key + ": " + msg_data.body[key])
                    }
                }
                cc.log("###########################>>>end")
            }
        }
    },

    close_socket(eventType) {
        if (this.state == State.Connected) {
            if (this.sock !== null) {
                this.sock.close();
                this.sock = null;
            }
            event_mgr.dispatch_event(event_name.net_disconnect, eventType);
        }
        
        this.state = State.Disconnected;
    },

    _on_socket_close(event) {
        this.close_socket(event.type);
    },

    _on_socket_err(event) {
        this.close_socket(event.type);
    },

    // 发起连接;
    connect_to_server() {
        if (this.state != State.Disconnected) {
            return;
        }

        this.state = State.Connecting;
        this.sock = new WebSocket(this.url); // H5标准，底层做好了;
        this.sock.binaryType = "arraybuffer";

        this.sock.onopen = this._on_opened.bind(this);
        this.sock.onmessage = this._on_recv_data.bind(this);
        this.sock.onclose = this._on_socket_close.bind(this);
        this.sock.onerror = this._on_socket_err.bind(this);

        event_mgr.dispatch_event(event_name.net_connecting, null);
    },

    start () {

    },

    send_msg(stype, ctype, msg) {
        if (this.state !== State.Connected || !this.sock) {
            return;
        }
        var buf = proto_man.encode_cmd(this.proto_type, stype, ctype, msg);
        this.sock.send(buf);
    },

    update (dt) {
        // cc.log("hcc>>readystate: " + this.sock.readyState + " ,state: " + W_STATE[this.sock.readyState])
        if (this.state != State.Disconnected) {
            return;
        }
        this.connect_to_server();
    },
});