export const sendPlayerDataToServer = async (playerData) => {
  const tokenId = localStorage.getItem("tokenId");
  const headers = {
    "Content-Type": "application/json",
    ...(tokenId && { token_id: tokenId }),
  };

  try {
    const response = await fetch("http://localhost:80/app/token-id", {
      method: "POST",
      headers,
      body: JSON.stringify(playerData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.tokenId;
  } catch (error) {
    console.error("Failed to send player data:", error);
    return null;
  }
};

  