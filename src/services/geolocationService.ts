import axios from "axios";

export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
      });
    } else {
      reject(
        new Error("La geolocalización no es soportada por este navegador.")
      );
    }
  });
};

export const sendLocationData = async (
  position: GeolocationPosition
): Promise<void> => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const agent = navigator.userAgent;
  const url = import.meta.env.VITE_BACKEND_URL + "/send";

  try {
    const response = await axios.get(url, {
      params: {
        lat,
        long: lon,
        agent,
      },
    });
  } catch (error) {
    console.error("Error al enviar los datos:", error);
  }
};
