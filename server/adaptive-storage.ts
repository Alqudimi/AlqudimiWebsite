import { DatabaseInitializer } from "./database-initializer";
import { DatabaseStorage } from "./storage";
import { MemoryStorage } from "./memory-storage";
import { IStorage } from "./storage";

/**
 * Adaptive storage system that automatically switches between database and memory storage
 * based on database availability
 */
export class AdaptiveStorage {
  private static instance: AdaptiveStorage;
  private storage: IStorage;
  private usingDatabase = false;
  private initializer: DatabaseInitializer;

  private constructor() {
    this.initializer = new DatabaseInitializer();
    // Start with memory storage as default fallback
    this.storage = new MemoryStorage();
    this.usingDatabase = false;
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AdaptiveStorage {
    if (!AdaptiveStorage.instance) {
      AdaptiveStorage.instance = new AdaptiveStorage();
    }
    return AdaptiveStorage.instance;
  }

  /**
   * Initialize the storage system with automatic fallback
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing adaptive storage system...');

    // Try to use database if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      console.log('📊 DATABASE_URL found, attempting database connection...');
      
      try {
        const connected = await this.initializer.testConnection(process.env.DATABASE_URL);
        
        if (connected) {
          const initialized = await this.initializer.initializeDatabase();
          
          if (initialized) {
            // Switch to database storage
            this.storage = new DatabaseStorage();
            this.usingDatabase = true;
            console.log('✅ Using database storage (PostgreSQL)');
            return;
          }
        }
      } catch (error) {
        console.warn('⚠️ Database initialization failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    } else {
      console.log('ℹ️ No DATABASE_URL found in environment');
    }

    // Fallback to memory storage
    console.log('🧠 Falling back to memory storage');
    this.storage = new MemoryStorage();
    this.usingDatabase = false;
    console.log('✅ Using memory storage (fallback)');
  }

  /**
   * Get the current storage implementation
   */
  getStorage(): IStorage {
    return this.storage;
  }

  /**
   * Check if currently using database storage
   */
  isUsingDatabase(): boolean {
    return this.usingDatabase;
  }

  /**
   * Get storage type name for logging/debugging
   */
  getStorageType(): string {
    return this.usingDatabase ? 'Database (PostgreSQL)' : 'Memory (In-Memory)';
  }

  /**
   * Attempt to reconnect to database if it becomes available
   */
  async attemptDatabaseReconnection(): Promise<boolean> {
    if (this.usingDatabase) {
      return true; // Already using database
    }

    if (!process.env.DATABASE_URL) {
      return false; // No database URL available
    }

    console.log('🔄 Attempting to reconnect to database...');
    
    try {
      const connected = await this.initializer.testConnection(process.env.DATABASE_URL);
      
      if (connected) {
        const initialized = await this.initializer.initializeDatabase();
        
        if (initialized) {
          console.log('🔄 Migrating from memory to database storage...');
          
          // TODO: Optionally migrate data from memory to database
          // This could be implemented to preserve data created while offline
          
          this.storage = new DatabaseStorage();
          this.usingDatabase = true;
          console.log('✅ Successfully reconnected to database');
          return true;
        }
      }
    } catch (error) {
      console.warn('⚠️ Database reconnection failed:', error instanceof Error ? error.message : 'Unknown error');
    }

    return false;
  }

  /**
   * Get health check information
   */
  getHealthStatus(): {
    storageType: string;
    usingDatabase: boolean;
    status: 'healthy' | 'degraded';
    message: string;
  } {
    return {
      storageType: this.getStorageType(),
      usingDatabase: this.usingDatabase,
      status: this.usingDatabase ? 'healthy' : 'degraded',
      message: this.usingDatabase 
        ? 'Connected to database storage' 
        : 'Using fallback memory storage - data will not persist between restarts'
    };
  }
}