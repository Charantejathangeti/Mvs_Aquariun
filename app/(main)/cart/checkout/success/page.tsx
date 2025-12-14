import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Truck, Info, QrCode, ArrowLeft } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>
        
        <h1 className="text-3xl font-bold text-deepSea mb-2">Order Initiated!</h1>
        <p className="text-gray-600 mb-8">
          You should have been redirected to WhatsApp to send your order details. 
          If not, please contact <strong>+91 6302382280</strong> manually.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-bold text-deepSea flex items-center gap-2 mb-2">
              <Truck size={18} /> Dispatch Info
            </h3>
            <p className="text-sm text-gray-700">
              We dispatch orders every <strong>MONDAY</strong>. 
              Orders placed after Sunday noon will be shipped the following week.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-deepSea flex items-center gap-2 mb-2">
              <Info size={18} /> Tracking
            </h3>
            <p className="text-sm text-gray-700">
              Tracking details will be shared via WhatsApp. You can track your package at:
              <a href="https://www.tpcindia.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block mt-1">
                tpcindia.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t pt-6 mb-8">
          <h3 className="font-bold text-deepSea mb-4">Payment Instructions</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2 text-gray-400">
              <QrCode size={48} />
            </div>
            <p className="text-xs text-gray-500">Scan QR or Pay to +91 6302382280</p>
            <p className="text-sm font-semibold text-coralPop mt-2">
              Please send the screenshot of payment on WhatsApp.
            </p>
          </div>
        </div>

        <div className="border-t pt-8">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-deepSea text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
          >
            <ArrowLeft size={20} />
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};