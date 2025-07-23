import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { HighScore } from '../store/gameStore';

export interface GlobalHighScore extends Omit<HighScore, 'date'> {
  id?: string;
  timestamp: Timestamp;
  country?: string; // Optional: can add geolocation later
}

class LeaderboardService {
  private unsubscribe: (() => void) | null = null;

  /**
   * Submit a new high score to the global leaderboard
   */
  async submitScore(score: Omit<GlobalHighScore, 'id' | 'timestamp'>): Promise<void> {
    try {
      const globalScore: Omit<GlobalHighScore, 'id'> = {
        ...score,
        timestamp: Timestamp.now()
      };

      await addDoc(collection(db, 'highScores'), globalScore);
      console.log('Score submitted successfully to global leaderboard');
    } catch (error) {
      console.error('Error submitting score to global leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get the top scores from the global leaderboard
   */
  async getTopScores(limitCount = 10): Promise<GlobalHighScore[]> {
    try {
      const q = query(
        collection(db, 'highScores'),
        orderBy('score', 'desc'),
        orderBy('timestamp', 'asc'), // Earlier submission wins ties
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GlobalHighScore[];
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time updates of the global leaderboard
   */
  subscribeToLeaderboard(
    callback: (scores: GlobalHighScore[]) => void,
    limitCount = 10
  ): () => void {
    try {
      const q = query(
        collection(db, 'highScores'),
        orderBy('score', 'desc'),
        orderBy('timestamp', 'asc'),
        limit(limitCount)
      );

      this.unsubscribe = onSnapshot(q, (querySnapshot) => {
        const scores = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GlobalHighScore[];
        
        callback(scores);
      });

      return this.unsubscribe;
    } catch (error) {
      console.error('Error subscribing to leaderboard updates:', error);
      return () => {};
    }
  }

  /**
   * Check if a score qualifies for the global top 10
   */
  async checkGlobalHighScore(playerScore: number): Promise<boolean> {
    try {
      const topScores = await this.getTopScores(10);
      
      // Always qualify if less than 10 scores exist
      if (topScores.length < 10) {
        return true;
      }
      
      // Check if player's score beats the 10th place score
      return playerScore > topScores[9].score;
    } catch (error) {
      console.error('Error checking if score qualifies:', error);
      // Fallback: always allow submission if there's an error
      return true;
    }
  }

  /**
   * Convert GlobalHighScore to local HighScore format
   */
  convertToLocalFormat(globalScores: GlobalHighScore[]): HighScore[] {
    return globalScores.map(score => ({
      initials: score.initials,
      score: score.score,
      level: score.level,
      date: score.timestamp.toDate().toLocaleDateString()
    }));
  }

  /**
   * Cleanup subscription
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

// Export a singleton instance
export const leaderboardService = new LeaderboardService();
export default leaderboardService; 