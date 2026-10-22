export const loginUser = async ({ email, password }) => {
  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!user.rows.length) {
    console.log("USER NOT FOUND");
    return { error: "User not found" };
  }

  console.log("EMAIL:", email);
  console.log("PASSWORD INSERTED:", password);
  console.log("HASH IN DB:", user.rows[0].password);

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  console.log("VALID PASSWORD:", valid);

  if (!valid) {
    return { error: "Invalid password" };
  }

  return {
    id: user.rows[0].id,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
};
