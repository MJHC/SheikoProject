CREATE TABLE all_exercises(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(31) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    created DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY(id)
);

CREATE TABLE concepts(
    id INT NOT NULL AUTO_INCREMENT,
    author INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY (author) REFERENCES users(id)
);

CREATE TABLE programs(
    id INT NOT NULL AUTO_INCREMENT,
    concept_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (concept_id) REFERENCES concepts(id)
);

CREATE TABLE subscriptions(
    id INT NOT NULL AUTO_INCREMENT,
    program_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (program_id) REFERENCES programs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE exercises(
	id INT NOT NULL AUTO_INCREMENT,
    program_id INT NOT NULL,
    exercise_id INT NOT NULL,
	week INT NOT NULL,
    day INT NOT NULL,
    ex_list INT NOT NULL,
    ex_list_item INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    procent INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (program_id) REFERENCES programs(id),
    FOREIGN KEY (exercise_id) REFERENCES all_exercises(id)
);