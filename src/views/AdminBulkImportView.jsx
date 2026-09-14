import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { catalogImportService } from '../services/catalogImportService';
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, ArrowRight,
  Download, RefreshCw, Layers, ShieldCheck, HelpCircle, Eye, FileText, Check, AlertCircle
} from 'lucide-react';

export const AdminBulkImportView = ({ onNavigate }) => {
  const { categories, brands, products, showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  // Stages: 'upload' -> 'mapping' -> 'preview' -> 'confirm' -> 'processing' -> 'results'
  const [currentStage, setCurrentStage] = useState('upload');
  const [importMode, setImportMode] = useState('create_update'); // 'create_only', 'update_only', 'create_update'
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);

  // Category & Brand Mapping State
  const [unmappedCategories, setUnmappedCategories] = useState([]);
  const [unmappedBrands, setUnmappedBrands] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [brandMapping, setBrandMapping] = useState({});

  // Validation State
  const [validationResult, setValidationResult] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'valid', 'invalid', 'create', 'update'

  // Processing State
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 });
  const [finalJobResult, setFinalJobResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = catalogImportService.parseCSVText(text);

        if (rows.length === 0) {
          showToast('CSV file is empty or formatted incorrectly.', 'error');
          return;
        }

        setParsedRows(rows);

        // Detect unmapped categories & brands
        const unCats = catalogImportService.detectUnmappedCategories(rows, categories || []);
        const unBrands = catalogImportService.detectUnmappedBrands(rows, brands || []);

        setUnmappedCategories(unCats);
        setUnmappedBrands(unBrands);

        if (unCats.length > 0 || unBrands.length > 0) {
          setCurrentStage('mapping');
        } else {
          runValidation(rows, importMode, {}, {});
        }
      } catch (err) {
        console.error('CSV Parsing error:', err);
        showToast('Failed to parse CSV file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const runValidation = (rows, mode, catMap, bMap) => {
    const valRes = catalogImportService.validateImportBatch(
      rows,
      mode,
      products || [],
      categories || [],
      brands || [],
      catMap,
      bMap
    );
    setValidationResult(valRes);
    setCurrentStage('preview');
  };

  const handleProceedFromMapping = () => {
    runValidation(parsedRows, importMode, categoryMapping, brandMapping);
  };

  const handleDownloadTemplate = () => {
    const templateContent = catalogImportService.generateCSVTemplate();
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AutoZoneIndia_Product_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Template downloaded!', 'success');
  };

  const handleConfirmImport = async () => {
    if (!validationResult) return;
    setCurrentStage('processing');
    setProcessingProgress({ current: 0, total: validationResult.validatedRows.length });

    const result = await catalogImportService.executeImportJob({
      fileName: fileName || 'bulk_import.csv',
      importMode: importMode,
      validatedRows: validationResult.validatedRows,
      adminName: 'Admin Staff',
      onProgress: (current, total) => {
        setProcessingProgress({ current, total });
      }
    });

    if (result.success) {
      setFinalJobResult(result);
      setCurrentStage('results');
      showToast(`Import Completed! ${result.createdRows} created, ${result.updatedRows} updated.`, 'success');
    } else {
      showToast('Import failed: ' + result.error, 'error');
      setCurrentStage('preview');
    }
  };

  const handleDownloadErrorCSV = () => {
    if (!finalJobResult && !validationResult) return;
    const rowsToExport = finalJobResult?.jobRowsLogs || validationResult?.validatedRows || [];
    const errorCsvText = catalogImportService.generateErrorCSV(rowsToExport);

    const blob = new Blob([errorCsvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `import_errors_${fileName || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F2167', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet color="#FF6B00" size={28} /> Bulk Product Import & Catalog Manager
          </h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Server-side batched CSV import, SKU matching, duplicate protection, and category mapping engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleDownloadTemplate}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0F2167',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Download size={16} color="#FF6B00" /> Download CSV Template
          </button>

          <button
            onClick={() => nav('admin/products/import/history')}
            style={{
              background: '#0F2167',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <FileText size={16} /> Import History
          </button>
        </div>
      </div>

      {/* Stage Progress Bar */}
      <div style={{ background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {[
            { id: 'upload', label: '1. Upload CSV' },
            { id: 'mapping', label: '2. Map Categories & Brands' },
            { id: 'preview', label: '3. Preview & Validate' },
            { id: 'confirm', label: '4. Admin Confirm' },
            { id: 'processing', label: '5. Batched Import' },
            { id: 'results', label: '6. Final Summary' }
          ].map((stg, idx) => {
            const isCurrent = currentStage === stg.id;
            return (
              <div key={stg.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCurrent ? '#FF6B00' : '#64748b', fontWeight: isCurrent ? 800 : 600, fontSize: '0.85rem' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isCurrent ? '#FF6B00' : '#f1f5f9',
                  color: isCurrent ? '#ffffff' : '#64748b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {idx + 1}
                </span>
                <span>{stg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: UPLOAD */}
      {currentStage === 'upload' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
            Select Import Mode & Upload CSV
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Choose how AutoZoneIndia will handle existing products matching the same SKU.
          </p>

          {/* Import Mode Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div
              onClick={() => setImportMode('create_update')}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: importMode === 'create_update' ? '2px solid #FF6B00' : '1px solid #cbd5e1',
                background: importMode === 'create_update' ? '#fff9f5' : '#ffffff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 800, color: '#0F2167', fontSize: '1rem', marginBottom: '0.3rem' }}>CREATE + UPDATE (Upsert)</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Creates missing products and updates existing matching SKUs. (Recommended)</div>
            </div>

            <div
              onClick={() => setImportMode('create_only')}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: importMode === 'create_only' ? '2px solid #FF6B00' : '1px solid #cbd5e1',
                background: importMode === 'create_only' ? '#fff9f5' : '#ffffff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 800, color: '#0F2167', fontSize: '1rem', marginBottom: '0.3rem' }}>CREATE ONLY</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Only inserts new products. Fails if SKU already exists in catalog.</div>
            </div>

            <div
              onClick={() => setImportMode('update_only')}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: importMode === 'update_only' ? '2px solid #FF6B00' : '1px solid #cbd5e1',
                background: importMode === 'update_only' ? '#fff9f5' : '#ffffff',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 800, color: '#0F2167', fontSize: '1rem', marginBottom: '0.3rem' }}>UPDATE ONLY</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Only updates existing products matched by SKU. Ignores new SKUs.</div>
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div style={{
            border: '2px dashed #0F2167',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            background: '#f8fafc',
            cursor: 'pointer'
          }}>
            <Upload size={48} color="#FF6B00" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
              Drag & Drop your CSV Product File here
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Supports .csv format with SKU, Name, Category, Brand, MRP, Price, Stock, Image URLs.
            </p>

            <input
              type="file"
              accept=".csv"
              id="csvFileInput"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="csvFileInput"
              style={{
                background: '#0F2167',
                color: '#ffffff',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-block'
              }}
            >
              Browse CSV File
            </label>
          </div>
        </div>
      )}

      {/* STAGE 2: CATEGORY & BRAND MAPPING */}
      {currentStage === 'mapping' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
            Map Unmatched Categories & Brands
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Some categories or brands in your CSV do not match exact names in your database. Map them below before proceeding.
          </p>

          {unmappedCategories.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={18} color="#FF6B00" /> Category Mappings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {unmappedCategories.map(catName => (
                  <div key={catName} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 700, color: '#334155', minWidth: '180px' }}>CSV: "{catName}"</span>
                    <ArrowRight size={16} color="#64748b" />
                    <select
                      value={categoryMapping[catName.toLowerCase()] || ''}
                      onChange={e => setCategoryMapping({ ...categoryMapping, [catName.toLowerCase()]: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff' }}
                    >
                      <option value="">-- Select DB Category --</option>
                      {(categories || []).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unmappedBrands.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F2167', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={18} color="#FF6B00" /> Brand Mappings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {unmappedBrands.map(bName => (
                  <div key={bName} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 700, color: '#334155', minWidth: '180px' }}>CSV: "{bName}"</span>
                    <ArrowRight size={16} color="#64748b" />
                    <select
                      value={brandMapping[bName.toLowerCase()] || ''}
                      onChange={e => setBrandMapping({ ...brandMapping, [bName.toLowerCase()]: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff' }}
                    >
                      <option value="">-- Select DB Brand --</option>
                      {(brands || []).map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleProceedFromMapping}
            style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', float: 'right' }}
          >
            Apply Mappings & Validate Rows ↗
          </button>
        </div>
      )}

      {/* STAGE 3 & 4: PREVIEW & CONFIRM */}
      {(currentStage === 'preview' || currentStage === 'confirm') && validationResult && (
        <div>
          {/* Metrics Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>Total CSV Rows</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0F2167' }}>{validationResult.totalRows}</h3>
            </div>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>Valid Rows</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{validationResult.validRows}</h3>
            </div>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>Invalid Rows</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{validationResult.invalidRows}</h3>
            </div>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 600 }}>New Products (Create)</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{validationResult.createRows}</h3>
            </div>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#d97706', fontSize: '0.8rem', fontWeight: 600 }}>Updates (Existing SKU)</span>
              <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>{validationResult.updateRows}</h3>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'valid', 'invalid', 'create', 'update'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: filterTab === tab ? '#0F2167' : '#f1f5f9',
                      color: filterTab === tab ? '#ffffff' : '#475569'
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentStage('confirm')}
                disabled={validationResult.validRows === 0}
                style={{
                  background: 'linear-gradient(135deg, #FF6B00 0%, #e65c00 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  cursor: validationResult.validRows === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Proceed to Confirmation ({validationResult.validRows} Valid Rows) ↗
              </button>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.75rem' }}>Row</th>
                    <th style={{ padding: '0.75rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Brand</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price (₹)</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Stock</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                    <th style={{ padding: '0.75rem' }}>Validation Status / Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResult.validatedRows
                    .filter(r => {
                      if (filterTab === 'valid') return r.isValid;
                      if (filterTab === 'invalid') return !r.isValid;
                      if (filterTab === 'create') return r.actionType === 'create';
                      if (filterTab === 'update') return r.actionType === 'update';
                      return true;
                    })
                    .map(row => (
                      <tr key={row.row_number} style={{ borderBottom: '1px solid #f1f5f9', background: !row.isValid ? '#fef2f2' : '#ffffff' }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8', fontWeight: 600 }}>{row.row_number}</td>
                        <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F2167' }}>{row.sku || 'N/A'}</td>
                        <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{row.name}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#475569' }}>{row.category_name || 'N/A'}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#475569' }}>{row.brand_name || 'N/A'}</td>
                        <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>₹{row.price}</td>
                        <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{row.stock}</td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <span style={{
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: row.actionType === 'create' ? '#dbeafe' : row.actionType === 'update' ? '#fef3c7' : '#fee2e2',
                            color: row.actionType === 'create' ? '#1e40af' : row.actionType === 'update' ? '#92400e' : '#991b1b'
                          }}>
                            {row.actionType.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          {row.isValid ? (
                            <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <CheckCircle2 size={14} /> Valid
                            </span>
                          ) : (
                            <div style={{ color: '#ef4444', fontSize: '0.78rem' }}>
                              {row.error_messages.join(' ')}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {currentStage === 'confirm' && validationResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '500px', background: '#ffffff', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <AlertTriangle size={48} color="#FF6B00" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
              Confirm Bulk Catalog Import
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              You are about to <strong>CREATE {validationResult.createRows} new products</strong> and <strong>UPDATE {validationResult.updateRows} existing products</strong> in AutoZoneIndia master catalog.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setCurrentStage('preview')}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Back to Preview
              </button>
              <button
                onClick={handleConfirmImport}
                style={{ background: '#FF6B00', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
              >
                Confirm & Execute Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: PROCESSING */}
      {currentStage === 'processing' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
          <RefreshCw size={48} color="#FF6B00" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
            Executing Server-Side Batched Import...
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Processing products in safe database batches to prevent browser lockups.
          </p>

          <div style={{ background: '#f1f5f9', borderRadius: '10px', height: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{
              background: '#FF6B00',
              height: '100%',
              width: `${processingProgress.total ? (processingProgress.current / processingProgress.total) * 100 : 0}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F2167' }}>
            Processed {processingProgress.current} / {processingProgress.total} products
          </div>
        </div>
      )}

      {/* STAGE 6: RESULTS SUMMARY */}
      {currentStage === 'results' && finalJobResult && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '3rem 2rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={56} color="#22c55e" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F2167', marginBottom: '0.5rem' }}>
            Import Finished!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
            Job Reference ID: <strong style={{ fontFamily: 'monospace', color: '#FF6B00' }}>{finalJobResult.jobId}</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Total</span>
              <strong style={{ fontSize: '1.2rem', color: '#0F2167' }}>{finalJobResult.totalRows}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', display: 'block' }}>Created</span>
              <strong style={{ fontSize: '1.2rem', color: '#16a34a' }}>{finalJobResult.createdRows}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#d97706', display: 'block' }}>Updated</span>
              <strong style={{ fontSize: '1.2rem', color: '#d97706' }}>{finalJobResult.updatedRows}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'block' }}>Failed</span>
              <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>{finalJobResult.failedRows}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleDownloadErrorCSV}
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={18} /> Download Error/Audit CSV Report
            </button>

            <button
              onClick={() => {
                setCurrentStage('upload');
                setParsedRows([]);
                setValidationResult(null);
              }}
              style={{ background: '#0F2167', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Start New Bulk Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminBulkImportView;
