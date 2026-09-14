import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { submitCustomerReturnRequest, RETURN_REASONS } from '../services/returnsWarrantyService';
import {
  ShieldAlert, Upload, CheckCircle2, AlertTriangle, X, RefreshCw,
  DollarSign, Package, Truck, Camera, Trash2, ArrowRight, ShieldCheck, Image as ImageIcon
} from 'lucide-react';

export const ReturnClaimModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, orders, products, showToast } = useStore();

  const userEmail = user?.email || 'sagarkamti2008@gmail.com';
  const userName = user?.name || 'Sagar Kamti';

  // Form States
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reason, setReason] = useState('Damaged Product');
  const [description, setDescription] = useState('');
  const [preferredAction, setPreferredAction] = useState('Refund'); // 'Refund' | 'Replacement'
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Selected Order object
  const selectedOrder = orders.find(o => String(o.id) === String(selectedOrderId) || String(o.orderNumber) === String(selectedOrderId)) || orders[0] || {
    id: 'AZ-904812',
    orderNumber: 'AZ-904812',
    customerName: userName,
    customerEmail: userEmail,
    deliveryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  };

  // Selected Product object
  const selectedProduct = products.find(p => String(p.id) === String(selectedProductId)) || products[0] || {
    id: 'prod-002',
    title: 'Bosch Genuine OE Clutch Kit Assembly',
    price: 3450,
    partNumber: 'BOSCH-CK-22019',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80'
  };

  // File Upload Handler (Base64 conversion)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`📸 ${files.length} Damage photo(s) attached!`, 'success');
  };

  // Sample preset photos for testing
  const handleAddSampleDamagePhoto = (imgUrl, label) => {
    if (!evidenceImages.includes(imgUrl)) {
      setEvidenceImages(prev => [...prev, imgUrl]);
      showToast(`Added sample photo: ${label}`, 'success');
    }
  };

  const handleRemoveImage = (index) => {
    setEvidenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the damage or defect in detail.', 'error');
      return;
    }

    if (evidenceImages.length === 0) {
      showToast('⚠️ Please upload at least 1 photo proof of damage/defect.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = submitCustomerReturnRequest({
        order: selectedOrder,
        product: selectedProduct,
        quantity: 1,
        reason,
        description: `[Preferred Action: 1-Click ${preferredAction}] ${description}`,
        evidenceImages,
        customerUser: { fullName: userName, email: userEmail, phone: user?.phone || '+91 8591719499' }
      });

      setIsSubmitting(false);

      if (res.success) {
        showToast(`🎉 Claim Registered! Auto AWB Generated for Doorstep Pickup.`, 'success');
        if (onSuccess) onSuccess(res);
        onClose();
      } else {
        showToast(`❌ Return Ineligible: ${res.message}`, 'error');
      }
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(15, 33, 103, 0.35)',
        border: '1px solid #CBD5E1'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2167, #1E3E62)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#FF6B00', borderRadius: '50%', padding: '0.5rem', display: 'flex' }}>
              <ShieldAlert size={22} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 900 }}>
                Customer Return & Damage Claim Portal
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                Instant Photo Proof Verification • 1-Click Refund / Free Replacement
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.4rem', color: '#FFFFFF', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitClaim} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section 1: Order & Product Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F2167', display: 'block', marginBottom: '0.35rem' }}>
                1. SELECT DELIVERED ORDER *
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <option value="">-- Choose Delivered Order --</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    Order #{o.orderNumber || o.id} ({new Date(o.date || o.createdAt || Date.now()).toLocaleDateString('en-IN')})
                  </option>
                ))}
                {orders.length === 0 && <option value="AZ-904812">Order #AZ-904812 (Delivered 3 Days Ago)</option>}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F2167', display: 'block', marginBottom: '0.35rem' }}>
                2. SELECT DAMAGED / WRONG ITEM *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <option value="">-- Choose Spare Part Item --</option>
                {products.slice(0, 12).map(p => (
                  <option key={p.id} value={p.id}>{p.title} (₹{p.price})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Product Card Preview */}
          {selectedProduct && (
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '8px', background: '#FFFFFF' }} />
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 0.2rem 0', fontSize: '0.88rem', color: '#0F172A', fontWeight: 800 }}>{selectedProduct.title}</h5>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Part #: <code>{selectedProduct.partNumber || selectedProduct.sku || 'AZ-OEM-01'}</code> • Unit Price: <b style={{ color: '#0F2167' }}>₹{selectedProduct.price}</b>
                </div>
              </div>
              <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={12} /> 10-Day Protection Active
              </span>
            </div>
          )}

          {/* Section 2: Reason & Description */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F2167', display: 'block', marginBottom: '0.35rem' }}>
                3. CLAIM REASON *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700 }}
              >
                {RETURN_REASONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F2167', display: 'block', marginBottom: '0.35rem' }}>
                4. DEFECT DESCRIPTION *
              </label>
              <input
                type="text"
                placeholder="e.g. Wiper rubber blade cracked upon opening box, or socket did not fit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Section 3: Photo Damage Upload Box */}
          <div style={{ background: '#FFFBEB', border: '2px dashed #F59E0B', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.85rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={18} color="#D97706" /> 5. UPLOAD DAMAGE / BROKEN PART PHOTOS *
              </strong>
              <span style={{ fontSize: '0.7rem', color: '#B45309' }}>Required for 1-Click Instant Approval</span>
            </div>

            {/* Upload Button */}
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#FF6B00',
              color: '#FFFFFF',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(255,107,0,0.3)'
            }}>
              <Upload size={16} /> Attach Damage Photos / Unboxing Video
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>

            {/* Quick Test Sample Photo Chips */}
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', color: '#78350F', fontWeight: 700 }}>Quick Sample Proofs:</span>
              <button
                type="button"
                onClick={() => handleAddSampleDamagePhoto('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&q=80', 'Broken Pad')}
                style={{ background: '#FFFFFF', border: '1px solid #FCD34D', borderRadius: '12px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer', color: '#92400E' }}
              >
                + Cracks/Damaged Item
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleDamagePhoto('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&q=80', 'Wrong Socket')}
                style={{ background: '#FFFFFF', border: '1px solid #FCD34D', borderRadius: '12px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer', color: '#92400E' }}
              >
                + Wrong Item Box
              </button>
            </div>

            {/* Preview Grid */}
            {evidenceImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                {evidenceImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #10B981', background: '#FFFFFF' }}>
                    <img src={img} alt="Damage Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{ position: 'absolute', top: '2px', right: '2px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: 1-Click Resolution Choice */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F2167', display: 'block', marginBottom: '0.5rem' }}>
              6. SELECT PREFERRED RESOLUTION (1-CLICK CHOICE) *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Option A: Full Refund */}
              <div
                onClick={() => setPreferredAction('Refund')}
                style={{
                  background: preferredAction === 'Refund' ? '#EFF6FF' : '#F8FAFC',
                  border: preferredAction === 'Refund' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div style={{ background: preferredAction === 'Refund' ? '#2563EB' : '#94A3B8', borderRadius: '50%', padding: '0.4rem', color: '#FFFFFF', marginTop: '0.1rem' }}>
                  <DollarSign size={18} />
                </div>
                <div>
                  <b style={{ color: '#0F2167', fontSize: '0.9rem', display: 'block' }}>1-Click Full Refund</b>
                  <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                    100% Refund (₹{selectedProduct.price}) credited back to your original payment method (Razorpay/UPI).
                  </span>
                </div>
              </div>

              {/* Option B: Free Replacement */}
              <div
                onClick={() => setPreferredAction('Replacement')}
                style={{
                  background: preferredAction === 'Replacement' ? '#F0FDF4' : '#F8FAFC',
                  border: preferredAction === 'Replacement' ? '2px solid #166534' : '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div style={{ background: preferredAction === 'Replacement' ? '#166534' : '#94A3B8', borderRadius: '50%', padding: '0.4rem', color: '#FFFFFF', marginTop: '0.1rem' }}>
                  <RefreshCw size={18} />
                </div>
                <div>
                  <b style={{ color: '#166534', fontSize: '0.9rem', display: 'block' }}>1-Click Free Replacement</b>
                  <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                    Priority dispatch of brand new fresh unit with Delhivery Express Courier. Zero extra charges.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Pickup Logistics Guarantee Banner */}
          <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={16} color="#0F2167" />
              <span><b>Free Pickup Logistics:</b> Doorstep pickup scheduled automatically via Delhivery / Porter.</span>
            </div>
            <span style={{ fontWeight: 800, color: '#10B981' }}>⚡ 0 ₹ Doorstep Pickup Fee</span>
          </div>

          {/* Modal Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #0F2167, #FF6B00)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15,33,103,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <ShieldCheck size={18} />
              {isSubmitting ? 'Registering Claim...' : `Submit Claim & Generate ${preferredAction} Ticket`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
