insert into users (auth_id, user_height, date_of_birth, gender, time_zone, access_token, starting_weight, goal_weight, last_login) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
returning *;