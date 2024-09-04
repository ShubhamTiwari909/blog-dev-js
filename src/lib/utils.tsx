export const geneteBlogUrl = (
  updateBlogUrl: (blogUrl: string) => void,
  blogTitle: string,
): void => {
  updateBlogUrl(
    `${blogTitle
      .toLocaleLowerCase()
      .replaceAll(/\s+/g, "-")
      .replaceAll(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .slice(0, 20)}-${Math.floor(Math.random() * 1000000000)}`,
  );
};
