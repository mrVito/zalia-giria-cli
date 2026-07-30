import type { Choice } from '@/ui/select/models/Choice.ts';
import { select as selectPrompt } from '@inquirer/prompts';

interface KeyedChoice extends Choice {
    key: string;
}

export async function select(message: string, choices: Choice[]) {
    const actionMap: KeyedChoice[] = choices.map(choice => ({
        key: crypto.randomUUID(),
        ...choice,
    }));

    const actionKey = await selectPrompt({
        message: message,
        choices: actionMap.map(action => ({
            name: action.name,
            value: action.key,
        })),
    });

    const result = actionMap.find(action => action.key === actionKey);

    if (result == null) {
        throw new Error('Invalid choice');
    }

    return result.action();
}
