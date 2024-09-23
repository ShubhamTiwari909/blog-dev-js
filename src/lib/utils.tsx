  /**
   * Generates a unique blog URL based on the blog title.
   * Replaces multiple spaces with a single hyphen, removes all non-alphanumeric characters,
   * trims the string to remove leading and trailing whitespace, and slices the string to
   * a maximum of 20 characters. Adds a random number between 0 and 1000000000 to the end
   * of the string to ensure uniqueness.
   * @param updateBlogUrl - A function to update the blog URL state
   * @param blogTitle - The title of the blog
   */
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

