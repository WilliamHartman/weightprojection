INSERT INTO users
(given_name, family_name, email, auth_id)
VALUES
($1, $2, $3, $4)
RETURNING *;