insert into users (first_name, last_name, auth_id, user_height, user_weight, date_of_birth, gender, time_zone, access_token, starting_weight, goal_weight, last_login, starting_date) 
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
returning *;