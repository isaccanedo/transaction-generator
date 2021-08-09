CREATE TABLE IF NOT EXISTS accounts (
  step    BIGINT        NOT NULL,
  address TEXT   UNIQUE NOT NULL,
  amount  BIGINT        NOT NULL
);
