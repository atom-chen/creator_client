//游戏界面控制器

import UIController from "../../../../framework/uibase/UIController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameHoodleCtrl extends UIController {

    onLoad () {
        super.onLoad();
        this.add_script("GameHoodleTouchEvent")
        this.add_script("GameHoodleRecvMsg")
        this.add_script("GameHoodleShowUI")
    }

    start () {
    }

}
