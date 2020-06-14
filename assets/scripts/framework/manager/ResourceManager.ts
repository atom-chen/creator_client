export class ResourceManager {
    public static readonly instance: ResourceManager = new ResourceManager();

    public static getInstance(){
        return ResourceManager.instance;
    }

    private constructor() {
       
    }

    //载入整个文件夹
    loadResDirAsyc(url: string, progressCallback?: Function, completeCallback?: Function){
        cc.loader.loadResDir(url, function(completedCount:number, totalCount:number, item:any) {
            if (progressCallback) {
                progressCallback(completedCount, totalCount, item);
            }
        }, function(error: Error, resource: any[], urls: string[]) {
            if (completeCallback) {
                completeCallback(error, resource, urls)
            }
        })
    }

    //释放整个文件夹
    releaseResDir<T extends typeof cc.Asset>(url: string, type?: T) {
        cc.loader.releaseResDir(url,type); //依赖资源，不会释放
    }

    //载入单个资源
    loadResAsync<T extends typeof cc.Asset>(path: string, type: T){
        return new Promise(resolve => {
            cc.loader.loadRes(path, type, (error:Error, resource:any) => {
                if (error) {
                    console.warn(`load res fail, path=${path}, err=${error}`);
                    resolve(null);
                } else {
                    resolve(resource);
                }
            })
        })
    }

    //卸载单个资源
    releaseRes(key: string) {
        cc.loader.releaseRes(key)
    }

    //获取载入的资源
    getRes<T extends typeof cc.Asset>(url: string, type: T){
        let res = cc.loader.getRes(url, type)
        if (!res) {
            console.warn(`preload res path: ${url} not exist`)
        }
        return res
    }
}