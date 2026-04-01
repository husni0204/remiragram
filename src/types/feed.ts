import { User } from "./auth";

export interface Feed {
  id: string;
  caption: string;
  commentCount: number;
  createAt: Date;
  image: string;
  imageId: string;
  likeCount: number;
  userId: number;
  user: User;
}
