import { NavLink } from 'react-router-dom';
import { Home, Map, Compass, User, MessageCircle } from 'lucide-react';
import styles from './NavBar.module.css';

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/account', label: 'Account', icon: User },
  { to: '/concierge', label: 'Support', icon: MessageCircle },
];

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => [styles.tab, isActive ? styles.active : ''].join(' ')}
        >
          <Icon size={22} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
