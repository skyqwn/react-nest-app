export interface IPost {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  likeCount: string;
  commentCount: string;
  author: IAuhor;
  images: string[];
  likeUsers: string[];
}

export interface IAuhor {
  id: number;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  email: string;
  role: string;
  avatar: string;
}
