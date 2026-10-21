# Bot Chat
Installable chat app (PWA) for the WhatsApp bot. No dependencies, Node 20+.
Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY (balance only: cb_users + cb_transactions), OWNER_NUMBER (digits), DATA_DIR (optional).
Start: npm start
Files: server/ (auth, chat+permissions, economy, pets, store) and public/js (one module per screen).
