// Old numbering/meta props remain accepted by callers but no longer add decorative labels.
export default function SectionHeader({ title, level = 2, as: Heading = 'h2', id }) {
  return <header className="archive-section-header" data-level={level}>
    <div className="archive-section-header__lead"><Heading className="archive-section-header__title" id={id}>{title}</Heading></div>
  </header>;
}
