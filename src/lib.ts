import { v4 } from 'uuid'
import {
  Duration as DurationObject,
  intervalToDuration,
  formatISODuration,
  formatDuration
} from 'date-fns'

export type KeyMapping = {
  keys: string[]
  description: string
  callback?: () => void
}
export const keymap = (mappings: KeyMapping[]) =>
  mappings.forEach(mapping => {
    if (mapping.callback) {
      mapping.keys.forEach(key => {
        document.addEventListener('keydown', ev => {
          if (ev.key == key) {
            console.log(ev.key)
            ev.preventDefault()
            mapping.callback!()
          }
        })
      })
    }
  })

export const uuid = v4

export class Duration {
  public obj: DurationObject

  /**
   * @param duration - Number of seconds, ISO 8601 string, or start and end
   *   dates. Start and end dates can be expressed in epoch time or as Dates
   */
  constructor(
    duration: number | string | { start: number | Date; end: number | Date }
  ) {
    if (typeof duration == 'string') {
      this.obj = {
        years:
          Number(duration.match(/P[^T]*?([0-9]*\.?[0-9]*)Y/)?.[1]) || undefined,
        months:
          Number(duration.match(/P[^T]*?([0-9]*\.?[0-9]*)M/)?.[1]) || undefined,
        weeks:
          Number(duration.match(/P[^T]*?([0-9]*\.?[0-9]*)W/)?.[1]) || undefined,
        days:
          Number(duration.match(/P[^T]*?([0-9]*\.?[0-9]*)D/)?.[1]) || undefined,
        hours:
          Number(duration.match(/P.*?T.*?([0-9]*\.?[0-9]*)H/)?.[1]) ||
          undefined,
        minutes:
          Number(duration.match(/P.*?T.*?([0-9]*\.?[0-9]*)M/)?.[1]) ||
          undefined,
        seconds:
          Number(duration.match(/P.*?T.*?([0-9]*\.?[0-9]*)S/)?.[1]) || undefined
      }
      return
    } else if (typeof duration == 'number') {
      duration = {
        start: new Date().getTime() - duration * 1000,
        end: new Date()
      }
    }

    this.obj = intervalToDuration(duration)
  }

  iso = () => formatISODuration(this.obj)

  format = (formatOptions?: {
    format?: string[]
    zero?: boolean
    delimiter?: string
    locale?: Locale
  }) => formatDuration(this.obj, formatOptions)

  /** @returns `0:00` */
  colons = () =>
    Object.values(this.obj)
      .filter(v => v)
      .map((v, i) =>
        i == Object.values(this.obj).length
          ? Math.round(v || 0)
          : Math.round(v || 0)
            .toString()
            .padStart(2, '0')
      )
      .join(':')
      .padStart(4, '0:00')

  /**
   * TODO: Test with large numbers. I'm not sure how many days a month counts as
   * and how weeks are factored in
   */
  seconds = () =>
    (this.obj.seconds || 0) +
    (this.obj.minutes || 0) * 60 +
    (this.obj.hours || 0) * 60 * 60 +
    (this.obj.days || 0) * 60 * 60 * 24 +
    (this.obj.weeks || 0) * 60 * 60 * 24 * 7 +
    (this.obj.months || 0) * 60 * 60 * 24 * 30 +
    (this.obj.years || 0) * 60 * 60 * 24 * 365
}
