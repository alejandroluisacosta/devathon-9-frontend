export const sendPlayerDataToServer = async playerData => {
  try {
    // Log for now, replace with real API request when ready
    console.log('Sending player data to server: ', playerData);

    // Example API request (when backend is ready)
    // await fetch('https://your-backend-url.com/endpoint', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(playerData),
    // });
  } catch (error) {
    console.error('Error sending player data to server:', error);
  }
};
