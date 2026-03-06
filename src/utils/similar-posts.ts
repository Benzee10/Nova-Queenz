
import type { CollectionEntry } from "astro:content";

export interface SimilarPost {
  slug: string;
  data: CollectionEntry<"posts">["data"];
  similarity: number;
}

export function findSimilarPosts(
  currentPost: CollectionEntry<"posts">,
  allPosts: CollectionEntry<"posts">[],
  limit: number = 4
): SimilarPost[] {
  if (!currentPost || !allPosts || allPosts.length === 0) {
    return [];
  }

  const currentTags = currentPost.data.tags || [];
  const currentCategory = currentPost.data.category;

  // Filter out the current post and draft posts
  const otherPosts = allPosts.filter(post => 
    post.slug !== currentPost.slug && 
    !post.data.draft
  );

  if (otherPosts.length === 0) {
    return [];
  }

  // Calculate similarity scores
  const postsWithScores = otherPosts.map(post => {
    let similarity = 0;
    const postTags = post.data.tags || [];

    // Category match gives highest score
    if (post.data.category === currentCategory) {
      similarity += 5;
    }

    // Tag matches
    const commonTags = currentTags.filter(tag => 
      postTags.includes(tag)
    );
    similarity += commonTags.length * 2;

    // Base similarity for variety
    similarity += Math.random() * 0.1;

    return {
      slug: post.slug,
      data: post.data,
      similarity
    };
  });

  // Sort by similarity and get recent posts if no matches
  const sortedPosts = postsWithScores.sort((a, b) => {
    if (b.similarity !== a.similarity) {
      return b.similarity - a.similarity;
    }
    // If similarity is equal, prefer more recent posts
    return new Date(b.data.published).getTime() - new Date(a.data.published).getTime();
  });

  // Always return at least some posts (most recent if no similarities found)
  const result = sortedPosts.slice(0, limit);
  
  // If we don't have enough similar posts, fill with recent posts
  if (result.length < limit && result.length < otherPosts.length) {
    const recentPosts = otherPosts
      .filter(post => !result.some(r => r.slug === post.slug))
      .sort((a, b) => new Date(b.data.published).getTime() - new Date(a.data.published).getTime())
      .slice(0, limit - result.length)
      .map(post => ({
        slug: post.slug,
        data: post.data,
        similarity: 0.1
      }));
    
    result.push(...recentPosts);
  }

  return result;
}
