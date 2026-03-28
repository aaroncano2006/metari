DROP DATABASE IF EXISTS metari_db;
CREATE DATABASE IF NOT EXISTS metari_db;
USE metari_db;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    completed_tasks BIGINT UNSIGNED NOT NULL DEFAULT 0,
    score BIGINT UNSIGNED NOT NULL DEFAULT 0,
    restore_token TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- GROUPS
CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    owner_id INT NOT NULL,
    is_public BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- METAS
CREATE TABLE metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    description TEXT NOT NULL,
    author_id INT NOT NULL,
    group_id INT NOT NULL,
    type ENUM("challenge", "task") NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- CATEGORIES
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CATEGORY_META
CREATE TABLE category_meta (
    category_id INT,
    meta_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id, meta_id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id)
);

-- ASSIGNATIONS 
CREATE TABLE assignations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    meta_id INT,
    user_id INT,
    start_date DATE,
    due_date DATE,
    priority ENUM("high", "low") DEFAULT NULL,
    difficulty ENUM("easy", "normal", "hard", "extreme") DEFAULT "normal",
    score BIGINT UNSIGNED,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- COMMENTS
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignation_id INT,
    user_id INT,
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignation_id) REFERENCES assignations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- PROOFS
-- is_valid servirà per comprovar quina assignació ha sigut completada (meta amb type "tasca") i
-- quins usuaris han completat el repte (meta amb type "repte").
-- En el primer cas agafarà la assignació vinculada i canviarà el seu camp completed a true en el moment que is_valid sigui true.
-- En el segon cas simplement es canviarà únicament is_valid a true i com la prova ja ve assignada a un usuari es podrà saber qui la ha completat.
CREATE TABLE proofs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignation_id INT,
    user_id INT,
    proof VARCHAR(255),
    is_valid BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignation_id) REFERENCES assignations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- INVITATIONS
CREATE TABLE invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    group_id INT,
    status ENUM("pending", "accepted", "rejected") NOT NULL DEFAULT "pending",
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- GROUP_USER
CREATE TABLE group_user (
    group_id INT,
    user_id INT,
    role ENUM("member", "moderator") NOT NULL DEFAULT "member",
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- INDEX (TERNARIA)
CREATE TABLE `index` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    meta_id INT,
    group_id INT,
    is_public BOOLEAN,
    is_approved BOOLEAN,
    is_community_approved BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);