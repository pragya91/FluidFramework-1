## Alpha API Report File for "@fluidframework/presence"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @alpha
export function acquirePresence(fluidContainer: IFluidContainer): IPresence;

// @alpha
export function acquirePresenceViaDataObject(fluidLoadable: ExperimentalPresenceDO): IPresence;

// @alpha @sealed
export interface BroadcastControls {
    allowableUpdateLatencyMs: number | undefined;
}

// @alpha
export interface BroadcastControlSettings {
    readonly allowableUpdateLatencyMs?: number;
}

// @alpha
export type ClientConnectionId = string;

// @alpha
export type ClientSessionId = SessionId & {
    readonly ClientSessionId: "ClientSessionId";
};

// @alpha @sealed
export class ExperimentalPresenceDO {
}

// @alpha
export const ExperimentalPresenceManager: SharedObjectKind<IFluidLoadable & ExperimentalPresenceDO>;

// @alpha
export namespace InternalTypes {
    export type ManagerFactory<TKey extends string, TValue extends ValueDirectoryOrState<any>, TManager> = {
        instanceBase: new (...args: any[]) => any;
    } & ((key: TKey, datastoreHandle: StateDatastoreHandle<TKey, TValue>) => {
        initialData?: {
            value: TValue;
            allowableUpdateLatencyMs: number | undefined;
        };
        manager: StateValue<TManager>;
    });
    // (undocumented)
    export interface MapValueState<T, Keys extends string | number> {
        // (undocumented)
        items: {
            [name in Keys]: ValueOptionalState<T>;
        };
        // (undocumented)
        rev: number;
    }
    // (undocumented)
    export interface NotificationType {
        // (undocumented)
        args: (JsonSerializable<unknown> & JsonDeserialized<unknown>)[];
        // (undocumented)
        name: string;
    }
    // (undocumented)
    export class StateDatastoreHandle<TKey, TValue extends ValueDirectoryOrState<any>> {
    }
    export type StateValue<T> = T & StateValueBrand<T>;
    export class StateValueBrand<T> {
    }
    // (undocumented)
    export interface ValueDirectory<T> {
        // (undocumented)
        items: {
            [name: string | number]: ValueOptionalState<T> | ValueDirectory<T>;
        };
        // (undocumented)
        rev: number;
    }
    // (undocumented)
    export type ValueDirectoryOrState<T> = ValueRequiredState<T> | ValueDirectory<T>;
    // (undocumented)
    export interface ValueOptionalState<TValue> extends ValueStateMetadata {
        // (undocumented)
        value?: JsonDeserialized<TValue>;
    }
    // (undocumented)
    export interface ValueRequiredState<TValue> extends ValueStateMetadata {
        // (undocumented)
        value: JsonDeserialized<TValue>;
    }
    // (undocumented)
    export interface ValueStateMetadata {
        // (undocumented)
        rev: number;
        // (undocumented)
        timestamp: number;
    }
}

// @alpha
export namespace InternalUtilityTypes {
    export type FullyReadonly<T> = {
        readonly [K in keyof T]: FullyReadonly<T[K]>;
    };
    export type IsNotificationListener<Event> = Event extends (...args: infer P) => void ? InternalUtilityTypes_2.IfSameType<P, JsonSerializable<P> & JsonDeserialized<P>, true, false> : false;
    export type JsonDeserializedParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? JsonDeserialized<P> : never;
    export type JsonSerializableParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? JsonSerializable<P> : never;
    export type NotificationListeners<E> = {
        [P in string & keyof E as IsNotificationListener<E[P]> extends true ? P : never]: E[P];
    };
}

// @alpha @sealed
export interface IPresence {
    readonly events: Listenable<PresenceEvents>;
    getAttendee(clientId: ClientConnectionId | ClientSessionId): ISessionClient;
    getAttendees(): ReadonlySet<ISessionClient>;
    getMyself(): ISessionClient;
    getNotifications<NotificationsSchema extends PresenceNotificationsSchema>(notificationsId: PresenceWorkspaceAddress, requestedContent: NotificationsSchema): PresenceNotifications<NotificationsSchema>;
    getStates<StatesSchema extends PresenceStatesSchema>(workspaceAddress: PresenceWorkspaceAddress, requestedContent: StatesSchema, controls?: BroadcastControlSettings): PresenceStates<StatesSchema>;
}

// @alpha @sealed
export interface ISessionClient<SpecificSessionClientId extends ClientSessionId = ClientSessionId> {
    getConnectionId(): ClientConnectionId;
    getConnectionStatus(): SessionClientStatus;
    readonly sessionId: SpecificSessionClientId;
}

// @alpha
export function Latest<T extends object, Key extends string = string>(initialValue: JsonSerializable<T> & JsonDeserialized<T> & object, controls?: BroadcastControlSettings): InternalTypes.ManagerFactory<Key, InternalTypes.ValueRequiredState<T>, LatestValueManager<T>>;

// @alpha
export function LatestMap<T extends object, Keys extends string | number = string | number, RegistrationKey extends string = string>(initialValues?: {
    [K in Keys]: JsonSerializable<T> & JsonDeserialized<T>;
}, controls?: BroadcastControlSettings): InternalTypes.ManagerFactory<RegistrationKey, InternalTypes.MapValueState<T, Keys>, LatestMapValueManager<T, Keys>>;

// @alpha @sealed
export interface LatestMapItemRemovedClientData<K extends string | number> {
    // (undocumented)
    client: ISessionClient;
    // (undocumented)
    key: K;
    // (undocumented)
    metadata: LatestValueMetadata;
}

// @alpha @sealed
export interface LatestMapItemValueClientData<T, K extends string | number> extends LatestValueClientData<T> {
    // (undocumented)
    key: K;
}

// @alpha @sealed
export interface LatestMapValueClientData<T, Keys extends string | number, SpecificSessionClientId extends ClientSessionId = ClientSessionId> {
    client: ISessionClient<SpecificSessionClientId>;
    // (undocumented)
    items: ReadonlyMap<Keys, LatestValueData<T>>;
}

// @alpha @sealed
export interface LatestMapValueManager<T, Keys extends string | number = string | number> {
    clients(): ISessionClient[];
    clientValue(client: ISessionClient): ReadonlyMap<Keys, LatestValueData<T>>;
    clientValues(): IterableIterator<LatestMapValueClientData<T, Keys>>;
    readonly controls: BroadcastControls;
    readonly events: Listenable<LatestMapValueManagerEvents<T, Keys>>;
    readonly local: ValueMap<Keys, T>;
}

// @alpha @sealed (undocumented)
export interface LatestMapValueManagerEvents<T, K extends string | number> {
    // @eventProperty
    itemRemoved: (removedItem: LatestMapItemRemovedClientData<K>) => void;
    // @eventProperty
    itemUpdated: (updatedItem: LatestMapItemValueClientData<T, K>) => void;
    // @eventProperty
    localItemRemoved: (removedItem: {
        key: K;
    }) => void;
    // @eventProperty
    localItemUpdated: (updatedItem: {
        value: InternalUtilityTypes.FullyReadonly<JsonSerializable<T> & JsonDeserialized<T>>;
        key: K;
    }) => void;
    // @eventProperty
    updated: (updates: LatestMapValueClientData<T, K>) => void;
}

// @alpha @sealed
export interface LatestValueClientData<T> extends LatestValueData<T> {
    // (undocumented)
    client: ISessionClient;
}

// @alpha @sealed
export interface LatestValueData<T> {
    // (undocumented)
    metadata: LatestValueMetadata;
    // (undocumented)
    value: InternalUtilityTypes.FullyReadonly<JsonDeserialized<T>>;
}

// @alpha @sealed
export interface LatestValueManager<T> {
    clients(): ISessionClient[];
    clientValue(client: ISessionClient): LatestValueData<T>;
    clientValues(): IterableIterator<LatestValueClientData<T>>;
    readonly controls: BroadcastControls;
    readonly events: Listenable<LatestValueManagerEvents<T>>;
    get local(): InternalUtilityTypes.FullyReadonly<JsonDeserialized<T>>;
    set local(value: JsonSerializable<T> & JsonDeserialized<T>);
}

// @alpha @sealed (undocumented)
export interface LatestValueManagerEvents<T> {
    // @eventProperty
    localUpdated: (update: {
        value: InternalUtilityTypes.FullyReadonly<JsonSerializable<T> & JsonDeserialized<T>>;
    }) => void;
    // @eventProperty
    updated: (update: LatestValueClientData<T>) => void;
}

// @alpha @sealed
export interface LatestValueMetadata {
    revision: number;
    timestamp: number;
}

// @alpha @sealed
export interface NotificationEmitter<E extends InternalUtilityTypes.NotificationListeners<E>> {
    broadcast<K extends string & keyof InternalUtilityTypes.NotificationListeners<E>>(notificationName: K, ...args: Parameters<E[K]>): void;
    unicast<K extends string & keyof InternalUtilityTypes.NotificationListeners<E>>(notificationName: K, targetClient: ISessionClient, ...args: Parameters<E[K]>): void;
}

// @alpha @sealed
export interface NotificationListenable<TListeners extends InternalUtilityTypes.NotificationListeners<TListeners>> {
    off<K extends keyof InternalUtilityTypes.NotificationListeners<TListeners>>(notificationName: K, listener: (sender: ISessionClient, ...args: InternalUtilityTypes.JsonDeserializedParameters<TListeners[K]>) => void): void;
    on<K extends keyof InternalUtilityTypes.NotificationListeners<TListeners>>(notificationName: K, listener: (sender: ISessionClient, ...args: InternalUtilityTypes.JsonDeserializedParameters<TListeners[K]>) => void): Off;
}

// @alpha
export function Notifications<T extends InternalUtilityTypes.NotificationListeners<T>, Key extends string = string>(initialSubscriptions: Partial<NotificationSubscriptions<T>>): InternalTypes.ManagerFactory<Key, InternalTypes.ValueRequiredState<InternalTypes.NotificationType>, NotificationsManager<T>>;

// @alpha @sealed
export interface NotificationsManager<T extends InternalUtilityTypes.NotificationListeners<T>> {
    readonly emit: NotificationEmitter<T>;
    readonly events: Listenable<NotificationsManagerEvents>;
    readonly notifications: NotificationListenable<T>;
}

// @alpha @sealed (undocumented)
export interface NotificationsManagerEvents {
    // @eventProperty
    unattendedNotification: (name: string, sender: ISessionClient, ...content: unknown[]) => void;
}

// @alpha @sealed
export type NotificationSubscriptions<E extends InternalUtilityTypes.NotificationListeners<E>> = {
    [K in string & keyof InternalUtilityTypes.NotificationListeners<E>]: (sender: ISessionClient, ...args: InternalUtilityTypes.JsonDeserializedParameters<E[K]>) => void;
};

// @alpha @sealed (undocumented)
export interface PresenceEvents {
    // @eventProperty
    attendeeDisconnected: (attendee: ISessionClient) => void;
    // @eventProperty
    attendeeJoined: (attendee: ISessionClient) => void;
    workspaceActivated: (workspaceAddress: PresenceWorkspaceAddress, type: "States" | "Notifications" | "Unknown") => void;
}

// @alpha @sealed
export interface PresenceNotifications<TSchema extends PresenceNotificationsSchema> {
    add<TKey extends string, TValue extends InternalTypes.ValueDirectoryOrState<any>, TManager extends NotificationsManager<any>>(key: TKey, manager: InternalTypes.ManagerFactory<TKey, TValue, TManager>): asserts this is PresenceNotifications<TSchema & Record<TKey, InternalTypes.ManagerFactory<TKey, TValue, TManager>>>;
    readonly props: PresenceStatesEntries<TSchema>;
}

// @alpha
export interface PresenceNotificationsSchema {
    // (undocumented)
    [key: string]: InternalTypes.ManagerFactory<typeof key, InternalTypes.ValueRequiredState<InternalTypes.NotificationType>, NotificationsManager<any>>;
}

// @alpha @sealed
export interface PresenceStates<TSchema extends PresenceStatesSchema, TManagerConstraints = unknown> {
    add<TKey extends string, TValue extends InternalTypes.ValueDirectoryOrState<any>, TManager extends TManagerConstraints>(key: TKey, manager: InternalTypes.ManagerFactory<TKey, TValue, TManager>): asserts this is PresenceStates<TSchema & Record<TKey, InternalTypes.ManagerFactory<TKey, TValue, TManager>>, TManagerConstraints>;
    readonly controls: BroadcastControls;
    readonly props: PresenceStatesEntries<TSchema>;
}

// @alpha @sealed
export type PresenceStatesEntries<TSchema extends PresenceStatesSchema> = {
    /**
    * Registered `Value Manager`s
    */
    readonly [Key in keyof TSchema]: ReturnType<TSchema[Key]>["manager"] extends InternalTypes.StateValue<infer TManager> ? TManager : never;
};

// @alpha
export interface PresenceStatesSchema {
    // (undocumented)
    [key: string]: PresenceWorkspaceEntry<typeof key, InternalTypes.ValueDirectoryOrState<any>>;
}

// @alpha
export type PresenceWorkspaceAddress = `${string}:${string}`;

// @alpha
export type PresenceWorkspaceEntry<TKey extends string, TValue extends InternalTypes.ValueDirectoryOrState<unknown>, TManager = unknown> = InternalTypes.ManagerFactory<TKey, TValue, TManager>;

// @alpha
export const SessionClientStatus: {
    readonly Connected: "Connected";
    readonly Disconnected: "Disconnected";
};

// @alpha
export type SessionClientStatus = (typeof SessionClientStatus)[keyof typeof SessionClientStatus];

// @alpha @sealed
export interface ValueMap<K extends string | number, V> {
    clear(): void;
    // (undocumented)
    delete(key: K): boolean;
    forEach(callbackfn: (value: InternalUtilityTypes.FullyReadonly<JsonDeserialized<V>>, key: K, map: ValueMap<K, V>) => void, thisArg?: unknown): void;
    get(key: K): InternalUtilityTypes.FullyReadonly<JsonDeserialized<V>> | undefined;
    // (undocumented)
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value: JsonSerializable<V> & JsonDeserialized<V>): this;
    // (undocumented)
    readonly size: number;
}

```
