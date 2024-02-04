import { addressAddModel } from "./addressAddModel"

export class ToiletAddModel {
    public code: string = ""
    public userId: string = ""
    public imageUrl: string = ""
    public address: addressAddModel = new addressAddModel()
    public institution: number = 0
}