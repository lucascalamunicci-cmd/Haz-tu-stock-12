import React, { useState } from 'react';
import { Users, Plus, Phone, Truck, Trash2, CheckSquare, Square, Wine, Edit2, X, Save } from 'lucide-react';
import { Supplier, Product } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  products: Product[];
}

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, setSuppliers, products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState: Omit<Supplier, 'id'> = {
    name: '',
    phone: '',
    description: '',
    productIds: []
  };

  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>(initialFormState);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setFormData({
        name: supplier.name,
        phone: supplier.phone,
        description: supplier.description,
        productIds: supplier.productIds
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) return;
    
    if (editingId) {
        setSuppliers(suppliers.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
        const supplier: Supplier = {
            ...formData,
            id: crypto.randomUUID()
        };
        setSuppliers([...suppliers, supplier]);
    }
    setIsModalOpen(false);
  };

  const toggleProductSelection = (productId: string) => {
    setFormData(prev => {
      const exists = prev.productIds.includes(productId);
      if (exists) {
        return { ...prev, productIds: prev.productIds.filter(id => id !== productId) };
      } else {
        return { ...prev, productIds: [...prev.productIds, productId] };
      }
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm('¿Eliminar proveedor?')) {
        setSuppliers(suppliers.filter(s => s.id !== id));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="text-purple-500" />
          Proveedores
        </h2>
        <button
          onClick={openAddModal}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition shadow-lg shadow-purple-900/50"
        >
          <Plus size={20} />
          Nuevo Proveedor
        </button>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl overflow-hidden animate-fade-in">
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">
                        {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre / Preventista</label>
                            <input
                                type="text"
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:ring-purple-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej. Distribuidora 'El Barril'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp (con código país)</label>
                            <input
                                type="tel"
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:ring-purple-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Ej. 5491122334455"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Rubro / Descripción</label>
                            <input
                                type="text"
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:ring-purple-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ej. Cerveza Artesanal, Importados..."
                            />
                        </div>
                    </div>

                    {/* Product Linking */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col h-full">
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Wine size={16} />
                            Asignar productos:
                        </label>
                        <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-600 max-h-[200px]">
                            {products.length === 0 ? (
                                <p className="text-xs text-slate-500">No hay productos en el inventario.</p>
                            ) : (
                                products.map(p => {
                                    const isSelected = formData.productIds.includes(p.id);
                                    return (
                                        <div 
                                            key={p.id} 
                                            onClick={() => toggleProductSelection(p.id)}
                                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition border ${isSelected ? 'bg-purple-900/30 border-purple-500/50' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                                        >
                                            {isSelected ? <CheckSquare size={18} className="text-purple-400" /> : <Square size={18} className="text-slate-500" />}
                                            <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-slate-400'}`}>{p.name}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-900/50 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancelar</button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md flex items-center gap-2"
                    >
                        <Save size={18} /> Guardar
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.length === 0 ? (
            <div className="col-span-full text-center p-8 text-slate-500 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                No tienes proveedores registrados.
            </div>
        ) : (
            suppliers.map((supplier) => (
            <div 
                key={supplier.id} 
                onClick={() => openEditModal(supplier)}
                className="bg-slate-800 p-5 rounded-xl shadow-md border border-slate-700 hover:border-purple-500/50 transition group relative cursor-pointer"
            >
                <button 
                    onClick={(e) => handleDelete(supplier.id, e)}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition z-10"
                >
                    <Trash2 size={18} />
                </button>
                
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition">{supplier.name}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-2 mt-2">
                            <Truck size={14} />
                            {supplier.description || 'Sin descripción'}
                        </p>
                        <p className="text-sm text-slate-400 flex items-center gap-2 mt-1 mb-3">
                            <Phone size={14} />
                            {supplier.phone}
                        </p>
                    </div>
                    <Edit2 size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition" />
                </div>

                {/* Product tags */}
                <div className="border-t border-slate-700 pt-3 mt-2">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Productos Asociados:</p>
                    <div className="flex flex-wrap gap-2">
                        {supplier.productIds && supplier.productIds.length > 0 ? (
                             supplier.productIds.map(pid => {
                                 const prod = products.find(p => p.id === pid);
                                 if (!prod) return null;
                                 return (
                                     <span key={pid} className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                         {prod.name}
                                     </span>
                                 );
                             })
                        ) : (
                            <span className="text-xs text-slate-600 italic">Ningún producto asignado.</span>
                        )}
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};