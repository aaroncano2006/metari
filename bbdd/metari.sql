DROP DATABASE IF EXISTS Metari_db;
-- Crear base de dades
CREATE DATABASE Metari_db;
USE Metari_db;

CREATE TABLE Usuari (
    id_usuari INT AUTO_INCREMENT PRIMARY KEY,
    data_creacio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Grup (
    id_grup INT AUTO_INCREMENT PRIMARY KEY,
    id_creador INT,
    data_creacio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creador) REFERENCES Usuari(id_usuari)
);

CREATE TABLE Meta (
    id_meta INT AUTO_INCREMENT PRIMARY KEY,
    titol VARCHAR(150),
    id_autor INT,
    id_grup INT,
    data_creacio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_autor) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_grup) REFERENCES Grup(id_grup)
);


CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY
 );

-- Relació Meta-Categoria (N:M)
CREATE TABLE Meta_Categoria (
    id_meta INT,
    id_categoria INT,
    PRIMARY KEY (id_meta, id_categoria),
    FOREIGN KEY (id_meta) REFERENCES Meta(id_meta),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
);

CREATE TABLE Assignacio (
    id_assignacio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuari INT,
    id_meta INT,
    id_grup INT,
    data_assignacio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_meta) REFERENCES Meta(id_meta),
    FOREIGN KEY (id_grup) REFERENCES Grup(id_grup)
);

CREATE TABLE Comentari (
    id_comentari INT AUTO_INCREMENT PRIMARY KEY,
    id_usuari INT,
    id_assignacio INT,
    data_creacio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_assignacio) REFERENCES Assignacio(id_assignacio)
);

CREATE TABLE Proofs (
    id_proof INT AUTO_INCREMENT PRIMARY KEY,
    id_assignacio INT,
    id_usuari INT,
    FOREIGN KEY (id_assignacio) REFERENCES Assignacio(id_assignacio),
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari)
);


CREATE TABLE Invitacio (
    id_invitacio INT AUTO_INCREMENT PRIMARY KEY,
    id_emissor INT,
    id_receptor INT,
    id_grup INT,
    FOREIGN KEY (id_emissor) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_receptor) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_grup) REFERENCES Grup(id_grup)
);


CREATE TABLE Usuari_Grup (
    id_usuari INT,
    id_grup INT,
    PRIMARY KEY (id_usuari, id_grup),
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_grup) REFERENCES Grup(id_grup)
);


CREATE TABLE Indexar (
    id_indexar INT AUTO_INCREMENT PRIMARY KEY,
    id_usuari INT,
    id_meta INT,
    id_grup INT,
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari),
    FOREIGN KEY (id_meta) REFERENCES Meta(id_meta),
    FOREIGN KEY (id_grup) REFERENCES Grup(id_grup)
);