export const objectizeTitles = titles => {
  const result = {
    main: '',
    official: '',
    others: []
  }

  // indexes are reserven by `transformTitles`

  // x-jat main - japanese transcription
  const main = titles[0]
  if (main) {
    result.main = main
  }

  // en official - english
  const official = titles[1]
  if (official) {
    if (main !== official) {
      result.official = official
    }
  }

  result.others = titles
  result.others.splice(0, 2)

  return { ...result }
}
