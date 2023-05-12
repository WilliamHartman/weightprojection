update users 
set access_token = $1
where auth_id = $2
returning *;