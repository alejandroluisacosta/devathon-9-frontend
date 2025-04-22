export const registerUser = async (playerData, sendMessage, updateSessionId) => {
  try {
    const { name, house, sessionId } = playerData;

    sendMessage('/app/register-user', { name, house });

    updateSessionId(sessionId);

    console.log(`👥 El mago ${name} está listo para el combate`);
  } catch (err) {
    console.error('Failed to register user via STOMP:', err);
  }
};
