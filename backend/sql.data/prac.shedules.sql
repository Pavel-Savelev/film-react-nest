-- Очищаем таблицу перед заполнением
TRUNCATE TABLE schedules CASCADE;

-- Вставляем тестовое расписание (сеансы на ближайшую неделю)
-- Используем CURRENT_DATE для динамических дат
INSERT INTO schedules (id, film_id, daytime, hall, rows, seats, price) VALUES
-- Сеансы для фильма "Архитекторы общества" (id из Postman)
(
    '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    CURRENT_DATE + INTERVAL '1 day 10:30:00',  -- завтра 10:30
    'Зал 1',
    5,
    10,
    350
),
(
    'a4b5c6d7-e8f9-4a5b-9c8d-7e6f5a4b3c2d',
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    CURRENT_DATE + INTERVAL '2 days 14:15:00',  -- послезавтра 14:15
    'Зал 2',
    6,
    12,
    400
),
(
    'b5c6d7e8-f9a0-5b6c-8d9e-0f1a2b3c4d5e',
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    CURRENT_DATE + INTERVAL '3 days 19:00:00',  -- через 3 дня 19:00
    'Зал 3',
    4,
    8,
    300
),

-- Сеансы для фильма "Космическая одиссея 2099"
(
    '373452c8-e4c6-450a-a2ca-30d46a27e81e',
    '64145bb0-996a-4644-b351-af6dc1266514',
    CURRENT_DATE + INTERVAL '1 day 12:30:00',  -- завтра 12:30
    'Зал IMAX',
    8,
    15,
    600
),
(
    'c6d7e8f9-a0b1-6c7d-9e0f-1a2b3c4d5e6f',
    '64145bb0-996a-4644-b351-af6dc1266514',
    CURRENT_DATE + INTERVAL '2 days 16:45:00',  -- послезавтра 16:45
    'Зал IMAX',
    8,
    15,
    650
),
(
    'd7e8f9a0-b1c2-7d8e-0f1a-2b3c4d5e6f7a',
    '64145bb0-996a-4644-b351-af6dc1266514',
    CURRENT_DATE + INTERVAL '4 days 20:15:00',  -- через 4 дня 20:15
    'Зал IMAX',
    8,
    15,
    700
),

-- Сеансы для "Последний самурай"
(
    'e8f9a0b1-c2d3-8e9f-0a1b-2c3d4e5f6a7b',
    'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    CURRENT_DATE + INTERVAL '1 day 13:00:00',  -- завтра 13:00
    'Зал 4',
    7,
    10,
    380
),
(
    'f9a0b1c2-d3e4-9f0a-1b2c-3d4e5f6a7b8c',
    'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    CURRENT_DATE + INTERVAL '3 days 18:30:00',  -- через 3 дня 18:30
    'Зал 5',
    7,
    10,
    420
),

-- Сеансы для "Шестое чувство"
(
    '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    'b2c3d4e5-f6a7-5b6c-8d9e-0f1a2b3c4d5e',
    CURRENT_DATE + INTERVAL '2 days 21:00:00',  -- послезавтра 21:00
    'Зал 2',
    5,
    8,
    320
),
(
    '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'b2c3d4e5-f6a7-5b6c-8d9e-0f1a2b3c4d5e',
    CURRENT_DATE + INTERVAL '5 days 22:15:00',  -- через 5 дней 22:15
    'Зал 2',
    5,
    8,
    350
),

-- Сеансы для "Гладиатор"
(
    '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'c3d4e5f6-a7b8-6c7d-9e0f-1a2b3c4d5e6f',
    CURRENT_DATE + INTERVAL '1 day 15:45:00',  -- завтра 15:45
    'Зал 1',
    6,
    12,
    450
),
(
    '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    'c3d4e5f6-a7b8-6c7d-9e0f-1a2b3c4d5e6f',
    CURRENT_DATE + INTERVAL '4 days 19:30:00',  -- через 4 дня 19:30
    'Зал 3',
    6,
    10,
    480
);