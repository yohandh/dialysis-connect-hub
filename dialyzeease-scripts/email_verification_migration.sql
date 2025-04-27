-- Add email verification columns to users table
ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN token_expires DATETIME DEFAULT NULL;

-- Create index for faster token lookups
CREATE INDEX idx_users_verification_token ON users(verification_token);
