export type PostData = {
    "id": number,
    "text": string,
    "total_likes": number,
    "parent_id"?: number | null,
    "is_deleted": boolean,
    "user": {
        "id": string,
        "name": string,
        "username": string,
        "bio"?: string | null,
        "image_url"?: string | null
    }
}

export type PostResponse = {
    "status": boolean,
    "message": string,
    "data": PostData[]
    "meta": {
        "page": number,
        "per_page": number,
        "max_page": number,
        "count": number
    }
}

export type IndexPostResponse = {
    "status": boolean,
    "message": string,
    "data": {
        "replies": PostData[]
    } & PostData,
    "meta": {
        "page": number,
        "per_page": number,
        "max_page": number,
        "count": number
    }
}