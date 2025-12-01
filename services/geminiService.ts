
import { GoogleGenAI } from "@google/genai";
import { AutopsyReport, TrafficViolation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAutopsySummary = async (report: AutopsyReport): Promise<string> => {
  if (!process.env.API_KEY) return "API Key fehlt. Bericht kann nicht generiert werden.";

  try {
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
    return "Fehler bei der Generierung des Berichts.";
  }
};

export const generateBlitzerImage = async (violation: TrafficViolation): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;

  try {
    const prompt = `
      Erstelle ein realistisches Schwarz-Weiß-Foto einer Verkehrsüberwachungskamera (Blitzer).
      Das Bild zeigt einen ${violation.vehicleModel} von vorne.
      Das Nummernschild ${violation.licensePlate} sollte erkennbar sein.
      Das Bild sollte authentisch wirken: leichtes Rauschen, typischer Winkel einer Radarkamera, hoher Kontrast.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // Adding config specifically helps avoid some server-side 500 errors by being explicit
        responseMimeType: 'application/json' 
      }
    });

    // Handle both inline data and image result formats if they vary
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating blitzer image:", error);
    // Return undefined instead of throwing to prevent app crash
    return undefined;
  }
};
