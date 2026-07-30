import ora from 'ora';

export function startLoader(text: string) {
    return ora({ text }).start();
}
