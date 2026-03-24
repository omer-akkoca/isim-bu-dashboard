import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  createdAt?: any;
  photoURL?: string;
  title?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    (u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.title?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kullanıcılar</h1>
          <p className="page-sub">Uygulamaya kayıtlı tüm kullanıcılar</p>
        </div>
        <div className="page-stat">
          <Users size={18} />
          <span>{users.length} kullanıcı</span>
        </div>
      </div>

      <div className="page-search-wrap">
        <Search size={16} className="page-search-icon" />
        <input
          className="page-search"
          placeholder="İsim, e-posta veya ünvan ile ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="page-loading">
          <div className="loading-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="page-empty">
          <Users size={40} />
          <p>{search ? 'Sonuç bulunamadı.' : 'Henüz kullanıcı yok.'}</p>
        </div>
      ) : (
        <div className="user-grid">
          {filtered.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card-top">
                <div className="user-avatar">
                  {user.photoURL
                    ? <img src={user.photoURL} alt={user.fullName} />
                    : <span>{(user.fullName || user.email || '?')[0].toUpperCase()}</span>
                  }
                </div>
                <div>
                  <div className="user-name">{user.fullName || '—'}</div>
                  {user.title && <div className="user-title">{user.title}</div>}
                </div>
              </div>
              <div className="user-card-details">
                {user.email && (
                  <div className="user-detail">
                    <Mail size={13} />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="user-detail">
                    <Phone size={13} />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="user-detail">
                    <MapPin size={13} />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="user-detail">
                    <Calendar size={13} />
                    <span>{new Date(user.createdAt?.seconds * 1000).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
