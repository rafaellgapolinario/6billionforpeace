-- Bug 12/05 noite: duas triggers AFTER INSERT na mesma tabela bfp.signatures
-- chamando bump_signature_stats() — cada INSERT contava em dobro.
--
--   trg_bump_stats           (D1, AFTER INSERT)               -- legacy, drop
--   bump_signature_stats_iu  (cliente specs, INSERT OR UPDATE) -- keep
--
-- A função é idempotente em si, mas é chamada uma vez por trigger.
-- Mantemos `bump_signature_stats_iu` porque cobre o caso UPDATE
-- confirmed_at NULL→NOT NULL (necessário se double opt-in for reativado).

DROP TRIGGER IF EXISTS trg_bump_stats ON bfp.signatures;
