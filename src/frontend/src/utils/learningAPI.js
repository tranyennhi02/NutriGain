/**
 * Learning API - Replaces localStorage with backend persistence
 */

const API_BASE = '/api/v1/learning';

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
  const token = localStorage.getItem('access_token');
  return token;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get all lesson progress
 */
export async function getAllProgress() {
  try {
    return await apiRequest('/progress');
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return [];
  }
}

/**
 * Get specific lesson progress
 */
export async function getLessonProgress(lessonId) {
  try {
    return await apiRequest(`/progress/${lessonId}`);
  } catch (error) {
    console.error(`Failed to fetch progress for ${lessonId}:`, error);
    return null;
  }
}


/**
 * Update scroll progress
 */
export async function updateScrollProgress(lessonId, scrollProgress, timeSpent = 0) {
  try {
    return await apiRequest(`/progress/${lessonId}/scroll`, {
      method: 'POST',
      body: JSON.stringify({
        scroll_progress: scrollProgress,
        time_spent: timeSpent,
      }),
    });
  } catch (error) {
    console.error(`Failed to update scroll progress for ${lessonId}:`, error);
    throw error;
  }
}

/**
 * Submit quiz answers
 */
export async function submitQuiz(lessonId, answers, xpReward) {
  try {
    return await apiRequest(`/quiz/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        answers,
        xp_reward: xpReward,
      }),
    });
  } catch (error) {
    console.error(`Failed to submit quiz for ${lessonId}:`, error);
    throw error;
  }
}

/**
 * Get learning statistics
 */
export async function getLearningStats() {
  try {
    return await apiRequest('/stats');
  } catch (error) {
    console.error('Failed to fetch learning stats:', error);
    return {
      total_xp: 0,
      total_lessons_completed: 0,
      total_lessons_in_progress: 0,
      current_streak_days: 0,
      longest_streak_days: 0,
    };
  }
}
