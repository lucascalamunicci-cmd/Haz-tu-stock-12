import React, { useState } from 'react';
import { Plus, Trash2, Wine, Beer, GlassWater, X, Edit2, Save, Package, Search, MinusCircle, PlusCircle } from 'lucide-react';
import { Product, UnitOfMeasure } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Move CircularProgress outside the loop/component to avoid re-creation issues
const CircularProgress = ({ current, max, statusColor }: { current: number, max: number, statusColor: string }) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="#334155"
                    strokeWidth="4"
                    fill="transparent"
                />
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={statusColor}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            <span 
                className="absolute text-[10px] font-bold"
                style={{ color: statusColor }}
            >
                {Math.round(percentage)}%
            </span>
        </div>
    );
};

export const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialFormState: Omit<Product, 'id'> = {
    name: '',
    quantity: 0,
    maxCapacity: 10,
    unit: UnitOfMeasure.BOTTLES,
    minStockAlert: 3
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(initialFormState);

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({
        name: product.name,
        quantity: product.quantity,
        maxCapacity: product.maxCapacity,
        unit: product.unit,
        minStockAlert: product.minStockAlert
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
        // Edit existing
        setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } : p));
    } else {
        // Create new
        const product: Product = {
            ...formData,
            id: crypto.randomUUID(),
        };
        setProducts([...products, product]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    if(window.confirm('¿Estás seguro de eliminar esta bebida del inventario?')) {
        setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleQuickUpdate = (id: string, delta: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setProducts(prevProducts => prevProducts.map(p => {
          if (p.id === id) {
              const newQuantity = Math.max(0, p.quantity + delta); // Prevent negative
              // Handle decimals for things like liters or partial bottles if needed, keeping 2 decimals
              return { ...p, quantity: Number(newQuantity.toFixed(2)) };
          }
          return p;
      }));
  };

  // Helper to handle number input changes nicely (removes leading zeros)
  const handleNumberChange = (field: keyof typeof formData, value: string) => {
    const num = value === '' ? 0 : Number(value);
    setFormData({ ...formData, [field]: num });
  };

  const getIcon = (unit: UnitOfMeasure) => {
      switch (unit) {
          case UnitOfMeasure.KEGS: return <Beer size={18} className="text-amber-500"/>;
          case UnitOfMeasure.BOTTLES: return <Wine size={18} className="text-purple-400"/>;
          case UnitOfMeasure.SHOTS: return <GlassWater size={18} className="text-blue-400"/>;
          case UnitOfMeasure.GRAMS: 
          case UnitOfMeasure.KILOGRAMS:
            return <span className="text-xs font-bold text-slate-400">gr/kg</span>;
          case UnitOfMeasure.UNITS: return <Package size={18} className="text-emerald-400"/>;
          default: return <Wine size={18} className="text-slate-400"/>;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wine className="text-amber-500" />
          Stock de Barra
        </h2>
        
        <div className="flex w-full md:w-auto gap-3">
             {/* Search Input */}
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar bebida..." 
                    className="w-full md:w-64 bg-slate-800 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button
            onClick={openAddModal}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition shadow-lg shadow-amber-900/50 whitespace-nowrap"
            >
            <Plus size={20} />
            <span className="hidden md:inline">Nueva Bebida</span>
            <span className="md:hidden">Agregar</span>
            </button>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg overflow-hidden animate-fade-in">
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">
                        {editingId ? 'Editar Producto' : 'Agregar al Inventario'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Producto</label>
                        <input
                            type="text"
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Ron Havana Club 7 años"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Unidad de Medida</label>
                            <select
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value as UnitOfMeasure })}
                            >
                                {Object.values(UnitOfMeasure).map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Stock Actual</label>
                            <input
                                type="number"
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
                                value={formData.quantity || ''}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => handleNumberChange('quantity', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Capacidad Máxima (Ideal)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
                                value={formData.maxCapacity || ''}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => handleNumberChange('maxCapacity', e.target.value)}
                            />
                            <p className="text-[10px] text-slate-500 mt-1">¿Cuánto cabe en estantería?</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Alerta stock bajo</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
                                    value={formData.minStockAlert || ''}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleNumberChange('minStockAlert', e.target.value)}
                                />
                                <span className="text-slate-400 text-xs whitespace-nowrap">unidades</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">Avisar si hay MENOS de...</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-900/50 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancelar</button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 font-medium shadow-md flex items-center gap-2"
                    >
                        <Save size={18} /> Guardar
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {searchTerm ? (
                <>
                    <Search className="mx-auto mb-3 opacity-20" size={48} />
                    <p>No se encontraron bebidas con "{searchTerm}".</p>
                </>
            ) : (
                <>
                    <Beer className="mx-auto mb-3 opacity-20" size={48} />
                    <p>La barra está vacía. ¡Agrega tus primeras botellas!</p>
                </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/80 text-slate-400 font-medium border-b border-slate-700">
                <tr>
                  <th className="p-4">Bebida / Producto</th>
                  <th className="p-4 text-center">Cant.</th>
                  <th className="p-4">Estado (Ocupación)</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredProducts.map((product) => {
                   // --- LOGIC FOR TRAFFIC LIGHT SYSTEM ---
                   // Red: <= Min Alert (Critical)
                   // Yellow: > Min Alert BUT <= 40% of Max Capacity (Low/Warning)
                   // Green: > 40% (Good)
                   
                   let statusColor = '#10b981'; // Default Green (Emerald 500)
                   let statusText = 'STOCK OK';
                   let statusClass = 'text-emerald-500 font-medium';
                   const fillPercentage = (product.quantity / product.maxCapacity) * 100;

                   if (product.quantity <= product.minStockAlert) {
                       statusColor = '#ef4444'; // Red 500
                       statusText = 'REPONER';
                       // Make it bold and prominent red
                       statusClass = 'text-red-500 font-extrabold tracking-wider';
                   } else if (fillPercentage <= 40) {
                       statusColor = '#facc15'; // Yellow 400 (Brighter yellow)
                       statusText = 'STOCK BAJO';
                       // Make it distinct yellow
                       statusClass = 'text-yellow-400 font-bold';
                   }

                   return (
                    <tr 
                        key={product.id} 
                        onClick={() => openEditModal(product)}
                        className="hover:bg-slate-700/30 transition cursor-pointer group"
                    >
                        <td className="p-4 font-medium text-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-inner">
                                    {getIcon(product.unit)}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{product.name}</p>
                                    <p className="text-xs text-slate-500">Ideal: {product.maxCapacity} {product.unit}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 text-slate-300 text-center">
                            <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    onClick={(e) => handleQuickUpdate(product.id, -1, e)}
                                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition"
                                >
                                    <MinusCircle size={20} />
                                </button>
                                
                                <div className="flex flex-col items-center min-w-[3rem]">
                                    <span className={`font-bold text-xl ${product.quantity <= product.minStockAlert ? 'text-red-500' : 'text-slate-200'}`}>{product.quantity}</span> 
                                    <span className="text-[10px] text-slate-500">{product.unit}</span>
                                </div>

                                <button 
                                    onClick={(e) => handleQuickUpdate(product.id, 1, e)}
                                    className="p-1 text-slate-500 hover:text-green-400 hover:bg-slate-700 rounded transition"
                                >
                                    <PlusCircle size={20} />
                                </button>
                            </div>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <CircularProgress 
                                    current={product.quantity} 
                                    max={product.maxCapacity} 
                                    statusColor={statusColor} 
                                />
                                <div>
                                    <span className={`text-xs uppercase block ${statusClass}`}>
                                        {statusText}
                                    </span>
                                    <span className="text-[10px] text-slate-500">Min: {product.minStockAlert} {product.unit}</span>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
                                    className="text-slate-500 hover:text-amber-400 transition p-2 hover:bg-slate-700/50 rounded-full"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(product.id, e)}
                                    className="text-slate-500 hover:text-red-400 transition p-2 hover:bg-slate-700/50 rounded-full"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};