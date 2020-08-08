import NetWork from '../../../../framework/network/NetWork';
import { Stype } from '../../../../framework/protocol/Stype';
import { Cmd } from '../../../../framework/protocol/protofile/GameHoodleProto';
import CellManager from '../../../../framework/manager/CellManager';

export default class LobbySendGameHoodleMsg {
    
    static send(ctype:number, body?:any){
        NetWork.getInstance().send_msg(Stype.GameHoodle,ctype,body)
    }

    //登录游戏服务
    static send_login_logic(){
        // LobbySendGameHoodleMsg.send(Cmd.eLoginLogicReq);
        CellManager.getInstance().start("CellLoginLogic", null, 5);
    }

    //创建房间
    static send_create_room(gamerule: string){
        if (gamerule == null || gamerule == ''){
            return;
        }
        let body = { gamerule: gamerule };
        CellManager.getInstance().start("CellCreateRoom", body, 5);
    }

    //加入房间
    static send_join_room(roomid: string){
        if (roomid == null || roomid == ''){
            return;
        }
        console.log("hcc>>send_join_room: " , roomid);
        LobbySendGameHoodleMsg.send(Cmd.eJoinRoomReq, {roomid: roomid});
    }

    //退出房间
    static send_exit_room(){
        LobbySendGameHoodleMsg.send(Cmd.eExitRoomReq);
    }

    //解散房间
    static send_dessolve_room(){
        LobbySendGameHoodleMsg.send(Cmd.eDessolveReq);
    }

    //是否创建了房间
    static send_get_room_status(){
        LobbySendGameHoodleMsg.send(Cmd.eGetRoomStatusReq);
    }

    //游戏服务信息
    static send_get_ugame_info(){
        LobbySendGameHoodleMsg.send(Cmd.eUserGameInfoReq);
    }

    //返回房间
    static send_back_room(){
        CellManager.getInstance().start("CellBackRoom", null, 5);
    }

    //玩家匹配
    static send_user_match(roomlevel:number){
        let body = {roomlevel : roomlevel}
        CellManager.getInstance().start("CellMatchRoom", body, 5);
    }

    //玩家取消匹配
    static send_user_stop_match(){
        LobbySendGameHoodleMsg.send(Cmd.eUserStopMatchReq);
    }

    //获取小球信息
    static send_get_uball_info(){
        LobbySendGameHoodleMsg.send(Cmd.eUserBallInfoReq)
    }

    //合成，销售小球
    static send_update_uball_info(updatetype:number,level:number, count?:number){
        if(!count){
            count = 0;
        }
        let body = {
            updatetype : updatetype,
            level: level,
            count: count,
        }
        LobbySendGameHoodleMsg.send(Cmd.eUpdateUserBallReq,body);
    }

    //获取小球信息
    static send_get_room_list_config() {
        LobbySendGameHoodleMsg.send(Cmd.eRoomListConfigReq);
    }

}