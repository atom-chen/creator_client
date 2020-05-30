import UIController from '../../../framework/uibase/UIController';
import UserInfo from '../../../framework/common/UserInfo';
import { ResourceManager } from '../../../framework/manager/ResourceManager';
import GameAppConfig from '../../../framework/config/GameAppConfig';
import HotUpdateNew from '../../../framework/hotfix/HotUpdateNew';
import StringUtil from '../../../framework/utils/StringUtil';

// let HEAD_PATH = "lobby/rectheader/1";
let BALL_TEXTURE_KEY_STR = "games/balls/ball_level_%s.png"

const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbySceneShowUI extends UIController {

    onLoad () {
        super.onLoad()
    }

    start () {
        super.start();
        this.show_version();
    }

    show_user_info(){
        let user_info_bg = this.view["IMG_USER_INFO_BG"]
        if(user_info_bg){
            this.set_string(this.view['TEXT_USER_NAME'],UserInfo.get_unick()) 
            // this.set_string(this.view['TEXT_USER_NAME'],UserInfo.get_uname()); //TODO 暂时先显示玩家账号
            this.set_string(this.view['TEXT_USER_ID'],UserInfo.get_numberid());
            let ufaceImg = StringUtil.format(BALL_TEXTURE_KEY_STR, UserInfo.get_uface());
            this.set_sprite_asyc(this.view["IMG_HEAD"],ufaceImg);
            this.set_string(this.view['TEXT_COIN'],UserInfo.get_uchip());
            console.log("hcc>>LobbySceneShowUI>>show_user_info " , ufaceImg);
            console.log("hcc>>avatrurl: ", UserInfo.get_avatrurl());
            if (UserInfo.get_avatrurl() && !StringUtil.isEmptyString(UserInfo.get_avatrurl())){
                this.set_headimg_url(this.view["IMG_HEAD"], UserInfo.get_avatrurl(),120);
            }

            //test
            // let headimgurl = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLQoDgahGVTFb6H74TZz9z5OI9RoXWmXJ6WXbWsfvWKCAD5KCdaYfdJZCf8aR0N4oP5bKXImelbkw/132";
            // this.set_headimg_url(this.view["IMG_HEAD"], headimgurl);
        }
    }

    show_version() {
        this.set_string(this.view["KW_TEXT_VERSION"], HotUpdateNew.getInstance().getLocalVersion());
    }
}
