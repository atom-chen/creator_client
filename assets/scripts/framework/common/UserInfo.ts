export default class UserInfo {
    private static _uinfo:any = {};
    private static _ugame_info:any = {}

    private constructor() {
        
    }

    static set_uinfo(uinfo:string){
        let tmpInfo = null;
        try {
            tmpInfo = JSON.parse(uinfo)
            cc.log("uinfo: " , tmpInfo)
        } catch (error) {
            cc.error(error)
        }

        this._uinfo = tmpInfo
    }

    static get_uinfo(){
        return this._uinfo;
    }
    //玩家昵称
    static get_unick(){
        return this._uinfo.unick;
    }

    static get_numberid(){
        return this._uinfo.numberid;
    }

    static get_uface(){
        return this._uinfo.uface;
    }

    static get_usex(){
        return this._uinfo.usex;
    }
    //登录账号
    static get_uname(){
        return this._uinfo.uname
    }

    static set_ugame_info(ugame_info:any){
        this._ugame_info = ugame_info
    }

    static get_ugame_info(){
        return this._ugame_info;
    }

    static get_uchip(){
        return this._ugame_info.uchip;
    }

}