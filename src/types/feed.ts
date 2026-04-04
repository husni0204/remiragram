import { User } from "./auth";

export interface Feed {
  id: string;
  caption: string;
  commentCount: number;
  createdAt: Date;
  image: string;
  imageId: string;
  likeCount: number;
  userId: number;
  user: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
}

export interface DetailFeed {
  id: string;
  caption: string;
  commentCount: number;
  createdAt: Date;
  image: string;
  imageId: string;
  likeCount: number;
  userId: number;
  user: User;
  comments: Comment[];
}
