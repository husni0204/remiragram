export interface Bookmark {
    id: number;
    post: Post;
    postId: number;
    userId: number;
}

export interface Post {
    id: number;
    image: string;
    caption: string;
    userId: number;
    postId: number;
}

export interface DetailUserType {
    id: number;
    fullname: string;
    username: string;
    email: string;
    postCount: number;
    followingCount: number;
    followerCount: number;
    image?: string | null;
    bio?: string | null;
    posts?: Post[];
    bookmarks: Bookmark[];
}
