/**
 * Hacker News API Service
 * Provides functions to interact with the Hacker News API
 */
import type { Story } from '../types/hackerNews';

// Define the API base URL
const API_BASE_URL: string = 'https://hacker-news.firebaseio.com/v0';

/**
 * Fetches the IDs of the top stories
 * @returns {Promise<number[]>} Array of story IDs
 */
export const fetchTopStories = async (): Promise<number[]> => {
  try {
    const response: Response = await fetch(`${API_BASE_URL}/topstories.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch top stories: ${response.status}`);
    }
    return await response.json() as number[];
  } catch (error) {
    console.error('Error fetching top stories:', error);
    throw error;
  }
};

/**
 * Fetches the details of a story by its ID
 * @param {number} id - The ID of the story to fetch
 * @returns {Promise<Story>} Story details
 */
export const fetchStory = async (id: number): Promise<Story> => {
  try {
    const response: Response = await fetch(`${API_BASE_URL}/item/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch story ${id}: ${response.status}`);
    }
    return await response.json() as Story;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches multiple stories by their IDs
 * @param {number[]} ids - Array of story IDs to fetch
 * @param {number} limit - Maximum number of stories to fetch
 * @returns {Promise<Story[]>} Array of story details
 */
export const fetchMultipleStories = async (ids: number[], limit: number = 10): Promise<Story[]> => {
  const storyIds: number[] = ids.slice(0, limit);
  try {
    const storyPromises: Promise<Story>[] = storyIds.map(id => fetchStory(id));
    const stories = await Promise.all(storyPromises);
    return stories.filter((story): story is Story => 
      story !== null && 
      typeof story === 'object' && 
      'id' in story && 
      'title' in story
    );
  } catch (error) {
    console.error('Error fetching multiple stories:', error);
    throw error;
  }
};
