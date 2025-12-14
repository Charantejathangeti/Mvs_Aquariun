import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, ShippingDetails, Order } from '../../../../types';
import { calculateShipping, formatCurrency } from '../../../../utils/shipping';
import { OrderService } from '../../../../services/mockBackend';
import { MessageCircle } from 'lucide-react';

interface CheckoutFormProps {
  cartItems: CartItem[];
  clearCart: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingDetails>({
    customerName: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    phone: ''
  });

  const { cost: shippingCost } = calculateShipping(cartItems);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      shippingDetails: formData,
      totalAmount,
      shippingCost,
      status: 'PENDING_WHATSAPP',
      createdAt: new Date().toISOString()
    };

    // 1. Log Order to DB
    await OrderService.create(order);

    // 2. Construct WhatsApp Payload
    const itemsList = cartItems.map(i => `- ${i.name} (x${i.quantity})`).join('\n');
    const message = `
*NEW ORDER: ${order.id}*
------------------------
*Customer:* ${formData.customerName}
*Phone:* ${formData.phone}
*Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}
------------------------
*Items:*
${itemsList}
------------------------
Subtotal: ${formatCurrency(subtotal)}
Shipping: ${formatCurrency(shippingCost)}
*TOTAL TO PAY: ${formatCurrency(totalAmount)}*
------------------------
_Please confirm payment details._
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/916302382280?text=${encodedMessage}`;

    // 3. Clear Cart & Redirect Logic
    clearCart();
    // In a real app, we might redirect to a 'success' intermediate page which then auto-opens WhatsApp
    // For this prompt, we navigate to success page which handles the link.
    // Actually, prompt says "Confirm Button logs... then immediately triggers redirect".
    // To provide a good UX, we will open WhatsApp in new tab AND go to success page.
    
    window.open(whatsappUrl, '_blank');
    navigate('/cart/checkout/success');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border-t-4 border-coralPop">
      <h2 className="text-2xl font-bold text-deepSea mb-6 flex items-center gap-2">
        <MessageCircle className="text-green-500" /> WhatsApp Checkout
      </h2>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> We currently only ship to <strong>Telangana</strong> and <strong>Andhra Pradesh</strong>.
          Payment will be coordinated via WhatsApp after order confirmation.
        </p>
      </div>

      <form onSubmit={handleConfirmOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
          <input required name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-deepSea outline-none" placeholder="John Doe" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number (WhatsApp)</label>
          <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-deepSea outline-none" placeholder="+91 99999 99999" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Complete Address</label>
          <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-deepSea outline-none" rows={3} placeholder="H.No, Street, Area" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
            <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full border p-2 rounded outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
            <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border p-2 rounded outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
          <select name="state" value={formData.state} onChange={handleInputChange} className="w-full border p-2 rounded outline-none bg-white">
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center text-xl font-bold text-deepSea mb-6">
             <span>Total Payable</span>
             <span>{formatCurrency(totalAmount)}</span>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 text-lg transition-transform transform active:scale-95"
          >
            {loading ? 'Processing...' : 'Confirm Order on WhatsApp'}
            {!loading && <MessageCircle size={24} />}
          </button>
        </div>
      </form>
    </div>
  );
};