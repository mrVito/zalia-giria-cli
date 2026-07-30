import type { ActionStatus } from './ActionStatus.ts';

export type SuccessActionState<T = null> = {
    status: typeof ActionStatus.Success;
    result: T;
};

export type FailActionState = {
    status: typeof ActionStatus.Fail;
    error?: Error;
};

export type ActionState<T = null> = SuccessActionState<T> | FailActionState;
