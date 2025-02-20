import axios from "axios";

// Función que devuelve una promesa con la posición del usuario.
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

// Función para enviar la información de geolocalización al backend.
export const sendLocationData = async (
  position: GeolocationPosition
): Promise<void> => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const agent = navigator.userAgent;
  const url = "https://seguridad-flask.onrender.com/send";

  try {
    const response = await axios.get(url, {
      params: {
        lat,
        long: lon,
        agent,
      },
    });
    console.log("Datos enviados correctamente:", response.data);
  } catch (error) {
    console.error("Error al enviar los datos:", error);
  }
};
