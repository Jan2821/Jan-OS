import { GoogleGenAI } from "@google/genai";
import { AutopsyReport, TrafficViolation } from "../types";

// Remove top-level initialization to prevent runtime crash if env var is missing at load time
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

export const generateAutopsySummary = async (report: AutopsyReport): Promise<string> => {
  // Check inside the function
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "API Key fehlt. Bitte in Vercel Environment Variables konfigurieren.";
  }

  try {
    // Initialize here
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Verfasse einen formalen, gerichtsmedizinischen Zusammenfassungsbericht (auf Deutsch) basierend auf folgenden Daten:
      Name des Verstorbenen: ${report.deceasedName}
      Todeszeitpunkt: ${report.dateOfDeath}
      Todesursache: ${report.causeOfDeath}
      Äußere Verletzungen: ${report.externalInjuries}
      Innere Befunde: ${report.internalFindings}
      Toxikologie: ${report.toxicology}
      Notizen des Untersuchers: ${report.examinerNotes}

      Der Bericht sollte sachlich, präzise und professionell formuliert sein, passend für eine Polizeiakte.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keine Zusammenfassung generiert.";
  } catch (error) {
    console.error("Error generating autopsy summary:", error);
    return "Fehler bei der Generierung des Berichts. Bitte API Key prüfen.";
  }
};

export const generateBlitzerImage = async (violation: TrafficViolation): Promise<string | undefined> => {
  if (!process.env.API_KEY) {
     console.error("API Key is missing for image generation");
     return undefined;
  }

  try {
    // Initialize here
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Erstelle ein realistisches Schwarz-Weiß-Foto einer Verkehrsüberwachungskamera (Blitzer).
      Das Bild zeigt einen ${violation.vehicleModel} von vorne.
      Das Nummernschild ${violation.licensePlate} sollte erkennbar sein.
      Das Bild sollte authentisch wirken: leichtes Rauschen, typischer Winkel einer Radarkamera, hoher Kontrast.
    `;

    // Ensure we catch specific API errors for images
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      // Note: responseMimeType is not supported for this model, do not add it.
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating blitzer image:", error);
    return undefined;
  }
};