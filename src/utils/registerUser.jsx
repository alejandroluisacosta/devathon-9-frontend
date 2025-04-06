export const registerUser = async () => {
    const storedPlayer = JSON.parse(localStorage.getItem("playerInfo"));
    const token = localStorage.getItem("tokenId");
  
    if (token) {
      try {
        const response = await fetch("http://localhost:80/app/register-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token_id: token,
          },
          body: JSON.stringify({
            name: storedPlayer.name,
            house: storedPlayer.house,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setPlayerData({ ...data, token });
        } else {
          console.error("Failed to register user");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      console.log("No token found. No player to register.");
    }
  };
  