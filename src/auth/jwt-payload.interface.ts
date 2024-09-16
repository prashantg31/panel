export interface JwtPayload {
    userId: string;  // Refers to the user's unique ID
    role: string;
    sub: string;   // User's role (e.g., ADMIN or USER)
}
