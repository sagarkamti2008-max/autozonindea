import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  TrendingUp, ShoppingBag, Users, Bell, AlertTriangle, RefreshCw,
  Send, Mail, MessageSquare, Tag, Layers, Settings, ShieldAlert,
  Plus, Check, X, Search, FileText, CheckCircle2, Clock, Filter, Eye, ChevronRight
} from 'lucide-react';
import {
  getMarketingSettings,
  updateMarketingSettings,
  getMarketingCampaigns,
  saveMarketingCampaign,
  runMarketingCampaign,
  getAbandonedCarts,
  recoverAbandonedCart,
  detectAbandonedCarts,
  getCustomerSegments,
  saveCustomerSegment,
  calculateCustomersForSegment,
  getCustomerTags,
  saveCustomerTag,
  getCustomerTagAssignments,
  assignTagToCustomer,
  removeTagFromCustomer,
  getAutomationRules,
  saveAutomationRule,
  getAutomationRuns,
  getEmailTemplates,
  saveEmailTemplate,
  getWhatsAppTemplates,
  saveWhatsAppTemplate,
  runScheduledMarketingJobs
} from '../services/marketingAutomationService';

export const AdminMarketingConsole = () => {
  const { customers, orders, products, showToast } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // overview, campaigns, abandoned, customers, segments, tags, rules, logs, email-templates, wa-templates, settings

  // State definitions
  const [settings, setSettings] = useState(getMarketingSettings());
  const [campaigns, setCampaigns] = useState(getMarketingCampaigns());
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [segments, setSegments] = useState(getCustomerSegments());
  const [tags, setTags] = useState(getCustomerTags());
  const [tagAssignments, setTagAssignments] = useState(getCustomerTagAssignments());
  const [rules, setRules] = useState(getAutomationRules());
  const [runs, setRuns] = useState(getAutomationRuns());
  const [emailTemplates, setEmailTemplates] = useState(getEmailTemplates());
  const [waTemplates, setWaTemplates] = useState(getWhatsAppTemplates());

  // Search & Modals State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState('all');
  const [selectedTagId, setSelectedTagId] = useState('all');
  const [isNewCampaignModal, setIsNewCampaignModal] = useState(false);
  const [isNewSegmentModal, setIsNewSegmentModal] = useState(false);
  const [isNewRuleModal, setIsNewRuleModal] = useState(false);

  // Forms State
  const [campaignForm, setCampaignForm] = useState({ name: '', description: '', segment_id: 'seg-repeat', channel: 'email' });
  const [segmentForm, setSegmentForm] = useState({ name: '', description: '', minSpent: 5000, minOrders: 1 });
  const [ruleForm, setRuleForm] = useState({ name: '', description: '', trigger_type: 'cart_abandoned', action_type: 'send_email', enabled: true });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    detectAbandonedCarts(); // auto check
    setSettings(getMarketingSettings());
    setCampaigns(getMarketingCampaigns());
    setAbandonedCarts(getAbandonedCarts());
    setSegments(getCustomerSegments());
    setTags(getCustomerTags());
    setTagAssignments(getCustomerTagAssignments());
    setRules(getAutomationRules());
    setRuns(getAutomationRuns());
    setEmailTemplates(getEmailTemplates());
    setWaTemplates(getWhatsAppTemplates());
  };

  // Handlers
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateMarketingSettings(settings);
    showToast('Marketing Automation Settings updated successfully!', 'success');
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!campaignForm.name) {
      showToast('Please specify campaign name', 'error');
      return;
    }
    const saved = saveMarketingCampaign(campaignForm);
    setCampaigns(getMarketingCampaigns());
    setIsNewCampaignModal(false);
    showToast(`Campaign "${saved.name}" created in draft status`, 'success');
  };

  const handleRunCampaign = async (campaignId) => {
    try {
      const result = await runMarketingCampaign(campaignId, customers || []);
      setCampaigns(getMarketingCampaigns());
      showToast(`Campaign dispatched to ${result.sentCount} customers!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRecoverCart = async (cartId) => {
    try {
      const res = await recoverAbandonedCart(cartId);
      setAbandonedCarts(getAbandonedCarts());
      if (res.success) showToast('Recovery reminder notification queued!', 'success');
      else showToast(res.reason, 'error');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateSegment = (e) => {
    e.preventDefault();
    if (!segmentForm.name) return;
    saveCustomerSegment({
      name: segmentForm.name,
      description: segmentForm.description,
      rules_json: { minSpent: Number(segmentForm.minSpent), minOrders: Number(segmentForm.minOrders) },
      status: 'active'
    });
    setSegments(getCustomerSegments());
    setIsNewSegmentModal(false);
    showToast('Customer Segment created', 'success');
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!ruleForm.name) return;
    saveAutomationRule(ruleForm);
    setRules(getAutomationRules());
    setIsNewRuleModal(false);
    showToast('Automation Rule saved', 'success');
  };

  const handleRunCronJobs = () => {
    const res = runScheduledMarketingJobs();
    loadAllData();
    showToast(`Cron Job Executed! Processed ${res.abandonedCartsProcessed} eligible carts.`, 'success');
  };

  // Calculations
  const recoveredCarts = abandonedCarts.filter(c => c.recovery_status === 'recovered');
  const totalRecoveredVal = recoveredCarts.reduce((sum, c) => sum + (c.total_amount || 0), 0);
  const recoveryRate = abandonedCarts.length > 0 ? Math.round((recoveredCarts.length / abandonedCarts.length) * 100) : 0;

  // Filtered Customers
  const filteredCustomers = (customers || []).filter(c => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.name?.toLowerCase().includes(q) && !c.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="admin-console-wrapper" style={{ padding: '1rem' }}>
      {/* Console Header */}
      <div className="card-header-flex" style={{ marginBottom: '1.5rem', background: '#0F172A', color: '#FFF', padding: '1.25rem', borderRadius: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFF' }}>
            <TrendingUp color="#FF6B00" size={26} /> Marketing Automation & Customer Intelligence Hub
          </h2>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94A3B8' }}>
            Unified abandoned cart recovery, customer segmentation, automated lifecycle campaigns & preferences.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handleRunCronJobs} style={{ background: '#334155', color: '#FFF', border: '1px solid #475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={16} color="#38BDF8" /> Execute Marketing Cron
          </button>
          <button className="btn-primary" onClick={() => setIsNewCampaignModal(true)} style={{ background: '#FF6B00', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Create Campaign
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
        {[
          { id: 'overview', label: 'Overview Dashboard', icon: TrendingUp },
          { id: 'campaigns', label: 'Marketing Campaigns', icon: Send, badge: campaigns.length },
          { id: 'abandoned', label: 'Abandoned Carts', icon: ShoppingBag, badge: abandonedCarts.length },
          { id: 'customers', label: 'Customer Search', icon: Users, badge: customers?.length },
          { id: 'segments', label: 'Customer Segments', icon: Layers, badge: segments.length },
          { id: 'tags', label: 'Customer Tags', icon: Tag, badge: tags.length },
          { id: 'rules', label: 'Automation Rules', icon: RefreshCw, badge: rules.length },
          { id: 'logs', label: 'Automation Logs', icon: FileText, badge: runs.length },
          { id: 'email-templates', label: 'Email Templates', icon: Mail },
          { id: 'wa-templates', label: 'WhatsApp Templates', icon: MessageSquare },
          { id: 'settings', label: 'Automation Settings', icon: Settings }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0F172A' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span style={{ background: isActive ? '#FF6B00' : '#CBD5E1', color: isActive ? '#FFF' : '#0F172A', borderRadius: '50px', fontSize: '0.65rem', padding: '0.05rem 0.4rem' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Console Views */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Summary Row */}
          <div className="admin-stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <Send size={28} className="stat-icon revenue" />
              <div>
                <span className="stat-label">Active Campaigns</span>
                <h3 className="stat-val">{campaigns.length} Campaigns</h3>
              </div>
            </div>

            <div className="stat-card">
              <ShoppingBag size={28} className="stat-icon orders" />
              <div>
                <span className="stat-label">Abandoned Carts</span>
                <h3 className="stat-val">{abandonedCarts.length} Carts</h3>
              </div>
            </div>

            <div className="stat-card">
              <CheckCircle2 size={28} className="stat-icon products" />
              <div>
                <span className="stat-label">Recovered Carts Value</span>
                <h3 className="stat-val">₹{totalRecoveredVal.toLocaleString('en-IN')}</h3>
              </div>
            </div>

            <div className="stat-card">
              <TrendingUp size={28} className="stat-icon pending" />
              <div>
                <span className="stat-label">Cart Recovery Rate</span>
                <h3 className="stat-val">{recoveryRate}%</h3>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Recent Campaigns Overview */}
            <div className="portal-card">
              <div className="card-header-flex">
                <h3><Send size={18} /> Marketing Campaigns Overview</h3>
                <button className="btn-secondary" onClick={() => setActiveTab('campaigns')}>View All</button>
              </div>
              <div className="admin-table-wrapper" style={{ marginTop: '0.75rem' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.slice(0, 5).map(c => (
                      <tr key={c.id}>
                        <td><b>{c.name}</b></td>
                        <td><span className="badge-classification oem">{c.channel}</span></td>
                        <td><span className={`order-status-tag ${c.status === 'completed' ? 'shipped' : 'pending'}`}>{c.status}</span></td>
                        <td>
                          {c.status === 'draft' && (
                            <button className="btn-secondary" onClick={() => handleRunCampaign(c.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                              Dispatch
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Abandoned Carts Overview */}
            <div className="portal-card">
              <div className="card-header-flex">
                <h3><ShoppingBag size={18} /> Abandoned Cart Recovery Monitor</h3>
                <button className="btn-secondary" onClick={() => setActiveTab('abandoned')}>View All</button>
              </div>
              <div className="admin-table-wrapper" style={{ marginTop: '0.75rem' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Session / Customer</th>
                      <th>Cart Total</th>
                      <th>Status</th>
                      <th>Recover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abandonedCarts.slice(0, 5).map(c => (
                      <tr key={c.id}>
                        <td><b>{c.customer_id || c.session_id}</b></td>
                        <td><b>₹{c.total_amount?.toLocaleString('en-IN')}</b></td>
                        <td><span className="order-status-tag shipped">{c.recovery_status}</span></td>
                        <td>
                          <button className="btn-primary" onClick={() => handleRecoverCart(c.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            Send Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="portal-card">
          <div className="card-header-flex">
            <h3><Send size={20} /> Marketing Campaigns Directory</h3>
            <button className="btn-primary" onClick={() => setIsNewCampaignModal(true)}>
              <Plus size={16} /> Create New Campaign
            </button>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Target Segment</th>
                  <th>Channel</th>
                  <th>Scheduled / Started</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <td>
                      <b>{c.name}</b>
                      <span className="table-sub">{c.description}</span>
                    </td>
                    <td><b>{c.segment_id}</b></td>
                    <td><span className="badge-classification oem">{c.channel}</span></td>
                    <td>{c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('en-IN') : 'Instant'}</td>
                    <td><span className={`order-status-tag ${c.status === 'completed' ? 'shipped' : 'pending'}`}>{c.status}</span></td>
                    <td>
                      <button className="btn-secondary" onClick={() => handleRunCampaign(c.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                        Dispatch Campaign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Abandoned Carts Tab */}
      {activeTab === 'abandoned' && (
        <div className="portal-card">
          <div className="card-header-flex">
            <div>
              <h3><ShoppingBag size={20} /> Abandoned Carts & Session Recovery</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                Monitors inactive carts after configured inactivity period ({settings.abandoned_cart_delay || 60} mins).
              </p>
            </div>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cart / Customer ID</th>
                  <th>Cart Items</th>
                  <th>Cart Value</th>
                  <th>Last Activity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {abandonedCarts.map(c => (
                  <tr key={c.id}>
                    <td><b>{c.customer_id || c.session_id}</b></td>
                    <td>
                      <b>{c.cart_snapshot?.length || 0} Items</b>
                      <span className="table-sub">{c.cart_snapshot?.[0]?.title || 'Part Item'}</span>
                    </td>
                    <td><b>₹{c.total_amount?.toLocaleString('en-IN')}</b></td>
                    <td>{new Date(c.last_activity_at).toLocaleString('en-IN')}</td>
                    <td><span className="order-status-tag shipped">{c.recovery_status}</span></td>
                    <td>
                      <button className="btn-primary" onClick={() => handleRecoverCart(c.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                        Send Recovery Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Search Tab */}
      {activeTab === 'customers' && (
        <div className="portal-card">
          <div className="card-header-flex">
            <h3><Users size={20} /> Marketing Customer Directory & Filter</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '0.4rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Assigned Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => {
                  const custTags = tagAssignments.filter(a => a.customer_id === c.id);
                  return (
                    <tr key={c.id}>
                      <td><b>{c.id}</b></td>
                      <td><b>{c.name}</b></td>
                      <td>{c.email}</td>
                      <td>
                        {custTags.map(t => (
                          <span key={t.tag_id} className="badge-classification oem" style={{ marginRight: '0.25rem' }}>
                            {t.tag_id}
                          </span>
                        ))}
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            assignTagToCustomer(c.id, 'tag-vip', 'Admin Console');
                            setTagAssignments(getCustomerTagAssignments());
                            showToast(`Assigned VIP tag to ${c.name}`, 'success');
                          }}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          + Tag VIP
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="portal-card">
          <div className="card-header-flex">
            <h3><Layers size={20} /> Customer Segments Master</h3>
            <button className="btn-primary" onClick={() => setIsNewSegmentModal(true)}>
              <Plus size={16} /> Create Segment
            </button>
          </div>

          <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Segment Name</th>
                  <th>Description</th>
                  <th>Rules</th>
                  <th>Matching Customers</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {segments.map(s => {
                  const matching = calculateCustomersForSegment(s.rules_json, customers || [], orders || []);
                  return (
                    <tr key={s.id}>
                      <td><b>{s.name}</b></td>
                      <td>{s.description}</td>
                      <td><code>{JSON.stringify(s.rules_json)}</code></td>
                      <td><b>{matching.length} Customers</b></td>
                      <td><span className="verified-tag">{s.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="portal-card" style={{ maxWidth: '700px' }}>
          <h3><Settings size={20} /> Marketing Automation & Governance Settings</h3>
          <form onSubmit={handleSaveSettings} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Abandoned Cart Inactivity Threshold (Minutes)
              </label>
              <input
                type="number"
                value={settings.abandoned_cart_delay}
                onChange={e => setSettings({ ...settings, abandoned_cart_delay: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Maximum Recovery Reminders per Cart
              </label>
              <input
                type="number"
                value={settings.maximum_recovery_messages}
                onChange={e => setSettings({ ...settings, maximum_recovery_messages: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Campaign Frequency Limit (Max messages per customer per month)
              </label>
              <input
                type="number"
                value={settings.campaign_frequency_limit}
                onChange={e => setSettings({ ...settings, campaign_frequency_limit: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
            </div>

            <button className="btn-primary" type="submit" style={{ marginTop: '1rem' }}>
              Save Automation Settings
            </button>
          </form>
        </div>
      )}

      {/* Modals */}
      {isNewCampaignModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3>Create Marketing Campaign</h3>
            <form onSubmit={handleCreateCampaign} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Campaign Name"
                value={campaignForm.name}
                onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })}
                style={{ padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                required
              />
              <textarea
                placeholder="Campaign Description / Offer Message"
                value={campaignForm.description}
                onChange={e => setCampaignForm({ ...campaignForm, description: e.target.value })}
                style={{ padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', height: '80px' }}
              />
              <select
                value={campaignForm.channel}
                onChange={e => setCampaignForm({ ...campaignForm, channel: e.target.value })}
                style={{ padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              >
                <option value="email">Email Campaign</option>
                <option value="whatsapp">WhatsApp Campaign</option>
                <option value="in_app">In-App Notification</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsNewCampaignModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
