import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { generateStockAnalysis } from '../services/geminiService';

interface GeminiAdvisorProps {
  products: Product[];
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ products }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await generateStockAnalysis(products);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-300" />
            Asistente Inteligente
        </h2>
        <p className="opacity-90">
            Utiliza la IA de Google Gemini para analizar tu inventario y recibir consejos sobre qué reponer o cómo optimizar tu stock.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
        {!advice && !loading && (
            <div className="flex flex-col items-center justify-center h-full py-10">
                <p className="text-gray-500 mb-6 text-center max-w-md">
                    Haz clic en el botón para generar un reporte breve sobre el estado de tu inventario actual.
                </p>
                <button 
                    onClick={handleAnalyze}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
                >
                    <Sparkles size={18} />
                    Analizar mi Stock
                </button>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center h-full py-20">
                <RefreshCw className="animate-spin text-indigo-600 mb-4" size={32} />
                <p className="text-gray-600 animate-pulse">Consultando con la IA...</p>
            </div>
        )}

        {advice && !loading && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Reporte de Análisis</h3>
                    <button 
                        onClick={handleAnalyze} 
                        className="text-indigo-600 text-sm hover:underline flex items-center gap-1"
                    >
                        <RefreshCw size={14} /> Actualizar
                    </button>
                </div>
                <div className="prose text-gray-700 leading-relaxed whitespace-pre-line">
                    {advice}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
