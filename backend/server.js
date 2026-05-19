require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initDatabase } = require('./db');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tenancies', require('./routes/tenancies'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/documents', require('./routes/documents'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3002;

async function start() {
  await initDatabase();
  app.use('/api/local-law-adaptation', require('./routes/localLawAdaptation')); app.use('/api/case-outcome-prediction', require('./routes/caseOutcomePrediction')); app.use('/api/resource-directory', require('./routes/resourceDirectory')); app.use('/api/negotiation-simulation', require('./routes/negotiationSimulation')); app.use('/api/document-assembly', require('./routes/documentAssembly')); app.use('/api/deadline-tracker', require('./routes/deadlineTracker'));

// === Batch 08 Gaps & Frontend Mounts ===
app.use('/api/gap-no-ai-driven-case-outcome-prediction', require('./routes/gapNoAiDrivenCaseOutcomePrediction'));
app.use('/api/gap-no-local-law-variation-adaptation-engine', require('./routes/gapNoLocalLawVariationAdaptationEngine'));
app.use('/api/gap-no-conversational-tenant-rights-chatbot-beyond-core-ai-endpoints', require('./routes/gapNoConversationalTenantRightsChatbotBeyondCoreAiEndpoints'));
app.use('/api/gap-no-local-legal-resource-database-legal-aid-tenant', require('./routes/gapNoLocalLegalResourceDatabaseLegalAidTenant'));
app.use('/api/gap-no-integration-with-local-statutes-rent-control-habitability', require('./routes/gapNoIntegrationWithLocalStatutesRentControlHabitability'));
app.use('/api/gap-no-form-completion-helpers-interactive-interview', require('./routes/gapNoFormCompletionHelpersInteractiveInterview'));
app.use('/api/gap-no-chat-with-legal-expert-escalation', require('./routes/gapNoChatWithLegalExpertEscalation'));
app.use('/api/gap-no-notifications-or-reminders-for-deadlines-e-g', require('./routes/gapNoNotificationsOrRemindersForDeadlinesEG'));
app.use('/api/gap-no-audit-logging', require('./routes/gapNoAuditLogging'));
app.use('/api/gap-no-integrations-module', require('./routes/gapNoIntegrationsModule'));
app.use('/api/gap-no-multi-language-support-routes', require('./routes/gapNoMultiLanguageSupportRoutes'));

// === Custom Views (mounted before any catch-all/404) ===
app.use('/api/custom-views', require('./routes/customViews'));

// 404 catch-all for unknown API routes (must come AFTER all mounts)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`AI Tenant Rights server running on port ${PORT}`));
}

start().catch(console.error);
