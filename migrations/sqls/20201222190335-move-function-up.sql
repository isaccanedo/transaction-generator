CREATE OR REPLACE FUNCTION move(_address1 TEXT, _address2 TEXT, _amount BIGINT, _step BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $func$

BEGIN
  UPDATE accounts
  SET amount = amount - _amount
  WHERE address = _address1
    AND amount >= _amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough money in %', _address1;
  ELSE
    UPDATE accounts
    SET amount = amount + _amount,
      step = _step
    WHERE address = _address2;

    IF FOUND THEN
      RETURN TRUE;
    ELSE
      INSERT INTO accounts
        (step, address, amount)
      VALUES
        (_step, _address2, _amount);
      RETURN TRUE;
    END IF;
  END IF;
END;
$func$;
