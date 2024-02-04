import { Address } from "./address"

export class ListToiletModel {
    public id : string = ""
    public code: string = ""
    public userId: string = ""
    public imageUrl: string = ""
    public address: Address = new Address()
    public institution: number = 0
    public institutionString: string = ""
    public userName: string = ""
    public userImage: string = ""
    public avgStar: number = 0

}