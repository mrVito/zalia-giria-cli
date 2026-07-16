import { spawn } from 'bun';

export function openUrl(url: string) {
    const platform = process.platform;

    let cmd: string[];

    if (platform === 'darwin') {
        cmd = ['open', url];
    } else if (platform === 'win32') {
        cmd = ['cmd', '/c', 'start', '', url];
    } else {
        cmd = ['xdg-open', url];
    }

    spawn(cmd, {
        stdout: 'ignore',
        stderr: 'ignore',
    });
}
