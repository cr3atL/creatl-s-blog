// 洗牌算法 - Fisher-Yates shuffle
export const shuffled = (items, maxCount) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return maxCount ? array.slice(0, maxCount) : array;
};

// 随机选择单个元素
export const pickItem = (items) => {
  if (!items || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
};

// 随机选择多个元素（可重复）
export const pickItems = (items, count) => {
  if (!items || items.length === 0) return [];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pickItem(items));
  }
  return result;
};

// 随机选择多个不重复元素
export const pickUniqueItems = (items, maxCount) => {
  if (!items || items.length === 0) return [];
  return shuffled(items, Math.min(maxCount, items.length));
};