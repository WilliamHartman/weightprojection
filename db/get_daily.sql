select * from daily
where user_id = $1
order by daily_date desc