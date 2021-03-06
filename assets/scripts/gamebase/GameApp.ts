import SceneManager from '../framework/manager/SceneManager';
import HotFixScene from './scene/hotfixScene/HotFixScene';
import EventManager from '../framework/manager/EventManager';
import EventDefine from '../framework/config/EventDefine';
import NetWork from '../framework/network/NetWork';
import DialogManager from '../framework/manager/DialogManager';
import PlatForm from '../framework/config/PlatForm';
import UIController from '../framework/uibase/UIController';
import WeChatLogin from '../framework/utils/WeChatLogin';
import RoomData from './common/RoomData';
import CommonDialog from './dialog/CommonDialog';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameApp extends UIController {

    //onload >> start
    onLoad () {
        super.onLoad()
    }

    start () {
        super.start();
        this.add_script("EnablePhysics");//开启物理引擎
        cc.debug.setDisplayStats(false);
        PlatForm.printPlatForm();

        WeChatLogin.on_wx_foreground(function (qData: any) {
            console.log("hcc>>on_wx_foreground>>LoginSceneShowUI>>  roomid: ", qData.roomid);
            let roomid_tmp = qData.roomid;
            if (qData.roomid == undefined || qData.roomid == null || qData.roomid == "") {
                roomid_tmp = ""
            }
            RoomData.getInstance().set_share_roomid(roomid_tmp);
        });

        SceneManager.getInstance().enter_scene_asyc(new HotFixScene());
        this.test_func()
    }

    add_event_dispatcher(){
        EventManager.on(EventDefine.EVENT_NET_CONNECTED, this, this.on_net_connected.bind(this));
        EventManager.on(EventDefine.EVENT_NET_CLOSED, this, this.on_net_closed.bind(this));
        EventManager.on(EventDefine.EVENT_NET_ERROR, this, this.on_net_error.bind(this));
    }

    on_net_connected(event:cc.Event.EventCustom){
        DialogManager.getInstance().show_weak_hint("网络连接成功!");
    }

    async on_net_closed(event:cc.Event.EventCustom){
        this.show_net_close_tip();
    }

    on_net_error(event:cc.Event.EventCustom){
        this.show_net_close_tip();
    }

    show_net_close_tip(){
        let commondialog = DialogManager.getInstance().get_dialog("CommonDialog");
        if (commondialog && cc.isValid(commondialog)){
            DialogManager.getInstance().close_dialog("CommonDialog");
        }
        let resNode: cc.Node = DialogManager.getInstance().show_common_dialog();
        if (resNode) {
            let script: CommonDialog = resNode.getComponent("CommonDialog");
            if (script) {
                script.set_content_text("网络已断开，请重连!");
                script.set_btn_callback(
                    function () { NetWork.getInstance().reconnect(); },
                    function () {},
                    function () { NetWork.getInstance().reconnect(); },
                )
            }
        }
    }

    //test
    test_func() {
        /*
        this.node.convertToNodeSpaceAR(cc.v2(100,100)); //将世界坐标ccv2(100,100)转换成node下的节点坐标系  
        this.node.convertToWorldSpaceAR(cc.v2(100,100)); // 将节点坐标系node下的一个点cc.v2(100,100)转换到世界空间坐标系。
        */
    }

}