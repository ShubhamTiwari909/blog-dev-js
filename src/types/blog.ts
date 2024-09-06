export type BlogSchema = {
  userId?: string | null;
  blogTitle: string;
  blogUrl: string;
  image: {
    name: string;
    url: string;
  };
  tags: string[];
  markdown: string;
  id?:string
};