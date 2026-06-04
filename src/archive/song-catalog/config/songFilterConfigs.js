const commonFields = {
  song: {
    title: 'title',
    artist: 'artist',
    version: 'version',
    type: 'type',
    category: 'category',
    sheets: 'sheets',
  },
  sheet: {
    difficulty: 'difficulty',
    levelValue: 'levelValue',
    internalLevelValue: 'internalLevelValue',
    level: 'level',
    type: 'type',
    noteDesigner: 'charter',
  },
};

export const createChunithmSongFilterConfig = ({
  getDifficultyColor,
  getVersionColor,
  getTypeColor,
}) => ({
  fields: commonFields,
  levelRange: {
    min: 1,
    max: 15.7,
    step: 0.1,
    default: [1, 15.7],
  },
  sheetMatchBehavior: 'prune',
  getDifficultyColor,
  getVersionColor,
  getTypeColor,
  getDifficultyClassName: (difficulty) =>
    difficulty === "WORLD'S END" ? 'ant-tag-rainbow' : '',
  getTypeClassName: (type) => (type === "WORLD'S END" ? 'ant-tag-rainbow' : ''),
});

export const createSdvxSongFilterConfig = ({
  getDifficultyColor,
  getVersionColor,
  getTypeColor,
}) => ({
  fields: commonFields,
  levelRange: {
    min: 1,
    max: 20,
    step: 0.1,
    default: [1, 20],
  },
  sheetMatchBehavior: 'songOnly',
  getDifficultyColor,
  getVersionColor,
  getTypeColor,
});
