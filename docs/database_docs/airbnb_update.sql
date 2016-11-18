SELECT checkin_date,checkout_date from trip;
alter table trip add trip_approved_time datetime;


alter table trip modify column property_id varchar(50);

select * from trip;