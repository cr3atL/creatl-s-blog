import { navigationRoutes } from '../features/content-selector/directory';

const navItems = navigationRoutes.map((entry) => ({ key: entry.path, label: entry.title }));
export default navItems;
