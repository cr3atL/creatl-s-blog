import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import AppShell from './AppShell';
import BrandLogo from './brand/BrandLogo';
import navItems from './navItems';
import useNavigationExit from './useNavigationExit';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const { leave, cancel } = useNavigationExit();
  const closeNavigation = () => {
    leave(document.querySelector('.shell-navigation-drawer'));
    setOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  };
  const location = useLocation();
  const links = (close) => navItems.map((item) => {
    const active = item.key === '/' ? location.pathname === '/' || location.pathname === '/home'
      : location.pathname === item.key || location.pathname.startsWith(`${item.key}/`);
    return <Link key={item.key} to={item.key}
      className={`shell-nav__link${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}
      onClick={close}>{item.label}</Link>;
  });

  return <AppShell header={() => <>
    <header className="shell-header">
      <div className="shell-header__inner">
        <Link to="/" className="shell-home" aria-label="creatL 首页"><BrandLogo /></Link>
        <nav className="shell-nav" aria-label="主导航">{links()}</nav>
        <Button ref={menuButtonRef} type="text" className="shell-mobile-menu-button" icon={<MenuOutlined />} aria-label="打开导航菜单" onClick={() => { cancel(); setOpen(true); }} />
      </div>
    </header>
    {open && <Drawer title="导航" open onClose={closeNavigation} className="shell-drawer" rootClassName="shell-navigation-drawer" width="min(304px, 88vw)">
      <nav className="shell-mobile-nav" aria-label="移动导航">{links(closeNavigation)}</nav>
    </Drawer>}
  </>}>{children}</AppShell>;
}
