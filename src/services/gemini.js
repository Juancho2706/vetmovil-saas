export const callGeminiAPI = async (prompt) => {
    const apiKey = ""; // Provided by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    // Retry logic with exponential backoff
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i <= delays.length; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta.";
        } catch (error) {
            if (i === delays.length) {
                console.error("Gemini API failed after retries:", error);
                return "Lo sentimos, el asistente de IA no está disponible en este momento.";
            }
            await new Promise(resolve => setTimeout(resolve, delays[i]));
        }
    }
};
