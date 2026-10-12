import React, { useEffect, useState } from 'react';
import api from '../api';

export function useNativeTenantAI(id) {
  const [tenancy, setTenancy] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [sourceError, setSourceError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let live = true;
    const controller = new AbortController();
    setTenancy(null); setReadiness(null); setSourceError('');
    Promise.all([
      api.get(`/tenancies/${id}`, { signal: controller.signal }),
      api.get('/health', { signal: controller.signal }),
    ]).then(([record, health]) => {
      if (!record.data || String(record.data.id) !== String(id)) throw new Error('Tenancy response does not match the selected record');
      if (!health.data?.legalProvider || typeof health.data.legalProvider.available !== 'boolean') throw new Error('Legal provider availability could not be verified');
      if (live) { setTenancy(record.data); setReadiness(health.data.legalProvider); }
    }).catch((failure) => {
      if (live) setSourceError(failure.response?.data?.error || failure.message || 'Could not load this tenancy and provider availability');
    });
    return () => { live = false; controller.abort(); };
  }, [id, retry]);
  return { tenancy, readiness, sourceError, retrySource: () => setRetry((value) => value + 1), canRun: Boolean(tenancy && readiness?.available) };
}

export function NativeTenantAIStatus({ tenancy, readiness, sourceError, retrySource }) {
  if (sourceError) return <p role="alert">{sourceError} <button type="button" onClick={retrySource}>Retry source</button></p>;
  if (!tenancy || !readiness) return <p role="status">Loading the selected tenancy and provider availability…</p>;
  return <p role="status">{readiness.reason || (readiness.available ? 'Review the request before generating.' : 'Legal provider execution is unavailable.')}</p>;
}

export const noticeExamples = [
  { name: 'Repair planning', noticeType: 'Repair and Deduct Notice', context: 'Draft planning example only: request a repair review. Do not assert an actual defect, prior report, expense or deadline. Leave source facts and dates for confirmation from the tenant’s records before sending.' },
  { name: 'Deposit review', noticeType: 'Security Deposit Return Demand', context: 'Draft planning example only: request an itemized deposit review. Do not invent payment amounts, move-out dates, deductions or notices. Use placeholders for unverified facts and explain required source checks.' },
  { name: 'Move-out planning', noticeType: 'Move-Out Notice (30-day)', context: 'Draft planning example only: explore a possible move-out notice. No move-out decision or date is confirmed. Identify the facts and local requirements to verify before signing or sending.' },
];
