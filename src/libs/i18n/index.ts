import { i18nLanguages } from "@/components/DatePicker/DatePicker"

import cn from './cn.json'
import en from './en.json'
import de from './de.json'
import es from './es.json'
import fr from './fr.json'
import pt from './pt.json'
import mg from './mg.json'
import vi from './vi.json'

export const getTranslation = (language: i18nLanguages) => {
  switch (language) {
      case 'en':
          return en
      case 'cn':
          return cn
      case 'es':
          return es
      case 'de':
          return de
      case 'pt':
          return pt
      case 'fr':
          return fr
      case 'mg':
          return mg
      case 'vi':
          return vi
      default:
          return en
  }
}