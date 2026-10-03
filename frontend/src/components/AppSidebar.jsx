import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AppSidebar.css';

const STATIC_LINKS = [
  { to: '/insights/timeline', label: 'Timeline View', group: 'Insights' },
  { to: '/codex/custom-viz', label: 'Custom Viz', group: 'Insights' },
  { to: '/codex/operations', label: 'Operations', group: 'Insights' },
  { to: '/', label: 'Dashboard', group: 'Workspace' },
  { to: '/tenancies/new', label: 'New Tenancy', group: 'Workspace' },
  { to: '/case-outcome', label: 'Case Outcome', group: 'Workspace' },
  { to: '/local-law-lookup', label: 'Local Law Lookup', group: 'Workspace' },
  { to: '/negotiation-simulator', label: 'Negotiation Simulator', group: 'Workspace' },
  { to: '/document-assembly', label: 'Document Assembly', group: 'Workspace' },
  { to: '/legal-resource-directory', label: 'Legal Resource Directory', group: 'Workspace' },
  { to: '/legal-expert-chat', label: 'Legal Expert Chat', group: 'Workspace' },
  { to: '/cf-local-law-adaptation-customizing-advice-by-state-city', label: 'Cf Local Law Adaptation Customizing Advice By State', group: 'Workspace' },
  { to: '/cf-case-outcome-prediction-estimating-eviction-defense-success-probability', label: 'Cf Case Outcome Prediction Estimating Eviction Defense Success', group: 'Workspace' },
  { to: '/cf-resource-directory-linking-to-legal-aid-tenant-unions', label: 'Cf Resource Directory Linking To Legal Aid Tenant', group: 'Workspace' },
  { to: '/cf-negotiation-simulation-with-ai-role-play-for-mediation-practice', label: 'Cf Negotiation Simulation With Ai Role Play For', group: 'Workspace' },
  { to: '/cf-document-assembly-auto-filling-forms-with-tenant-data', label: 'Cf Document Assembly Auto Filling Forms With Tenant', group: 'Workspace' },
  { to: '/cf-deadline-tracker-with-notifications-for-notice-response-windows', label: 'Cf Deadline Tracker With Notifications For Notice Response', group: 'Workspace' },
  { to: '/gap-no-ai-driven-case-outcome-prediction', label: 'Gap No Ai Driven Case Outcome Prediction', group: 'Workspace' },
  { to: '/gap-no-local-law-variation-adaptation-engine', label: 'Gap No Local Law Variation Adaptation Engine', group: 'Workspace' },
  { to: '/gap-no-conversational-tenant-rights-chatbot-beyond-core-ai-endpoints', label: 'Gap No Conversational Tenant Rights Chatbot Beyond Core', group: 'Workspace' },
  { to: '/gap-no-local-legal-resource-database-legal-aid-tenant', label: 'Gap No Local Legal Resource Database Legal Aid', group: 'Workspace' },
  { to: '/gap-no-integration-with-local-statutes-rent-control-habitability', label: 'Gap No Integration With Local Statutes Rent Control', group: 'Workspace' },
  { to: '/gap-no-form-completion-helpers-interactive-interview', label: 'Gap No Form Completion Helpers Interactive Interview', group: 'Workspace' },
  { to: '/gap-no-chat-with-legal-expert-escalation', label: 'Gap No Chat With Legal Expert Escalation', group: 'Workspace' },
  { to: '/gap-no-notifications-or-reminders-for-deadlines-e-g', label: 'Gap No Notifications Or Reminders For Deadlines E', group: 'Workspace' },
  { to: '/gap-no-audit-logging', label: 'Gap No Audit Logging', group: 'Workspace' },
  { to: '/gap-no-integrations-module', label: 'Gap No Integrations Module', group: 'Workspace' },
  { to: '/gap-no-multi-language-support-routes', label: 'Gap No Multi Language Support Routes', group: 'Workspace' },
  { to: '/custom-views', label: 'Custom Views', group: 'Workspace' },
];

export default function AppSidebar({ extraLinks = [] }) {
  const LINKS = [...STATIC_LINKS, ...extraLinks];
  const [query, setQuery] = useState('');
  const visible = LINKS.filter(link => link.label.toLowerCase().includes(query.toLowerCase().trim()));
  return <aside className="codex-side" aria-label="Application navigation">
    <div className="codex-side-brand"><strong>AITenant Rights Advisor</strong><span>Workspace</span></div>
    <label className="codex-side-search-label" htmlFor="codex-side-search">Find a section</label>
    <input id="codex-side-search" className="codex-side-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search navigation" />
    <nav className="codex-side-links" aria-label="Sections">
      {['Workspace', 'AI tools', 'Insights'].map(group => {
        const items = visible.filter(link => link.group === group);
        return items.length ? <div className="codex-side-group" key={group}>
          <span className="codex-side-heading">{group}</span>
          {items.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `codex-side-link${isActive ? ' active' : ''}`}>{link.label}</NavLink>)}
        </div> : null;
      })}
      {visible.length === 0 && <p className="codex-side-empty">No matching sections</p>}
    </nav>
  </aside>;
}
