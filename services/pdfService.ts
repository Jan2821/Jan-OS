
export const downloadPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    alert("Fehler: Dokument für PDF-Erstellung nicht gefunden.");
    return;
  }

  // Visual feedback - change cursor to wait
  const originalCursor = document.body.style.cursor;
  document.body.style.cursor = 'wait';

  const opt = {
    margin: 0, 
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        // Removed letterRendering: true as it causes IndexSizeError on some text rendering
        scrollY: 0, 
        windowWidth: 1200, 
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (typeof window.html2pdf === 'undefined') {
    document.body.style.cursor = originalCursor;
    alert('PDF System lädt noch. Bitte 2 Sekunden warten und erneut versuchen.');
    return;
  }

  try {
    // Await the promise chain
    await window.html2pdf().set(opt).from(element).save();
  } catch (e) {
    console.error("PDF Generation Error:", e);
    alert("Fehler beim Erstellen der PDF-Datei.");
  } finally {
    // Reset cursor
    document.body.style.cursor = originalCursor;
  }
};
