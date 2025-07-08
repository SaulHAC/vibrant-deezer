const express = require("express");
const axios = require("axios");
const Vibrant = require("node-vibrant");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/color-from-url", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: "Parámetro 'imageUrl' requerido" });
  }

  try {
    // Descargar imagen como buffer
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Obtener color dominante
    const palette = await Vibrant.from(buffer).getPalette();
    const dominant = palette.Vibrant?.rgb || [0, 0, 0];

    res.json({ dominantColor: dominant });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
