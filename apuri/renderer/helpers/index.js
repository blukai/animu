export const objectizeTitleArray = titles => {
  if (titles) {
    const [main, official, ...others] = titles
    return {
      main,
      official,
      others
    }
  }
  return {}
}
