function templateCreateAccount(user) {
  return {
    to: user.email,
    subject: "Bienvenid@ a la comunidad Fix Hogar",
    html: `
      <h1>Hola ${user.name}!</h1>
      <p>Te damos la bienvenida a Fix Hogar.</p>
    `,
  };
}

module.exports = templateCreateAccount;
