import Record from '../../data/Record';
import NormalizedData from '../../data/NormalizedData';
import Query from '../../query/Query';
export default class Normalizer {
    /**
     * Normalize the record.
     */
    static process(query: Query, record: Record | Record[]): NormalizedData;
    /**
     * Walk raw records and stash pivot data on each parent record so it survives
     * normalizr's entity deduplication. After this runs each parent record has:
     *   record.__pivots = { [relatedEntityId]: pivotObject }
     *
     * Only processes fields returned by model.pivotFields() that carry a pivot object
     * on their related items (BelongsToMany, MorphToMany, MorphedByMany).
     */
    private static extractPivots;
}
