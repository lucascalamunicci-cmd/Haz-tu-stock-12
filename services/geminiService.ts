import { GoogleGenAI } from "@google/genai";
import { Product, Supplier, CartItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateStockAnalysis = async (products: Product[]): Promise<string> => {
  if (!apiKey) return "API Key no configurada.";

  const stockData = JSON.stringify(products);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Actúa como un Bar Manager experto y Mixólogo. Analiza el siguiente inventario de mi barra y dame 3 consejos breves.
      
      Considera:
      1. Stock crítico de espirituosas base (Gin, Vodka, Ron, Whisky).
      2. Balance entre mixers (tónicas, gaseosas) y alcohol.
      3. Sugiere un "Cóctel del Día" para mover stock que esté alto.
      
      Formato: Lista con viñetas, estilo directo y "con onda" de bartender profesional.
      Inventario: ${stockData}`,
    });
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error generating stock analysis:", error);
    return "Error al conectar con el asistente.";
  }
};

export const draftOrderMessage = async (
  supplier: Supplier, 
  items: CartItem[], 
  allProducts: Product[]
): Promise<string> => {
  if (!apiKey) return ""; // Fallback will be handled in UI

  const orderDetails = items.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return `${product?.name || 'Producto'}: ${item.orderQuantity} ${product?.unit}`;
  }).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escribe un mensaje de WhatsApp para pedir bebidas a un proveedor.
      Proveedor: ${supplier.name}
      Items: ${orderDetails}
      Rol: Soy el encargado de la barra.
      Estilo: Breve, profesional, como se habla en el rubro gastronómico. Sin saludos robóticos.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error drafting message:", error);
    return "";
  }
};