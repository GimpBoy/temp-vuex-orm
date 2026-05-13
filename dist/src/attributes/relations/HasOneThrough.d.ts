import { Schema as NormalizrSchema } from 'normalizr';
import Schema from '../../schema/Schema';
import { Record, Records, NormalizedData, Collection } from '../../data';
import Model from '../../model/Model';
import Query from '../../query/Query';
import Constraint from '../../query/contracts/RelationshipConstraint';
import Relation from './Relation';
export declare type Entity = typeof Model | string;
export default class HasOneThrough extends Relation {
    /**
     * The related model.
     */
    related: typeof Model;
    /**
     * The "through" parent model.
     */
    through: typeof Model;
    /**
     * The near key on the relation.
     */
    firstKey: string;
    /**
     * The far key on the relation.
     */
    secondKey: string;
    /**
     * The local key on the relation.
     */
    localKey: string;
    /**
     * The local key on the intermediary model.
     */
    secondLocalKey: string;
    /**
     * Create a new relation instance.
     */
    constructor(model: typeof Model, related: Entity, through: Entity, firstKey: string, secondKey: string, localKey: string, secondLocalKey: string);
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): NormalizrSchema;
    /**
     * Since the relation doesn't have a foreign key, there is no relational key
     * to attach to the given data.
     */
    attach(_key: any, _record: Record, _data: NormalizedData): void;
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    make(value: any, _parent: Record, _key: string): Model | null;
    /**
     * Load the relation for the given collection.
     */
    load(query: Query, collection: Collection, name: string, constraints: Constraint[]): void;
    /**
     * Set the constraints for the "through" relation.
     */
    addEagerConstraintForThrough(query: Query, collection: Collection): void;
    /**
     * Set the constraints for the "related" relation.
     */
    addEagerConstraintForRelated(query: Query, collection: Collection): void;
    /**
     * Create a new indexed map for the "through" relation.
     */
    mapThroughRelations(through: Collection, relatedQuery: Query): Records;
}
