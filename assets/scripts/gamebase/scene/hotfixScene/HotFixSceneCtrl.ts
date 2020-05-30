import UIController from '../../../framework/uibase/UIController';
import Log from '../../../framework/utils/Log';
import UIFunction from '../../../framework/common/UIFunciton';
import { ResourceManager } from '../../../framework/manager/ResourceManager';
import StringUtil from '../../../framework/utils/StringUtil';
import SceneManager from '../../../framework/manager/SceneManager';
import LoginScene from '../LoginScene/LoginScene';
import HotUpdateNew from '../../../framework/hotfix/HotUpdateNew';
import PlatForm from '../../../framework/config/PlatForm';
import DialogManager from '../../../framework/manager/DialogManager';
import NetWork from '../../../framework/network/NetWork';

const {ccclass, property} = cc._decorator;

@ccclass
export default class HotFixSceneCtrl extends UIController {

    _progressbar: cc.ProgressBar = null;

    _urlArray: string[] = [ 
        "ui_prefabs/login/",
        "ui_prefabs/lobby/",
        "ui_prefabs/hotfix/",
        "ui_prefabs/games/",
        "ui_prefabs/dialog/",
        "textures/games/",
        "textures/lobby/",
        "textures/dialog/",
        "textures/shareimg/",
        "mainfest/",
    ]

    _completedFlag:any = []
    _tryTimes = 0;

    _resourceMap: number[] = []

    onLoad () {
        super.onLoad()
    }

    start () {
        this.setProgress(0);
        this.checkHotUpdate();

        //test 在pc上重启会报错，不知道为什么
        // DialogManager.getInstance().show_common_dialog(1, function (dialogScript: any) {
        //     if (dialogScript) {
        //         let showTextStr = "更新成功,重启游戏!"
        //         dialogScript.set_content_text(showTextStr);
        //         dialogScript.set_btn_callback(
        //             function () { cc.game.restart(); },
        //             function () { },
        //             function () { cc.game.restart(); },
        //         )
        //     }
        // });
    }

    checkHotUpdate(){
        let hotupdateMgr = HotUpdateNew.getInstance();
        let _this = this;
        hotupdateMgr.checkUpdate(function (isNeedUpdate: boolean) {
            console.log("hcc>>enter_login_scene>>is need hotupdate: " , isNeedUpdate);
            if (isNeedUpdate) {
                hotupdateMgr.hotUpdateStart();
                hotupdateMgr.setUpdateCallback(function(isSuccess: boolean, percent?:number, tipString?:string) {
                    console.log("hcc>>hotupdate: isSuccess: " , isSuccess , "  ,percent: " , percent, "  ,tipstring: " , tipString);
                    if (percent){
                        _this.setProgress(percent);
                    }
                    if(tipString){
                        _this.set_string(_this.view["KW_TEXT_PROGRESS_TIP"], tipString)        
                    }
                    if (isSuccess) {
                        _this.set_string(_this.view["KW_TEXT_PROGRESS_TIP"], "热更新完成!")
                        if (PlatForm.isAndroidNative() || PlatForm.isIOSNative() || PlatForm.isWin32()) {
                            DialogManager.getInstance().show_common_dialog(1, function (dialogScript: any) {
                                if (dialogScript) {
                                    let showTextStr = "更新完成,请重启!"
                                    dialogScript.set_content_text(showTextStr);
                                    dialogScript.set_btn_callback(
                                        function () {  cc.game.restart(); },
                                        function () {},
                                        function () { cc.game.restart(); },
                                    )
                                }
                            });
                        }
                    }
                })
            } else {
                _this.set_string(_this.view["KW_TEXT_PROGRESS_TIP"], "已是最新版本！");
                _this.setProgress(1.0);
                _this.startPreloadRes();
            }
        })
    }

    startPreloadRes(){
        for (let index = 0; index < this._urlArray.length; index++) {
            this.preloadRes(this._urlArray[index])
        }
    }
    
    setProgress(progressNumber:any){
        let progressNode = this.view["KW_PROGRESS_BAR"]
        if (progressNode) {
            let progressbar = progressNode.getComponent(cc.ProgressBar);
            progressbar.progress = progressNumber;
        }
    }

    preloadRes(url: string) {
        let _this = this
        let progressNumber = 0;
        ResourceManager.getInstance().loadResDirAsyc(url, function (completedCount, totalCount, item) {
            if(totalCount != 0){
                progressNumber = completedCount / totalCount;
                _this.setProgress(progressNumber);
                let num = Math.max(1, progressNumber * 100)
                let pstr = `${StringUtil.format("%2d", num)}%`
                let tipstr  = "正在载入资源中... " + completedCount + "/" + totalCount
                // _this.set_string(_this.view["KW_TEXT_PERCENT"],pstr)
                _this.set_string(_this.view["KW_TEXT_PROGRESS_TIP"],tipstr)
            }
        }, function (error: Error, resource: any[], urls: string[]) {
            if (error) {
                console.warn(error)
                if (_this._tryTimes < 3) {
                    _this._tryTimes++
                    _this.preloadRes(url)
                } else {
                    console.warn("res load failed!")
                }
            } else {
                _this._completedFlag.push(true)
                if (_this._completedFlag.length >= _this._urlArray.length){
                    _this.set_string(_this.view["KW_TEXT_PROGRESS_TIP"],"资源加载完成!")
                    _this.enter_login_scene()
                }
            }
        })
    }

    enter_login_scene() {
        NetWork.getInstance().connect();
        SceneManager.getInstance().enter_scene_asyc(new LoginScene());
    }
}
