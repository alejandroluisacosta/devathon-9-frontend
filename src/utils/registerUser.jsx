export const registerUser = async (playerData, sendMessage) => {
  try {
    const { name, house } = playerData;

    sendMessage('/app/register-user', { name, house });

    console.log(`👥 El mago ${name} está listo para el combate`);
  } catch (err) {
    console.error('Failed to register user via STOMP:', err);
  }
};
