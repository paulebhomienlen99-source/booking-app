import bcrypt from "bcrypt";

const hash = await bcrypt.hash("password", 12);

console.log(hash);