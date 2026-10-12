function createProviderGate(prefixes) {
  const routes=Object.freeze([...prefixes]);
  return function providerGate(req,res,next) {
    const requestPath=String(req.path||req.originalUrl||'');
    if(!routes.some((prefix)=>requestPath.startsWith(prefix))) return next();
    if(process.env.ENABLE_LEGACY_PROVIDER_ROUTES!=='true') return res.status(503).json({error:'PROVIDER_ROUTE_QUARANTINED',message:'Generated/provider routes require an explicit non-production evaluation gate.'});
    if(process.env.NODE_ENV==='production') return res.status(503).json({error:'PROVIDER_CONTRACT_UNVERIFIED',message:'Production provider execution remains disabled pending contract, privacy, and acceptance review.'});
    if(!process.env.OPENROUTER_API_KEY) return res.status(503).json({error:'PROVIDER_CREDENTIALS_MISSING'});
    return next();
  };
}
function providerReadiness(env = process.env) {
  if (env.ENABLE_LEGACY_PROVIDER_ROUTES !== 'true') return { available: false, reason: 'Legal provider routes are quarantined. Examples can be reviewed; provider execution is unavailable.' };
  if (env.NODE_ENV === 'production') return { available: false, reason: 'Production legal provider execution requires contract, privacy and acceptance review.' };
  if (!env.OPENROUTER_API_KEY) return { available: false, reason: 'The backend provider credential is not configured.' };
  return { available: true, reason: 'Non-production evaluation is enabled. Review source documents and generated drafts before use.' };
}
module.exports={createProviderGate,providerReadiness};
