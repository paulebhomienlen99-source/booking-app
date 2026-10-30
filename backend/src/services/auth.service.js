export const loginUser = async ({
  email,
  password,
}) => {
  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!user.rows.length) {
    return { error: "User not found" };
  }

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  if (!valid) {
    return { error: "Invalid password" };
  }

  return {
    id: user.rows[0].id,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
};