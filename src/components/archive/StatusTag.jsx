const labels = { DRAFT: '预览', ARCHIVED: '已归档', 'COMING SOON': '筹备中' };

export default function StatusTag({ status, children }) {
  const label = children || labels[status];
  if (!label) return null;
  return <span className="archive-status"><span className="archive-status__label">{label}</span></span>;
}
