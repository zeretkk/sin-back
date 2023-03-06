export class UserDto{
    public username:string
    public name:string
    public email:string
    public bio:string
    public cover:string
    public volume:number
    public sold:number
    public followers:number
    public links:[string]
    constructor(doc: any) {
        this.username = doc.username
        this.name = doc.name
        this.email = doc.email
        this.bio = doc.bio
        this.cover = doc.cover
        this.volume = doc.volume
        this.sold = doc.sold
        this.followers = doc.followers
        this.links = doc.links
    }
}