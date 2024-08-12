-- Drop existing data
DELETE FROM game_cells;
DELETE FROM games;

-- Insert data into games table with UUIDs
INSERT INTO games (id, rows, columns, status) VALUES
('4da4c314-c6f5-49b0-aa55-5b811dc7d85b', 2, 2, 'PENDING'),
('39d7161d-839e-44a5-abb8-e75ba2fa5270', 3, 3, 'PENDING');

-- Insert data into game_cells table with UUIDs
INSERT INTO game_cells (id, game_id, x_coordinate, y_coordinate, is_mine, neighboring_bomb_count, status) VALUES
  ('b27a3f6c-5d4e-491f-9e36-e62a14e50f98', '4da4c314-c6f5-49b0-aa55-5b811dc7d85b', 0, 0, false, 1, 'HIDDEN'),
  ('03cfb155-0f3f-42ba-9c62-1cc4dfcf2ee1', '4da4c314-c6f5-49b0-aa55-5b811dc7d85b', 0, 1, true, 0, 'HIDDEN'),
  ('10f78489-03a5-40ac-8331-8cded1447149', '4da4c314-c6f5-49b0-aa55-5b811dc7d85b', 1, 0, false, 1, 'HIDDEN'),
  ('afb454f7-6307-48c4-a1b6-d7c74260fc76', '4da4c314-c6f5-49b0-aa55-5b811dc7d85b', 1, 1, false, 1, 'HIDDEN'),
  ('65ee4333-9e8f-440e-844e-695925c47d85', '39d7161d-839e-44a5-abb8-e75ba2fa5270', 0, 0, true, 0, 'HIDDEN');
