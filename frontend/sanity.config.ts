import {defineConfig} from 'sanity';
import { structureTool } from 'sanity/structure';
import schemas from './lib/sanity/schemas';

const config = defineConfig({
  name: 'default',
  title: 'employee-management-sanity',
  projectId: 'rkkcgp3r',
  dataset: 'production',
  plugins: [structureTool()],
  basePath: '/admin',
  apiVersion: '2025-12-06',
  schema :{types:schemas}
});
export default config;