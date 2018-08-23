import { Rule } from 'models'

const { onPageChanged } = chrome.declarativeContent

export const setPageChangeRules = (rules: Rule[]) =>
  new Promise<Rule[]>(res => {
    onPageChanged.removeRules(undefined, () =>
      onPageChanged.addRules(rules, res),
    )
  })
