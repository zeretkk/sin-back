module.exports = class UserDto {
    username
    name
    email
    bio
    cover
    volume
    sold
    followers
    links
    constructor(doc) {
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
