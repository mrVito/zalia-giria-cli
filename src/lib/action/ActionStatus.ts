export const ActionStatus = {
    Success: 'success',
    Fail: 'fail',
} as const;

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus];
