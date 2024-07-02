import { Toilet } from "./toilet"

export class Opinion {
    public uid: string = ""
    public stars: number = 0
    public description: string = ""
    public date: Date = new Date()
    public dateString: string = ""
    public toilet: Toilet = new Toilet()
    public toiletUid: string = ""
    public userUid: string = ""
}