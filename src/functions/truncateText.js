export const truncateText = (text, charLimit) => {
  if (text.length <= charLimit) {
    return text;
  }
  const truncated = text.slice(0, charLimit);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  if (lastSpaceIndex !== -1) {
    return `${truncated.slice(0, lastSpaceIndex)}...`;
  }
  return `${truncated}...`;
};
