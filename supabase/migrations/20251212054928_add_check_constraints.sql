ALTER TABLE tournaments ADD CHECK (start_time < end_time);

ALTER TABLE events ADD CHECK (start_time < end_time);