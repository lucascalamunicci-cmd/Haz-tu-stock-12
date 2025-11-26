import React, { useState, useMemo } from 'react';
import { ShoppingCart, Send, Plus, Minus, Filter, Globe, Share2, FileDown, Trash2, X } from 'lucide-react';
import { Supplier, Product, CartItem } from '../types';
import { draftOrderMessage } from '../services/geminiService';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

interface OrderManagerProps {
  suppliers: Supplier[];
  products: Product[];
}

export const OrderManager: React.FC<OrderManagerProps> = ({ suppliers, products }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const isGeneralOrder = selectedSupplierId === 'general';

  const selectedSupplier = useMemo(() => 
    suppliers.find(s => s.id === selectedSupplierId), 
  [selectedSupplierId, suppliers]);

  const availableProducts = useMemo(() => {
      if (isGeneralOrder) return products;
      if (!selectedSupplier) return [];
      
      if (!selectedSupplier.productIds || selectedSupplier.productIds.length === 0) {
          return products; 
      }
      return products.filter(p => selectedSupplier.productIds.includes(p.id));
  }, [selectedSupplier, products, isGeneralOrder]);

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev;
      }
      return [...prev, { productId, orderQuantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, orderQuantity: newQty };
      }
      return item;
    }));
  };

  const generateAndSharePDF = async () => {
    try {
        const doc = new jsPDF();
        
        const date = new Date().toLocaleDateString('es-ES');
        const time = new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});

        // Header Styling
        doc.setFillColor(15, 23, 42); // Slate 900
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Haz Tu Stock', 14, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(200, 200, 200);
        doc.text('Gestión de Barra & Pedidos', 14, 26);

        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text(`Fecha: ${date} - Hora: ${time}`, 200, 20, { align: 'right' });
        doc.text('Lista de Pedido General', 200, 26, { align: 'right' });

        // Table Data preparation
        const tableData = cart.map(item => {
            const p = products.find(prod => prod.id === item.productId);
            return [
                p?.name || 'Producto Desconocido',
                item.orderQuantity,
                p?.unit || 'u.'
            ];
        });

        // Smart Responsive Table
        try {
            if (typeof autoTable === 'function') {
                autoTable(doc, {
                    head: [['PRODUCTO', 'CANTIDAD', 'UNIDAD']],
                    body: tableData,
                    startY: 45,
                    theme: 'grid',
                    headStyles: { 
                        fillColor: [245, 158, 11], // Amber 500
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    bodyStyles: {
                        textColor: [51, 65, 85], // Slate 700
                    },
                    alternateRowStyles: {
                        fillColor: [248, 250, 252] // Slate 50
                    },
                    styles: { 
                        fontSize: 11, 
                        cellPadding: 5,
                        valign: 'middle',
                        overflow: 'linebreak', // Crucial for responsive text wrapping
                        lineColor: [203, 213, 225]
                    },
                    columnStyles: {
                        0: { 
                            cellWidth: 'auto', // Takes remaining space
                            halign: 'left',
                            fontStyle: 'bold'
                        }, 
                        1: { 
                            cellWidth: 35, // Fixed width for number
                            halign: 'center',
                            fontStyle: 'bold',
                            textColor: [15, 23, 42]
                        }, 
                        2: { 
                            cellWidth: 35, // Fixed width for unit
                            halign: 'left',
                            textColor: [100, 116, 139]
                        } 
                    },
                    margin: { top: 45, left: 14, right: 14 }
                });
            } else {
                 throw new Error("Plugin de tabla no disponible");
            }
        } catch (tableError) {
            console.warn("AutoTable failed, using text fallback", tableError);
            let y = 50;
            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            tableData.forEach(row => {
                doc.text(`${row[0]} -> ${row[1]} ${row[2]}`, 14, y);
                y += 10;
            });
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text('Generado con Haz Tu Stock App - Bar Management', 105, doc.internal.pageSize.height - 10, { align: 'center' });
        }

        const fileName = `Pedido_Barra_${Date.now()}.pdf`;

        // Check for Web Share API support with files
        // @ts-ignore
        if (navigator.canShare && navigator.share) {
            const pdfBlob = doc.output('blob');
            const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
            const shareData = {
                files: [pdfFile],
                title: 'Pedido de Barra',
                text: `Adjunto lista de compra del ${date}.`
            };

            // @ts-ignore
            if (navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                    setCart([]); // Success
                    return;
                } catch (shareError) {
                    console.warn('Share API failed or cancelled', shareError);
                }
            }
        }

        // Fallback: Download directly
        doc.save(fileName);
        setCart([]); // Clear cart
        alert('PDF Descargado. Puedes enviarlo manualmente por WhatsApp.');

    } catch (e: any) {
        console.error("Critical Error generating PDF", e);
        alert(`No se pudo generar el PDF. Error: ${e.message || 'Desconocido'}. Intenta recargar la página.`);
    }
  };

  const handleSendOrder = async () => {
    if (isGeneralOrder) {
        await generateAndSharePDF();
        return;
    }

    if (!selectedSupplier) return;

    let messageBody = '';
    
    if (process.env.API_KEY) {
        setIsGeneratingMessage(true);
        messageBody = await draftOrderMessage(selectedSupplier, cart, products);
        setIsGeneratingMessage(false);
    } 

    if (!messageBody) {
        const lines = cart.map(item => {
            const p = products.find(prod => prod.id === item.productId);
            return `- ${p?.name}: ${item.orderQuantity} ${p?.unit}`;
        });
        messageBody = `Hola ${selectedSupplier.name}, te paso el pedido de la semana:\n\n${lines.join('\n')}\n\nSaludos.`;
    }

    const encodedMessage = encodeURIComponent(messageBody);
    const url = `https://wa.me/${selectedSupplier.phone}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(url, '_blank');
    
    // Clear cart immediately after opening WhatsApp
    setTimeout(() => setCart([]), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingCart className="text-green-500" />
            Armar Pedido
        </h2>
        
        <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-2">1. Selecciona el Destinatario</label>
            <div className="relative">
                <select 
                    className="w-full border border-slate-600 rounded-lg p-3 bg-slate-700 text-white focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                    value={selectedSupplierId}
                    onChange={(e) => {
                        setSelectedSupplierId(e.target.value);
                        setCart([]); // Clear cart on switch
                    }}
                >
                    <option value="">-- ¿A quién le pedimos? --</option>
                    <option value="general" className="font-bold text-amber-400">📋 PEDIDO GENERAL / LISTA DE COMPRAS</option>
                    <optgroup label="Proveedores Registrados">
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </optgroup>
                </select>
            </div>
        </div>

        {(selectedSupplier || isGeneralOrder) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Selection */}
                <div className="space-y-4 flex flex-col h-full">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-300">2. Productos Disponibles</h3>
                        {isGeneralOrder ? (
                            <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-900/20 px-2 py-1 rounded border border-amber-900/50">
                                <Globe size={12}/> Catálogo Completo
                            </span>
                        ) : (
                             <span className="text-xs text-green-400 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">
                                <Filter size={12}/> Filtrado por proveedor
                             </span>
                        )}
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto border border-slate-700 flex-grow scrollbar-thin scrollbar-thumb-slate-600">
                        {availableProducts.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <p>No hay productos disponibles.</p>
                            </div>
                         ) : (
                        availableProducts.map(product => {
                            const inCart = cart.find(c => c.productId === product.id);
                            const isLow = product.quantity <= product.minStockAlert;

                            return (
                                <div key={product.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-md shadow-sm mb-2 border border-slate-700/50 hover:border-slate-600 transition">
                                    <div className="min-w-0 flex-1 mr-3">
                                        <p className="font-medium text-slate-200 truncate">{product.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-500">{product.quantity} / {product.maxCapacity} {product.unit}</p>
                                            {isLow && <span className="text-[10px] text-red-400 font-bold border border-red-900/50 bg-red-900/20 px-1 rounded whitespace-nowrap">BAJO STOCK</span>}
                                        </div>
                                    </div>
                                    {!inCart ? (
                                        <button 
                                            onClick={() => addToCart(product.id)}
                                            className="text-green-400 bg-green-900/20 hover:bg-green-900/40 px-3 py-1 rounded-md text-sm font-medium transition border border-green-900/50 flex items-center gap-1 whitespace-nowrap"
                                        >
                                            <Plus size={14} /> <span className="hidden sm:inline">Agregar</span>
                                        </button>
                                    ) : (
                                        <span className="text-slate-500 text-sm font-medium bg-slate-700 px-2 py-1 rounded whitespace-nowrap">En lista</span>
                                    )}
                                </div>
                            );
                        }))}
                    </div>
                </div>

                {/* Cart & Actions */}
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-300">3. Resumen del Pedido</h3>
                        {cart.length > 0 && (
                            <button 
                                onClick={() => setCart([])}
                                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                                <Trash2 size={12} /> Limpiar
                            </button>
                        )}
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg border border-slate-700 flex-grow p-4 mb-4 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-slate-600">
                        {cart.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                Selecciona productos de la izquierda.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map(item => {
                                    const product = products.find(p => p.id === item.productId);
                                    if (!product) return null;
                                    return (
                                        <div key={item.productId} className="flex flex-wrap sm:flex-nowrap items-center justify-between bg-slate-800 p-3 rounded shadow-sm border border-slate-700 gap-2">
                                            <span className="font-medium text-slate-200 flex-1 min-w-0 break-words pr-2" title={product.name}>{product.name}</span>
                                            
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="flex items-center bg-slate-700 rounded-md border border-slate-600">
                                                    <button onClick={() => updateQuantity(item.productId, item.orderQuantity - 1)} className="p-2 hover:bg-slate-600 text-slate-300 rounded-l">
                                                        <Minus size={14} />
                                                    </button>
                                                    
                                                    <input 
                                                        type="number"
                                                        value={item.orderQuantity}
                                                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                                                        onFocus={(e) => e.target.select()}
                                                        className="w-12 text-center bg-transparent text-white font-mono text-sm focus:outline-none"
                                                    />

                                                    <button onClick={() => updateQuantity(item.productId, item.orderQuantity + 1)} className="p-2 hover:bg-slate-600 text-slate-300 rounded-r">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-300 p-2">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleSendOrder}
                        disabled={cart.length === 0 || isGeneratingMessage}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition shadow-lg
                            ${cart.length === 0 ? 'bg-slate-700 cursor-not-allowed text-slate-500' : isGeneralOrder ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40' : 'bg-green-600 hover:bg-green-500 shadow-green-900/40'}
                        `}
                    >
                        {isGeneratingMessage ? (
                            <span className="animate-pulse">Redactando...</span>
                        ) : (
                            <>
                                {isGeneralOrder ? <FileDown size={20} /> : <Send size={20} />}
                                {isGeneralOrder ? 'Compartir PDF / Descargar' : 'Enviar Pedido WhatsApp'}
                            </>
                        )}
                    </button>
                    {isGeneralOrder && cart.length > 0 && (
                        <p className="text-[10px] text-center text-slate-500 mt-2">Se generará un PDF ordenado para compartir.</p>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};