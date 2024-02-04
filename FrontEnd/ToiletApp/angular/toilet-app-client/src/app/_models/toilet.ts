import { Address } from "./address"

export class Toilet {
    public id : string = ""
    public code: string = ""
    public userId: string = ""
    public imageUrl: string = ""
    public address: Address = new Address()
    public institution: number = 0
    public institutionString: string = ""
}