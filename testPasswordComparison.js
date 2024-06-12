const bcrypt = require('bcryptjs');

const plainPassword = '123';
const hashedPassword = '$2a$10$EbpnQe8Er8Q4cIh19Cdw7ud7qVYdqYgYrhilu5YWkdjljL0iZKEPC'; // Hash da sua senha armazenada

console.log('Senha fornecida (plain text):', plainPassword);
console.log('Senha armazenada (hashed):', hashedPassword);

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) throw err;
  console.log('Comparação manual de senha:', isMatch);
});
