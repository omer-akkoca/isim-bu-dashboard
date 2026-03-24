import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileText, Search, User, Briefcase, GraduationCap, Calendar } from 'lucide-react';

interface CV {
  id: string;
  title?: string;
  userId?: string;
  ownerName?: string;
  ownerEmail?: string;
  jobTitle?: string;
  summary?: string;
  skills?: string[];
  experienceCount?: number;
  educationCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

const CVsPage = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const snap = await getDocs(collection(db, 'cvs'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CV[];
        setCvs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  const filtered = cvs.filter(cv =>
    cv.title?.toLowerCase().includes(search.toLowerCase()) ||
    cv.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
    cv.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
    cv.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">CV'ler</h1>
          <p className="page-sub">Kullanıcıların oluşturduğu tüm CV'ler</p>
        </div>
        <div className="page-stat">
          <FileText size={18} />
          <span>{cvs.length} CV</span>
        </div>
      </div>

      <div className="page-search-wrap">
        <Search size={16} className="page-search-icon" />
        <input
          className="page-search"
          placeholder="CV başlığı, isim veya beceri ile ara..."
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
          <FileText size={40} />
          <p>{search ? 'Sonuç bulunamadı.' : 'Henüz CV yok.'}</p>
        </div>
      ) : (
        <div className="cv-list">
          {filtered.map(cv => (
            <div key={cv.id} className="cv-card">
              <div className="cv-card-left">
                <div className="cv-icon">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="cv-title">{cv.title || 'İsimsiz CV'}</div>
                  {cv.jobTitle && <div className="cv-job">{cv.jobTitle}</div>}
                  {cv.summary && <p className="cv-summary">{cv.summary}</p>}
                  {cv.skills && cv.skills.length > 0 && (
                    <div className="cv-skills">
                      {cv.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="cv-skill-tag">{skill}</span>
                      ))}
                      {cv.skills.length > 5 && (
                        <span className="cv-skill-more">+{cv.skills.length - 5}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="cv-card-right">
                {cv.ownerName && (
                  <div className="cv-meta">
                    <User size={13} />
                    <span>{cv.ownerName}</span>
                  </div>
                )}
                {cv.experienceCount !== undefined && (
                  <div className="cv-meta">
                    <Briefcase size={13} />
                    <span>{cv.experienceCount} deneyim</span>
                  </div>
                )}
                {cv.educationCount !== undefined && (
                  <div className="cv-meta">
                    <GraduationCap size={13} />
                    <span>{cv.educationCount} eğitim</span>
                  </div>
                )}
                {cv.updatedAt && (
                  <div className="cv-meta">
                    <Calendar size={13} />
                    <span>{new Date(cv.updatedAt?.seconds * 1000).toLocaleDateString('tr-TR')}</span>
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

export default CVsPage;
