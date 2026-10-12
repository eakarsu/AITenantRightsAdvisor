import React, { useState } from 'react';
import Modal from './AIWorkspaceModal';
import AIWorkspace from './AIWorkspace';
import FormattedAIReport, { readableLabel } from './FormattedAIReport';
import api from '../api.js';
import features from './aiWorkspaceFeatures.json';
import './AIWorkspace.css';

export default function AIReportLibrary({ floating = false, compact = false }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [nativeOpen, setNativeOpen] = useState(false);
  const [nativeHistory, setNativeHistory] = useState(null);
  const [nativeError, setNativeError] = useState('');
  const [selectedNative, setSelectedNative] = useState(null);
  const [search, setSearch] = useState('');
  const close = () => { setOpen(false); setSelected(null); setNativeOpen(false); setSelectedNative(null); };
  const openNativeHistory = async () => {
    setSelected(null); setNativeOpen(true); setSelectedNative(null); setNativeHistory(null); setNativeError('');
    try {
      const response = await api.get('/ai/history');
      if (!Array.isArray(response.data?.history)) throw new Error('Invalid AI history response');
      setNativeHistory(response.data.history);
    } catch (_) { setNativeError('Saved AI history is unavailable. Check your connection and try again.'); }
  };
  const visible = features.filter((feature) => `${feature.title} ${feature.description}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <button type="button" className={`ai-library-launcher ${floating ? 'ai-library-launcher-floating' : ''} ${compact ? 'ai-library-launcher-compact' : ''}`} onClick={() => setOpen(true)}><span aria-hidden="true">✦</span> AI reports <small>{features.length}</small></button>
    {open && <Modal title={nativeOpen ? 'Saved native AI results' : selected ? selected.title : 'AI reports'} className="ai-workspace-dialog" onClose={close} footer={<>{(selected || nativeOpen) && <button type="button" className="btn btn-secondary" onClick={() => { setSelected(null); setNativeOpen(false); setSelectedNative(null); }}>All AI features</button>}<button type="button" className="btn btn-secondary" onClick={close}>Cancel</button></>}>
      {nativeOpen ? <section className="ai-history"><h2>Saved native AI results</h2>{nativeError && <p role="alert">{nativeError}</p>}{nativeHistory === null && !nativeError && <p role="status">Loading saved results…</p>}{nativeHistory?.length === 0 && <p>No saved results yet.</p>}{nativeHistory?.map((item) => <button type="button" className="ai-history-row" key={item.id} onClick={() => setSelectedNative(item)}><span><strong>{readableLabel(item.endpoint || 'AI result')}</strong><br /><small className="ai-muted">{new Date(item.created_at).toLocaleString()}</small></span><span>Open result →</span></button>)}{selectedNative && <FormattedAIReport response={selectedNative.result} title={readableLabel(selectedNative.endpoint || 'Saved AI result')} />}</section> : selected ? <AIWorkspace key={selected.id} feature={selected} /> : <section className="ai-library"><p className="ai-muted">Choose a feature, fill all fields with an example, then generate a professional OpenRouter report. Reports provide recommendations for your review.</p><button type="button" className="btn btn-secondary" onClick={openNativeHistory}>Saved native AI results</button><label htmlFor="ai-library-search">Find an AI feature</label><input id="ai-library-search" type="search" value={search} placeholder="Search all AI reports…" onChange={(event) => setSearch(event.target.value)} /><div className="ai-library-grid">{visible.map((feature) => <button key={feature.id} className="ai-library-feature" type="button" onClick={() => setSelected(feature)}><strong>{feature.title.replace(/^no\s+/i, '')}</strong><span>Advisory report · 3 complete examples</span><span>Open workspace →</span></button>)}</div>{!visible.length && <p className="ai-muted">No matching features. Try a different search.</p>}</section>}
    </Modal>}
  </>;
}
