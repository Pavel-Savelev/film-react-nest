-- Подключаемся к созданной базе
\c films_project;

-- Включаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблицы films
CREATE TABLE films (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    about TEXT,
    description TEXT,
    director VARCHAR(255),
    rating DECIMAL(3, 1),
    release_date DATE,
    tags TEXT[],
    image VARCHAR(500),
    cover VARCHAR(500),
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы schedules (расписание)
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    film_id UUID NOT NULL,
    daytime TIMESTAMP NOT NULL,
    hall VARCHAR(50) NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_schedules_film FOREIGN KEY (film_id) 
        REFERENCES films(id) ON DELETE CASCADE
);

-- Создание таблицы bookings (забронированные места)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL,
    row INTEGER NOT NULL,
    seat INTEGER NOT NULL,
    customer_name VARCHAR(255),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bookings_schedule FOREIGN KEY (schedule_id) 
        REFERENCES schedules(id) ON DELETE CASCADE,
    
    CONSTRAINT unique_seat_per_schedule UNIQUE (schedule_id, row, seat)
);

-- Создание таблицы orders (заказы)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_ids UUID[],
    total_amount DECIMAL(10, 2) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed'
);

-- Создание индексов для ускорения поиска
CREATE INDEX idx_schedules_film_id ON schedules(film_id);
CREATE INDEX idx_schedules_daytime ON schedules(daytime);
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX idx_films_release_date ON films(release_date);