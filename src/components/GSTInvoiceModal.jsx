import React, { useRef } from 'react';
import { FileText, Printer, Download, Mail, X, ShieldCheck } from 'lucide-react';

export const GSTInvoiceModal = ({ isOpen, onClose, orderData }) => {
  const printRef = useRef(null);

  if (!isOpen || !orderData) return null;

  const items = orderData.items || [
    { title: 'KEVL 5W-30 Synthetic Engine Oil 3.5L', partNumber: 'KEVL-5W30-35', hsn: '2710', quantity: 1, price: 1499 },
    { title: 'Ceramic Front Brake Pads (Pair)', partNumber: 'BP-SWIFT-FR', hsn: '8708', quantity: 1, price: 999 }
  ];

  const totalAmount = orderData.totalAmount || items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxableAmount = Math.round(totalAmount / 1.18);
  const totalGst = totalAmount - taxableAmount;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  const invoiceNum = orderData.invoiceNumber || `AZI/INV/2026/${orderData.id || '8942'}`;
  const invoiceDate = orderData.date || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '', 'height=800,width=900');
    win.document.write('<html><head><title>GST Invoice - AutoZon India</title>');
    win.document.write('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">');
    win.document.write('<style>');
    win.document.write(`
      @page { size: A4; margin: 15mm; }
      body { font-family: 'Inter', sans-serif; padding: 0; color: #1e293b; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      * { box-sizing: border-box; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border-bottom: 1px solid #e2e8f0; padding: 12px 10px; text-align: left; font-size: 13px; }
      th { background-color: #f8fafc; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px; }
      .header-table td { border: none; padding: 4px 8px; }
    `);
    win.document.write('</style></head><body>');
    win.document.write(printContent);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[99999] p-4">
      <div className="bg-white w-full max-w-[900px] max-h-[95vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
        
        {/* Modal Top Actions Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Tax Invoice</h3>
              <span className="text-xs text-slate-400 font-medium">Invoice #: {invoiceNum}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white" ref={printRef}>
          <div style={{ fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
            
            {/* Header: Logo and Invoice Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '30px', marginBottom: '30px' }}>
              <div>
                <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  AutoZon<span style={{ color: '#f97316' }}>India</span>
                </h1>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>
                  Autonaut Automotive India Pvt. Ltd.
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  Plot 402, AutoZon Tech Park, MIDC Zone,<br />
                  Andheri East, Mumbai - 400093, India<br />
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>GSTIN:</span> 27AAAAA0000A1Z5 | <span style={{ color: '#0f172a', fontWeight: 600 }}>State:</span> 27 (MH)<br />
                  billing@autozonindia.com | +91 8591719499
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '24px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>Tax Invoice</h2>
                
                <table className="header-table" style={{ fontSize: '13px', color: '#475569', marginLeft: 'auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'right', padding: '4px 12px 4px 0' }}>Invoice No:</td>
                      <td style={{ fontWeight: 700, color: '#0f172a', padding: '4px 0' }}>{invoiceNum}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', padding: '4px 12px 4px 0' }}>Date:</td>
                      <td style={{ fontWeight: 600, color: '#0f172a', padding: '4px 0' }}>{invoiceDate}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', padding: '4px 12px 4px 0' }}>Order ID:</td>
                      <td style={{ fontWeight: 600, color: '#0f172a', padding: '4px 0' }}>{orderData.id || 'ORD-98214'}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', padding: '4px 12px 4px 0' }}>Supply State:</td>
                      <td style={{ fontWeight: 600, color: '#0f172a', padding: '4px 0' }}>Maharashtra (27)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Billing and Shipping Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
                  Billed To
                </h3>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {orderData.shippingAddress?.fullName || 'Sagar Kamti'}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  {orderData.shippingAddress?.addressLine1 || 'Flat 402, AutoZon Tech Park'}<br />
                  {orderData.shippingAddress?.city || 'Mumbai'}, {orderData.shippingAddress?.state || 'Maharashtra'} - {orderData.shippingAddress?.postalCode || '400093'}<br />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Phone:</span> {orderData.shippingAddress?.phone || '+91 8591719499'}<br />
                  {orderData.customerGstin && <><span style={{ fontWeight: 600, color: '#0f172a' }}>GSTIN:</span> {orderData.customerGstin}</>}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
                  Shipped To
                </h3>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {orderData.shippingAddress?.fullName || 'Sagar Kamti'}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  {orderData.shippingAddress?.addressLine1 || 'Flat 402, AutoZon Tech Park'}<br />
                  {orderData.shippingAddress?.city || 'Mumbai'}, {orderData.shippingAddress?.state || 'Maharashtra'} - {orderData.shippingAddress?.postalCode || '400093'}<br />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Courier:</span> Delhivery Express (AWB #DEL98124912)
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>#</th>
                    <th style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Item & Description</th>
                    <th style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>HSN</th>
                    <th style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Qty</th>
                    <th style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Rate (₹)</th>
                    <th style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const itemTaxable = Math.round(item.price / 1.18);
                    const itemGst = item.price - itemTaxable;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '16px', fontSize: '13px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{item.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Part #: {item.partNumber || item.oemPartNumber || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#475569', textAlign: 'center' }}>{item.hsn || '8708'}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#0f172a', fontWeight: 500, textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#475569', textAlign: 'right' }}>{item.price.toLocaleString()}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              {/* Payment Details */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '45%' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Info</h4>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Method:</span> Online UPI Direct<br />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Transaction ID:</span> UPI/4281920491/SUCCESS<br />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Status:</span> <span style={{ color: '#166534', fontWeight: 700 }}>PAID IN FULL</span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div style={{ width: '45%' }}>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Taxable Value:</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: '#0f172a' }}>₹{taxableAmount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>CGST (9%):</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: '#0f172a' }}>₹{cgst.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>SGST (9%):</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>₹{sgst.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px 0 8px 0', color: '#0f172a', fontWeight: 800, fontSize: '18px' }}>Total Amount:</td>
                      <td style={{ padding: '16px 0 8px 0', textAlign: 'right', fontWeight: 900, color: '#f97316', fontSize: '20px' }}>₹{totalAmount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Thank you for doing business with AutoZon India!</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>This is a computer generated invoice and does not require a physical signature.</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
