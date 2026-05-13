import { normalize } from 'normalizr'
import Utils from '../../support/Utils'
import Record from '../../data/Record'
import NormalizedData from '../../data/NormalizedData'
import Query from '../../query/Query'

export default class Normalizer {
  /**
   * Normalize the record.
   */
  static process(query: Query, record: Record | Record[]): NormalizedData {
    if (Utils.isEmpty(record)) {
      return {}
    }

    // Pre-extract MorphToMany / MorphedByMany / BelongsToMany pivot data onto
    // each parent record before normalizr runs its entity deduplication pass.
    //
    // The problem: when the same related entity (e.g. QuestionGroup "185b...") is
    // embedded under multiple parents (e.g. Category "Equipment" and Category "EWP")
    // in a single API response, normalizr merges them into one record keyed by ID.
    // The last parent to be processed overwrites the `pivot` field, so PivotCreator
    // ends up reading the wrong pivot data for every parent except the last one.
    //
    // The fix: before normalizr collapses entities, walk the raw records and stash
    // each related item's pivot under record.__pivots[relatedId] on the PARENT.
    // PivotCreator reads __pivots first, so it always sees the correct per-parent pivot
    // regardless of what normalizr did to the shared related entity.
    const records = Utils.isArray(record) ? record : [record]
    this.extractPivots(query, records)

    const entity = query.database.schemas[query.model.entity]

    const schema = Utils.isArray(record) ? [entity] : entity

    return normalize(record, schema).entities as NormalizedData
  }

  /**
   * Walk raw records and stash pivot data on each parent record so it survives
   * normalizr's entity deduplication. After this runs each parent record has:
   *   record.__pivots = { [relatedEntityId]: pivotObject }
   *
   * Only processes fields returned by model.pivotFields() that carry a pivot object
   * on their related items (BelongsToMany, MorphToMany, MorphedByMany).
   */
  private static extractPivots(query: Query, records: Record[]): void {
    const pivotFields = query.model.pivotFields()

    if (pivotFields.length === 0) {
      return
    }

    records.forEach((record) => {
      pivotFields.forEach((fieldMap: Record) => {
        Object.keys(fieldMap).forEach((key) => {
          const related = record[key]

          if (!Utils.isArray(related)) {
            return
          }

          const field = fieldMap[key]
          const pivotKey: string = field.pivotKey ?? 'pivot'

          related.forEach((item: Record) => {
            if (!item || typeof item !== 'object' || !item.id || !item[pivotKey]) {
              return
            }

            record.__pivots = record.__pivots || {}
            record.__pivots[pivotKey] = record.__pivots[pivotKey] || {}
            record.__pivots[pivotKey][item.id] = item[pivotKey]
          })
        })
      })
    })
  }
}
