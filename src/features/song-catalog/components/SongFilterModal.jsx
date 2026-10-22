import React, { useRef, useState } from 'react';

import useFocusTrap from '../../../hooks/useFocusTrap';
import '../styles/song-catalog.css';

const SECTIONS = [
  { key: 'title', label: '曲名 / 艺术家' },
  { key: 'difficulty', label: '难度' },
  { key: 'level', label: '等级' },
  { key: 'version', label: '版本' },
  { key: 'type', label: '类型 / 分类' },
  { key: 'noteDesigner', label: '谱面设计' },
  { key: 'bpm', label: 'BPM' },
];

const ChipGroup = ({ values, options, onToggle, isSelected }) => {
  if (!options || options.length === 0) {
    return (
      <p className="song-catalog-filter__empty">— 暂无可选值 —</p>
    );
  }
  return (
    <div className="song-catalog-filter__chips" role="group">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const active = isSelected(value);
        return (
          <button
            key={value}
            type="button"
            className={
              active
                ? 'song-catalog-filter__chip is-active'
                : 'song-catalog-filter__chip'
            }
            onClick={() => onToggle(value)}
            aria-pressed={active}
          >
            <span className="song-catalog-filter__chip-marker">
              {active ? '[x]' : '[ ]'}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
};

const AccordionSection = ({ sectionKey, label, open, onToggle, children }) => {
  return (
    <section
      className={
        open
          ? 'song-catalog-filter__section is-open'
          : 'song-catalog-filter__section'
      }
    >
      <button
        type="button"
        className="song-catalog-filter__section-head"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="song-catalog-filter__section-prefix">
          {open ? '▾' : '▸'}
        </span>
        <span className="song-catalog-filter__section-label">{label}</span>
      </button>
      {open && (
        <div className="song-catalog-filter__section-body">{children}</div>
      )}
    </section>
  );
};

const parseBpmInput = (raw) => {
  if (raw === '') return null;
  const next = Number(raw);
  if (Number.isNaN(next)) return null;
  return Math.max(0, next);
};

const SongFilterModal = ({
  open,
  onClose,
  tempFilters,
  setTempFilterValue,
  resetTempFilters,
  applyTempFilters,
  options,
  config,
  activeCount,
}) => {
  const panelRef = useRef(null);
  const [openSections, setOpenSections] = useState([
    'title',
    'difficulty',
    'level',
  ]);

  useFocusTrap(open, onClose, panelRef);

  if (!open) return null;

  const expandAll = () => {
    setOpenSections(SECTIONS.map((section) => section.key));
  };

  const collapseAll = () => setOpenSections([]);

  const toggleSection = (key) => {
    setOpenSections((current) => {
      if (current.includes(key)) return current.filter((k) => k !== key);
      const next = [...current, key];
      return next.length > 4 ? next.slice(next.length - 4) : next;
    });
  };

  const toggleArrayValue = (key, value) => {
    setTempFilterValue(
      key,
      (tempFilters[key] || []).includes(value)
        ? (tempFilters[key] || []).filter((v) => v !== value)
        : [...(tempFilters[key] || []), value]
    );
  };

  const levelBounds = config.levelRange;

  return (
    <div
      className="song-catalog-filter__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="筛选模式"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="song-catalog-filter__panel"
        role="document"
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="song-catalog-filter__header">
          <div>
            <span className="song-catalog-filter__eyebrow">筛选模式</span>
            <h2 className="song-catalog-filter__title">筛选条件</h2>
          </div>
          <div className="song-catalog-filter__status">
            <span>已选：{activeCount}</span>
            <button
              type="button"
              className="song-catalog-filter__close"
              onClick={onClose}
              aria-label="关闭筛选"
            >
              [ × ]
            </button>
          </div>
        </header>

        <div className="song-catalog-filter__section-controls">
          <button
            type="button"
            className="song-catalog-filter__section-toggle"
            onClick={expandAll}
          >
            全部展开
          </button>
          <button
            type="button"
            className="song-catalog-filter__section-toggle"
            onClick={collapseAll}
          >
            全部收起
          </button>
        </div>

        <div className="song-catalog-filter__sections">
          <AccordionSection
            sectionKey="title"
            label="曲名 / 艺术家"
            open={openSections.includes('title')}
            onToggle={() => toggleSection('title')}
          >
            <div className="song-catalog-filter__field-grid">
              <label className="song-catalog-filter__field">
                <span className="song-catalog-filter__field-label">曲名</span>
                <input
                  type="search"
                  className="song-catalog-filter__input"
                  value={tempFilters.searchText}
                  placeholder="输入片段匹配"
                  onChange={(event) =>
                    setTempFilterValue('searchText', event.target.value)
                  }
                />
              </label>
              <label className="song-catalog-filter__field">
                <span className="song-catalog-filter__field-label">艺术家</span>
                <input
                  type="search"
                  className="song-catalog-filter__input"
                  value={tempFilters.artistFilter}
                  placeholder="输入片段匹配"
                  onChange={(event) =>
                    setTempFilterValue('artistFilter', event.target.value)
                  }
                />
              </label>
            </div>
          </AccordionSection>

          <AccordionSection
            sectionKey="difficulty"
            label="难度"
            open={openSections.includes('difficulty')}
            onToggle={() => toggleSection('difficulty')}
          >
            <ChipGroup
              values={tempFilters.difficultyFilter}
              options={options.difficulties}
              isSelected={(value) => tempFilters.difficultyFilter.includes(value)}
              onToggle={(value) => toggleArrayValue('difficultyFilter', value)}
            />
          </AccordionSection>

          <AccordionSection
            sectionKey="level"
            label="等级"
            open={openSections.includes('level')}
            onToggle={() => toggleSection('level')}
          >
            <div className="song-catalog-filter__field-grid">
              <label className="song-catalog-filter__field">
                <span className="song-catalog-filter__field-label">最低</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className="song-catalog-filter__input"
                  min={levelBounds.min}
                  max={levelBounds.max}
                  step={levelBounds.step}
                  value={tempFilters.levelRange[0]}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isNaN(next)) return;
                    setTempFilterValue('levelRange', [
                      Math.max(
                        levelBounds.min,
                        Math.min(next, tempFilters.levelRange[1])
                      ),
                      tempFilters.levelRange[1],
                    ]);
                  }}
                />
              </label>
              <label className="song-catalog-filter__field">
                <span className="song-catalog-filter__field-label">最高</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className="song-catalog-filter__input"
                  min={levelBounds.min}
                  max={levelBounds.max}
                  step={levelBounds.step}
                  value={tempFilters.levelRange[1]}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isNaN(next)) return;
                    setTempFilterValue('levelRange', [
                      tempFilters.levelRange[0],
                      Math.min(
                        levelBounds.max,
                        Math.max(next, tempFilters.levelRange[0])
                      ),
                    ]);
                  }}
                />
              </label>
            </div>
            <p className="song-catalog-filter__hint">
              范围 {tempFilters.levelRange[0]} - {tempFilters.levelRange[1]} /
              默认 {levelBounds.default[0]} - {levelBounds.default[1]}
            </p>
          </AccordionSection>

          <AccordionSection
            sectionKey="version"
            label="版本"
            open={openSections.includes('version')}
            onToggle={() => toggleSection('version')}
          >
            <ChipGroup
              values={tempFilters.versionFilter}
              options={options.versions}
              isSelected={(value) => tempFilters.versionFilter.includes(value)}
              onToggle={(value) => toggleArrayValue('versionFilter', value)}
            />
          </AccordionSection>

          <AccordionSection
            sectionKey="type"
            label="类型 / 分类"
            open={openSections.includes('type')}
            onToggle={() => toggleSection('type')}
          >
            <ChipGroup
              values={tempFilters.typeFilter}
              options={options.types}
              isSelected={(value) => tempFilters.typeFilter.includes(value)}
              onToggle={(value) => toggleArrayValue('typeFilter', value)}
            />
          </AccordionSection>

          <AccordionSection
            sectionKey="noteDesigner"
            label="谱面设计"
            open={openSections.includes('noteDesigner')}
            onToggle={() => toggleSection('noteDesigner')}
          >
            <ChipGroup
              values={tempFilters.noteDesignerFilter}
              options={options.noteDesigners}
              isSelected={(value) =>
                tempFilters.noteDesignerFilter.includes(value)
              }
              onToggle={(value) =>
                toggleArrayValue('noteDesignerFilter', value)
              }
            />
          </AccordionSection>

          <AccordionSection
            sectionKey="bpm"
            label="BPM"
            open={openSections.includes('bpm')}
            onToggle={() => toggleSection('bpm')}
          >
            <div className="song-catalog-filter__field-grid">
              <label className="song-catalog-filter__field">
                <span className="song-catalog-filter__field-label">最低</span>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="song-catalog-filter__input"
                  value={tempFilters.bpmMin ?? ''}
                  onChange={(event) => {
                    const raw = event.target.value;
                    setTempFilterValue('bpmMin', parseBpmInput(raw));
                  }}
                />
              </label>
              <label className="song-catalog-filter__field">
                <span className="song-catalog-filter__field-label">最高</span>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="song-catalog-filter__input"
                  value={tempFilters.bpmMax ?? ''}
                  onChange={(event) => {
                    const raw = event.target.value;
                    setTempFilterValue('bpmMax', parseBpmInput(raw));
                  }}
                />
              </label>
            </div>
            <p className="song-catalog-filter__hint">
              默认不限；小于 0 的值会按 0 处理。
            </p>
          </AccordionSection>
        </div>

        <footer className="song-catalog-filter__footer">
          <button
            type="button"
            className="song-catalog-filter__action"
            onClick={resetTempFilters}
          >
            清空
          </button>
          <button
            type="button"
            className="song-catalog-filter__action"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            className="song-catalog-filter__action song-catalog-filter__action--accent"
            onClick={() => {
              applyTempFilters();
              onClose();
            }}
          >
            应用筛选
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SongFilterModal;
