import fs from 'fs';
const dir = process.env.DATA_DIR || './data', f = dir + '/db.json';
fs.mkdirSync(dir, { recursive: true });
export const db = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : {
  users: {}, sessions: {}, messages: [],
  group: { name: 'The Group', banner: '#f97316', perms: { send: 'member', economy: 'member', rename: 'admin' } }
};
export const save = () => fs.writeFileSync(f, JSON.stringify(db));
