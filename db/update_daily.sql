update daily 
set  calories_burned = $2,
    calories_consumed = $3,
    daily_weight = $4,
    fat = $5
where id = $1