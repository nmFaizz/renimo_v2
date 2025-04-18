export type UserData = {
    "id": string,
    "name": string,
    "username": string,
    "bio": string,
    "image_url": string
}

export type UserResponse = {
    "status": boolean,
    "message": string,
    "data": UserData
}