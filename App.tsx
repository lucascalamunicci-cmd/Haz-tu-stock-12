import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingCart, Sparkles, Wine } from 'lucide-react';
import { Inventory } from './components/Inventory';
import { Suppliers } from './components/Suppliers';
import { OrderManager } from './components/OrderManager';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { Product, Supplier, UnitOfMeasure } from './types';

type Tab = 'inventory' | 'suppliers' | 'orders' | 'ai';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  
  // Full inventory data provided by user
  const [products, setProducts] = useState<Product[]>([
    // --- Cervezas y Refrescos (Parte 1) ---
    { id: 'c1', name: 'Pepsi', quantity: 5, maxCapacity: 24, unit: UnitOfMeasure.UNITS, minStockAlert: 6 },
    { id: 'c2', name: '7up', quantity: 2, maxCapacity: 24, unit: UnitOfMeasure.UNITS, minStockAlert: 6 },
    { id: 'c3', name: 'Tónica', quantity: 3, maxCapacity: 24, unit: UnitOfMeasure.UNITS, minStockAlert: 6 },
    { id: 'c4', name: 'Cerveza Heineken', quantity: 26, maxCapacity: 48, unit: UnitOfMeasure.BOTTLES, minStockAlert: 12 },
    { id: 'c5', name: 'Cerveza Corona', quantity: 0, maxCapacity: 48, unit: UnitOfMeasure.BOTTLES, minStockAlert: 12 },

    // --- Aperitivos ---
    { id: 'ap1', name: 'Chuches', quantity: 0, maxCapacity: 10, unit: UnitOfMeasure.UNITS, minStockAlert: 2 },
    { id: 'ap2', name: 'Frutos Secos', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.CASES, minStockAlert: 1 },
    { id: 'ap3', name: 'Patatas Varias', quantity: 0, maxCapacity: 10, unit: UnitOfMeasure.UNITS, minStockAlert: 2 },

    // --- RON ---
    { id: 'r1', name: 'Ron Barceló', quantity: 8, maxCapacity: 12, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'r2', name: 'Havana Club 7', quantity: 3, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r3', name: 'Ron Brugal', quantity: 4, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r4', name: 'Overproof', quantity: 3, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'r5', name: 'Ron Cacique', quantity: 2, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r6', name: 'Santa Teresa', quantity: 10, maxCapacity: 12, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'r7', name: 'Ron Legendario', quantity: 2, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r8', name: 'Diplomático Reserva', quantity: 2, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r9', name: 'Havana Club 3', quantity: 2, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r10', name: 'Bacardí', quantity: 3, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'r11', name: 'Apache', quantity: 6, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },

    // --- GINEBRA ---
    { id: 'g1', name: 'Beefeater', quantity: 5, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'g2', name: 'Puerto de Indias', quantity: 5, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'g3', name: 'Puerto de Indias 0,0', quantity: 2, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'g4', name: 'Tanqueray', quantity: 8, maxCapacity: 12, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'g5', name: 'Tanqueray 0,0', quantity: 3, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'g6', name: 'Bombay Sapphire', quantity: 5, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'g7', name: 'Seagram\'s', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'g8', name: 'Hendrick\'s', quantity: 3, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'g9', name: 'Martin Miller\'s', quantity: 4, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'g10', name: 'G\'Vine', quantity: 4, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },

    // --- VODKA ---
    { id: 'v1', name: 'Moskovskaya', quantity: 6, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'v2', name: 'Grey Goose', quantity: 5, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'v3', name: 'Cîroc', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'v4', name: 'Smirnoff', quantity: 1, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },

    // --- WHISKY ---
    { id: 'w1', name: 'Johnnie Walker Black Label', quantity: 13, maxCapacity: 18, unit: UnitOfMeasure.BOTTLES, minStockAlert: 4 },
    { id: 'w2', name: 'Johnnie Walker Red Label', quantity: 14, maxCapacity: 18, unit: UnitOfMeasure.BOTTLES, minStockAlert: 4 },
    { id: 'w3', name: 'Ballantine\'s', quantity: 3, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'w4', name: 'Jack Daniel\'s', quantity: 4, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'w5', name: 'Bourbon', quantity: 3, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'w6', name: 'Jameson', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'w7', name: 'Lagavulin', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'w8', name: 'Buchanan\'s', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'w9', name: 'Old Parr', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'w10', name: 'J&B', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },

    // --- TEQUILA ---
    { id: 't1', name: 'Penca', quantity: 6, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 't2', name: 'Penca Alma', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 't3', name: 'José Cuervo Reposado', quantity: 3, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 't4', name: 'José Cuervo Silver', quantity: 5, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 't5', name: 'Don Julio Silver', quantity: 3, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 't6', name: 'Don Julio Reposado', quantity: 0, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 't7', name: '1800 Reposado', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 't8', name: '1800 Silver', quantity: 1, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 't9', name: 'Tequila Fresa', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 't10', name: 'Tequila Mango', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 't11', name: 'Aguardiente Amarillo', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 't12', name: 'Aguardiente', quantity: 0, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },

    // --- LICORES ---
    { id: 'l1', name: 'Fireball', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l2', name: 'Jack Daniel\'s Canela', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l3', name: 'Jägermeister', quantity: 6, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 'l4', name: 'Campari', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l5', name: 'Aperol', quantity: 1, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'l6', name: 'Licor Mora', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l7', name: 'Martini Blanco', quantity: 1, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l8', name: 'Pisco', quantity: 3, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l9', name: 'Baileys', quantity: 0, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'l10', name: 'Licor de Hierbas', quantity: 1, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l11', name: 'Malibú', quantity: 3, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l12', name: 'Bols Triple Sec', quantity: 2, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l13', name: 'Bols Banana', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'l14', name: 'Bols Blue Curacao', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },

    // --- PURÉS ---
    { id: 'p1', name: 'Puré Mango', quantity: 5, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'p2', name: 'Puré Fresa', quantity: 2, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'p3', name: 'Puré Fruta Pasión', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'p4', name: 'Puré Banana', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'p5', name: 'Puré Frambuesa', quantity: 0, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'p6', name: 'Puré Coco', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },

    // --- SIROPES ---
    { id: 's1', name: 'Sirope Coco', quantity: 9, maxCapacity: 12, unit: UnitOfMeasure.BOTTLES, minStockAlert: 3 },
    { id: 's2', name: 'Sirope Miel', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 's3', name: 'Sirope Granadina', quantity: 5, maxCapacity: 8, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 's4', name: 'Sirope Manzana Verde', quantity: 4, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 's5', name: 'Sirope Cactus', quantity: 2, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 's6', name: 'Sirope Canela', quantity: 1, maxCapacity: 4, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 's7', name: 'Sirope Vainilla', quantity: 2, maxCapacity: 5, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 's8', name: 'Sirope Jazmín', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 's9', name: 'Sirope Palomitas', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 's10', name: 'Licor Manzana (Sirope)', quantity: 1, maxCapacity: 3, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },

    // --- REFRESCOS EXTRA & ZUMOS ---
    { id: 'rx1', name: 'Red Bull', quantity: 1, maxCapacity: 10, unit: UnitOfMeasure.CASES, minStockAlert: 2 },
    { id: 'rx2', name: 'Ginger Beer', quantity: 4, maxCapacity: 8, unit: UnitOfMeasure.CASES, minStockAlert: 2 },
    { id: 'rx3', name: 'Agua con Gas', quantity: 3, maxCapacity: 10, unit: UnitOfMeasure.CASES, minStockAlert: 2 },
    { id: 'rx4', name: 'Agua Normal', quantity: 2, maxCapacity: 10, unit: UnitOfMeasure.CASES, minStockAlert: 2 },
    { id: 'z1', name: 'Zumo Naranja', quantity: 3, maxCapacity: 10, unit: UnitOfMeasure.BOTTLES, minStockAlert: 2 },
    { id: 'z2', name: 'Zumo Piña', quantity: 0.5, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
    { id: 'z3', name: 'Zumo Melocotón', quantity: 2, maxCapacity: 6, unit: UnitOfMeasure.BOTTLES, minStockAlert: 1 },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { 
        id: '1', 
        name: 'Distribuidora General', 
        phone: '34600000000', 
        description: 'Refrescos y Varios',
        productIds: [] 
    },
    { 
        id: '2', 
        name: 'Licores Premium', 
        phone: '34600000000', 
        description: 'Alcohol y Espirituosas',
        productIds: [] 
    },
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} />;
      case 'suppliers':
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} products={products} />;
      case 'orders':
        return <OrderManager suppliers={suppliers} products={products} />;
      case 'ai':
        return <GeminiAdvisor products={products} />;
      default:
        return <Inventory products={products} setProducts={setProducts} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <nav className="bg-slate-800 w-full md:w-64 border-r border-slate-700 flex-shrink-0 md:h-screen sticky top-0 z-10 shadow-lg md:shadow-none">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
             <Wine className="text-amber-500" size={28} />
             <h1 className="text-2xl font-extrabold text-white tracking-tight">Haz Tu Stock</h1>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Bar Manager</p>
        </div>
        
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible px-4 md:px-0">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-3 px-6 py-4 w-full text-left transition-colors whitespace-nowrap border-l-4 md:border-l-0 md:border-r-4
              ${activeTab === 'inventory' ? 'bg-slate-700 text-amber-400 border-amber-400' : 'text-slate-400 border-transparent hover:bg-slate-750 hover:text-slate-200'}
            `}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Barra & Stock</span>
          </button>

          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-3 px-6 py-4 w-full text-left transition-colors whitespace-nowrap border-l-4 md:border-l-0 md:border-r-4
              ${activeTab === 'suppliers' ? 'bg-slate-700 text-purple-400 border-purple-400' : 'text-slate-400 border-transparent hover:bg-slate-750 hover:text-slate-200'}
            `}
          >
            <Users size={20} />
            <span className="font-medium">Proveedores</span>
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-6 py-4 w-full text-left transition-colors whitespace-nowrap border-l-4 md:border-l-0 md:border-r-4
              ${activeTab === 'orders' ? 'bg-slate-700 text-green-400 border-green-400' : 'text-slate-400 border-transparent hover:bg-slate-750 hover:text-slate-200'}
            `}
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Hacer Pedido</span>
          </button>

          <div className="md:mt-4 md:pt-4 md:border-t border-slate-700">
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-3 px-6 py-4 w-full text-left transition-colors whitespace-nowrap border-l-4 md:border-l-0 md:border-r-4
                ${activeTab === 'ai' ? 'bg-slate-700 text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:bg-slate-750 hover:text-slate-200'}
                `}
            >
                <Sparkles size={20} />
                <span className="font-medium">Bar Manager IA</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-900 text-slate-200">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;