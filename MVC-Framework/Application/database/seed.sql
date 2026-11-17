-- Synthetic demonstration data only. Run once after schema.sql.
INSERT INTO departments(id,name) VALUES (1,'Computer Applications'),(2,'Management');
INSERT INTO courses(id,name,duration,department_id) VALUES (1,'MCA','2 years',1),(2,'BCA','3 years',1),(3,'MBA','2 years',2);
INSERT INTO faculty(name,email,department_id) VALUES ('Sample Faculty A','faculty.a@example.test',1),('Sample Faculty B','faculty.b@example.test',2);
INSERT INTO students(name,email,course_id) VALUES ('Asha Demo','asha@example.test',1),('Bharat Demo','bharat@example.test',1),('Charu Demo','charu@example.test',2),('Dev Demo','dev@example.test',1),('Esha Demo','esha@example.test',3),('Farhan Demo','farhan@example.test',2),('Gita Demo','gita@example.test',1);
