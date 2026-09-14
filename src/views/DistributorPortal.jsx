import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Layers, ShoppingBag, Plus, Upload, CheckCircle2, FileText, ArrowRight, Tag } from 'lucide-react';

export const DistributorPortal = () => {
  const { products, rfqs, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('tiered-pricing'); // 'tiered-pricing', 'po-import', 'rfqs'
  
  // Tiered Pricing State
  const [tieredPrices, setTieredPrices] = useState([
    { partNumber: 'BOSCH-BP-0986', title: 'Bosch Brake Pads', tier1: 950, tier2: 850, tier3: 780 },
    { partNumber: 'CAS-BF-DOT4-500', title: 'Castrol Brake Fluid DOT4', tier1: 450, tier2: 400, tier3: 360 }
  ]);

  const [poCSV, setPoCSV] = useState(`PartNumber,Quantity
BOSCH-BP-0986,50
CAS-BF-DOT4-500,100
ELO-OF-1102,200`);

  const handleProcessPO = () => {
    showToast('🎉 Purchase Order CSV processed! 350 Units added to Order Queue.');
  };

  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Layers size={32} color="#0F2167" />
        <div>
          <h2>Distributor & Auto Retailer Portal</h2>
          <p>Configure Tiered B2B Volume Pricing, process wholesale Purchase Orders & respond to RFQs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button className={`admin-tab ${activeTab === 'tiered-pricing' ? 'active' : ''}`} onClick={() => setActiveTab('tiered-pricing')}>
          Tiered Quantity Pricing Matrix
        </button>
        <button className={`admin-tab ${activeTab === 'po-import' ? 'active' : ''}`} onClick={() => setActiveTab('po-import')}>
          Bulk Purchase Order (PO) Uploader
        </button>
        <button className={`admin-tab ${activeTab === 'rfqs' ? 'active' : ''}`} onClick={() => setActiveTab('rfqs')}>
          RFQs & Quotation Requests ({rfqs.length})
        </button>
      </div>

      <div className="admin-tab-pane">
        {activeTab === 'tiered-pricing' && (
          <div className="admin-pane-card">
            <h3>Tiered Quantity Pricing Configurator</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Set volume discounts for wholesale buyers and garages based on order quantity brackets.
            </p>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Part Number</th>
                    <th>Product Title</th>
                    <th>Retail Price (1-4 Units)</th>
                    <th>Garage Price (5-19 Units)</th>
                    <th>Wholesale Price (20+ Units)</th>
                  </tr>
                </thead>
                <tbody>
                  {tieredPrices.map((item, idx) => (
                    <tr key={idx}>
                      <td><code>{item.partNumber}</code></td>
                      <td><b>{item.title}</b></td>
                      <td><b>₹{item.tier1}</b></td>
                      <td><b style={{ color: '#FF6B00' }}>₹{item.tier2}</b> (10% OFF)</td>
                      <td><b style={{ color: '#10B981' }}>₹{item.tier3}</b> (18% OFF)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'po-import' && (
          <div className="admin-pane-card">
            <h3><Upload size={20} /> Bulk Purchase Order (PO) CSV Uploader</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.5rem 0 1rem 0' }}>
              Paste your Purchase Order CSV below to automatically generate a wholesale order.
            </p>

            <textarea
              rows={5}
              value={poCSV}
              onChange={(e) => setPoCSV(e.target.value)}
              className="step-select"
              style={{ fontFamily: 'monospace', width: '100%', marginBottom: '1rem' }}
            />

            <button className="btn-primary" onClick={handleProcessPO}>
              <CheckCircle2 size={16} /> Process PO & Generate Wholesale Invoice
            </button>
          </div>
        )}

        {activeTab === 'rfqs' && (
          <div className="admin-pane-card">
            <h3>Open Customer & Garage RFQs</h3>
            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Part Number</th>
                    <th>Quantity</th>
                    <th>Target Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqs.map(r => (
                    <tr key={r.id}>
                      <td><code>{r.id}</code></td>
                      <td><code>{r.partNumber}</code></td>
                      <td><b>{r.quantity} units</b></td>
                      <td>₹{r.targetPrice}</td>
                      <td><span className="verified-tag good">{r.status}</span></td>
                      <td>
                        <button className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => showToast('Quotation sent to buyer!')}>
                          Send Quote →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
