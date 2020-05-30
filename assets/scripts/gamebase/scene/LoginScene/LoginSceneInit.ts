import UIController from '../../../framework/uibase/UIController';
import Storage from '../../../framework/utils/Storage';
import LSDefine from '../../../framework/config/LSDefine';
import PlatForm from '../../../framework/config/PlatForm';

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginSceneInit extends UIController {

    onLoad() {
        super.onLoad()
    }

    start () {
        super.start();
        this.initUI();
    }

    initUI(){

        let loginMsg = Storage.get(LSDefine.USER_LOGIN_MSG)
        let loginType = Storage.get(LSDefine.USER_LOGIN_TYPE)
        if(loginType == LSDefine.LOGIN_TYPE_GUEST){
            console.log("logintype guest,key: " , Storage.get(LSDefine.USER_LOGIN_GUEST_KEY))
        }else if(loginType == LSDefine.LOGIN_TYPE_UNAME){
            if(loginMsg){
                console.log("logintype uname: " , loginMsg.uname , ", upwd: " , loginMsg.upwd)
            }
        }
        
        if(loginMsg){
            let unameEditBox = this.seek_child_by_name(this.view["KW_IMG_LOGIN_BG"],"KW_INPUT_ACCOUNT")
            let upwdEditBox = this.seek_child_by_name(this.view["KW_IMG_LOGIN_BG"],"KW_INPUT_PWD")
            this.set_editbox_string(unameEditBox,loginMsg.uname)
            this.set_editbox_string(upwdEditBox,loginMsg.upwd)
        }
        
        let showPlatformStr = "platform: " + String(cc.sys.os) + " ,isNative:" + cc.sys.isNative + " ,isWechatGame:" + PlatForm.isWeChatGame() + " ,isBrows:" + cc.sys.isBrowser;
        this.set_string(this.view['KW_TEXT_PLATFORM'], showPlatformStr);
        this.set_string(this.view['KW_TEXT_VERSION'], "1.0.0")
    }

}