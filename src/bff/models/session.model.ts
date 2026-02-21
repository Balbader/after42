/**
 * Session domain model
 */
export class Session {
  constructor(
    public id: string,
    public userId: string,
    public expiresAt: Date,
    public token: string,
    public ipAddress?: string,
    public userAgent?: string,
  ) {}

  /**
   * Check if session has expired
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Check if session is valid
   */
  public isValid(): boolean {
    return !this.isExpired();
  }

  /**
   * Factory method to create Session from database row
   */
  static fromDatabase(dbSession: any): Session {
    return new Session(
      dbSession.id,
      dbSession.userId,
      new Date(dbSession.expiresAt),
      dbSession.token,
      dbSession.ipAddress,
      dbSession.userAgent,
    );
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      expiresAt: this.expiresAt.toISOString(),
      token: this.token,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
    };
  }
}
