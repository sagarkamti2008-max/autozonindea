import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Cpu, ShieldCheck, Plus, Clock, FileText, CheckCircle2, BarChart2, ArrowRight } from 'lucide-react';

export const ManufacturerPortal = () => {
  const { manufacturerSubmissions, submitManufacturerProduct, showToast } = useStore();

  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions', 'new-sub', 'analytics'
  const [newSub, setNewSub] = useState({
    brandName: 'BOSCH',
    title: '',
    partNumber: '',
    oemNumber: '',
    category: 'brakes',
    specs: 'Low-Metallic Ceramic Compound disc pads with shims',
    fitments: 'Maruti Suzuki Swift (2018-2024)',
    installDocUrl: 'https://autozonindia.com/docs/bosch-install-guide.pdf'
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newSub.title || !newSub.partNumber) {
      showToast('Please specify Product Title and Part Number', 'error');
      return;
    }

    submitManufacturerProduct(newSub);
    setNewSub({
      brandName: 'BOSCH',
      title: '',
      partNumber: '',
      oemNumber: '',
      category: 'brakes',
      specs: '',
      fitments: '',
      installDocUrl: ''
    });
    setActiveTab('submissions');
  };

  return (
    <div className="container admin-dashboard-wrapper">
      <div className="admin-header">
        <Cpu size={32} color="#0F2167" />
        <div>
          <h2>OEM & OES Manufacturer Portal</h2>
          <p>Submit genuine master catalog data, technical fitments, installation guides & view brand analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button className={`admin-tab ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>
          Catalog Submissions ({manufacturerSubmissions.length})
        </button>
        <button className={`admin-tab ${activeTab === 'new-sub' ? 'active' : ''}`} onClick={() => setActiveTab('new-sub')}>
          Submit New OEM Master SKU
        </button>
        <button className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          Brand Demand Analytics
        </button>
      </div>

      <div className="admin-tab-pane">
        {activeTab === 'submissions' && (
          <div className="admin-pane-card">
            <h3>Submitted OEM Catalog Items & Admin Approval Status</h3>
            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Submission ID</th>
                    <th>Product Title</th>
                    <th>Part Number</th>
                    <th>OEM Reference</th>
                    <th>Category</th>
                    <th>Fitment Mapping</th>
                    <th>Approval Status</th>
                  </tr>
                </thead>
                <tbody>
                  {manufacturerSubmissions.map(sub => (
                    <tr key={sub.id}>
                      <td><code>{sub.id}</code></td>
                      <td><b>{sub.title}</b></td>
                      <td><code>{sub.partNumber}</code></td>
                      <td><code>{sub.oemNumber}</code></td>
                      <td>{sub.category}</td>
                      <td>{sub.fitments}</td>
                      <td>
                        <span className={`verified-tag ${sub.status === 'Approved' ? 'good' : 'warning'}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'new-sub' && (
          <div className="admin-pane-card">
            <h3>Submit Genuine Master Product to Marketplace Catalog</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Submissions enter the Admin Catalog Review workflow to verify technical fitments and prevent duplicate records.
            </p>

            <form onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Brand Name</label>
                  <input type="text" value={newSub.brandName} onChange={(e) => setNewSub({ ...newSub, brandName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Product Title *</label>
                  <input type="text" required value={newSub.title} onChange={(e) => setNewSub({ ...newSub, title: e.target.value })} placeholder="e.g. Bosch Front Brake Disc Rotor Set" />
                </div>
                <div className="form-group">
                  <label>Manufacturer Part Number *</label>
                  <input type="text" required value={newSub.partNumber} onChange={(e) => setNewSub({ ...newSub, partNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>OEM Reference Number</label>
                  <input type="text" value={newSub.oemNumber} onChange={(e) => setNewSub({ ...newSub, oemNumber: e.target.value })} placeholder="e.g. 55311-M74L00" />
                </div>
                <div className="form-group full-width">
                  <label>Technical Specifications & Material</label>
                  <input type="text" value={newSub.specs} onChange={(e) => setNewSub({ ...newSub, specs: e.target.value })} />
                </div>
                <div className="form-group full-width">
                  <label>Vehicle Compatibility / Fitments</label>
                  <input type="text" value={newSub.fitments} onChange={(e) => setNewSub({ ...newSub, fitments: e.target.value })} placeholder="e.g. Maruti Swift (2020-2024), Dzire Petrol" />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                Submit SKU for Admin Approval <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="admin-pane-card">
            <h3>Brand Demand & Market Insights</h3>
            <div className="offers-grid" style={{ marginTop: '1rem' }}>
              <div className="testimonial-card">
                <h4>Top Vehicle Demand for BOSCH</h4>
                <p className="body-small">1. Maruti Suzuki Swift (34% of brand searches)</p>
                <p className="body-small">2. Hyundai Creta 1.5 CRDi (28% of brand searches)</p>
                <p className="body-small">3. Tata Nexon Ev/Petrol (18% of brand searches)</p>
              </div>

              <div className="testimonial-card">
                <h4>Catalog Performance</h4>
                <p className="body-small">Total Catalog Impressions: 142,000</p>
                <p className="body-small">Fitment Compatibility Confidence: 99.4%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
