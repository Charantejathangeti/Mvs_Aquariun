
import React, { useEffect, useState } from 'react';
import { Product } from '../../../../types';
import { ProductService } from '../../../../services/mockBackend';
import { AuthService } from '../../../../services/authService';
import { Edit2, Trash2, Save, X, PlusCircle, Settings, Lock, Check } from 'lucide-react';
import { formatCurrency } from '../../../../utils/shipping';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  
  // Create State
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'Live Fish', price: 0, weight: 0, stockCount: 0
  });

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    ProductService.getAll().then(setProducts);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = async (id: string) => {
    await ProductService.update(id, editForm);
    setEditingId(null);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await ProductService.delete(id);
      loadProducts();
    }
  };

  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.price) return;
    await ProductService.add(newProduct as Omit<Product, 'id'>);
    setIsAdding(false);
    setNewProduct({ name: '', category: 'Live Fish', price: 0, weight: 0, stockCount: 0 });
    loadProducts();
  };

  const handleChangePassword = () => {
    if (newPassword.length < 4) {
      setPasswordMsg('Password too short');
      return;
    }
    AuthService.changePassword(newPassword);
    setPasswordMsg('Password Updated Successfully');
    setNewPassword('');
    setTimeout(() => {
      setPasswordMsg('');
      setShowSettings(false);
    }, 2000);
  };

  // Helper for Inline Edit Inputs
  const renderEditInput = (field: keyof Product, type: string = "text") => (
    <input
      type={type}
      value={editForm[field] as string | number}
      onChange={(e) => setEditForm({ ...editForm, [field]: type === "number" ? parseFloat(e.target.value) : e.target.value })}
      className="w-full border rounded px-2 py-1 text-sm"
    />
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-deepSea">Product Management</h2>
           <p className="text-gray-500 text-sm">Manage Live Fish & Supplies Inventory</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 border border-gray-300"
          >
            <Settings size={18} /> Settings
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 shadow-sm"
          >
            <PlusCircle size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* PASSWORD SETTINGS MODAL/AREA */}
      {showSettings && (
        <div className="bg-gray-800 text-white p-6 rounded-lg mb-6 shadow-xl border-l-4 border-coralPop animate-fade-in">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg"><Lock size={20} /> Admin Security</h3>
          <div className="flex flex-col md:flex-row gap-4 items-end">
             <div className="w-full md:w-1/3">
                <label className="block text-xs uppercase text-gray-400 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 rounded text-gray-900 focus:outline-none"
                  placeholder="Enter new password" 
                />
             </div>
             <button onClick={handleChangePassword} className="bg-coralPop hover:bg-red-500 text-white px-6 py-2 rounded font-bold">
               Update Password
             </button>
             {passwordMsg && <span className="text-green-400 font-bold flex items-center gap-1"><Check size={16}/> {passwordMsg}</span>}
          </div>
          <p className="text-xs text-gray-400 mt-2">Make sure to remember your new password. It is saved locally.</p>
        </div>
      )}

      {/* CREATE FORM */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded mb-6 border border-green-200 animate-fade-in">
          <h3 className="font-bold mb-3 text-green-800">Add New Item</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input placeholder="Name" className="border p-2 rounded" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <select className="border p-2 rounded" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
              <option>Live Fish</option>
              <option>Supplies</option>
            </select>
            <input type="number" placeholder="Price (₹)" className="border p-2 rounded" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
            <input type="number" placeholder="Stock" className="border p-2 rounded" value={newProduct.stockCount || ''} onChange={e => setNewProduct({...newProduct, stockCount: parseFloat(e.target.value)})} />
            <input type="number" placeholder="Weight (g)" className="border p-2 rounded" value={newProduct.weight || ''} onChange={e => setNewProduct({...newProduct, weight: parseFloat(e.target.value)})} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
            <button onClick={() => setIsAdding(false)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-deepSea text-white">
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price (₹)</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Weight (g)</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50 last:border-0">
                {editingId === product.id ? (
                  <>
                    <td className="p-3">{renderEditInput('name')}</td>
                    <td className="p-3">
                       <select 
                        value={editForm.category} 
                        onChange={e => setEditForm({...editForm, category: e.target.value as any})}
                        className="border rounded px-2 py-1 text-sm"
                       >
                         <option>Live Fish</option>
                         <option>Supplies</option>
                       </select>
                    </td>
                    <td className="p-3">{renderEditInput('price', 'number')}</td>
                    <td className="p-3">{renderEditInput('stockCount', 'number')}</td>
                    <td className="p-3">{renderEditInput('weight', 'number')}</td>
                    <td className="p-3 flex justify-end gap-2">
                      <button onClick={() => handleSave(product.id)} className="text-green-600 hover:text-green-800"><Save size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-medium text-gray-800">{product.name}</td>
                    <td className="p-3 text-sm text-gray-500">{product.category}</td>
                    <td className="p-3 text-deepSea font-bold">{formatCurrency(product.price)}</td>
                    <td className={`p-3 font-bold ${product.stockCount === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stockCount}
                    </td>
                    <td className="p-3 text-sm text-gray-600">{product.weight}g</td>
                    <td className="p-3 flex justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-200">
        <strong className="block mb-2">Dispatch Template (Copy & Paste):</strong>
        <p className="font-mono bg-white p-3 border rounded text-gray-600 select-all">
          "Hello {`{CustomerName}`}, your order {`{OrderID}`} has been dispatched via TPC. Track here: https://www.tpcindia.com/"
        </p>
      </div>
    </div>
  );
};
