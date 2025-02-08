-- Create database if not exists
CREATE DATABASE IF NOT EXISTS munday_reviews;
USE munday_reviews;

-- Create admin user with privileges
CREATE USER IF NOT EXISTS 'munday'@'%' IDENTIFIED BY 'mundaypass';
GRANT ALL PRIVILEGES ON munday_reviews.* TO 'munday'@'%';
FLUSH PRIVILEGES;

-- Set character set and collation
ALTER DATABASE munday_reviews CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 