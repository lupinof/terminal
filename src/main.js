import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { commands } from './commands.js';

const term = new Terminal({
    theme: {
        background: '#000000',
        foreground: '#00ff80',
        cursor: '#00ff80',
        selection: 'rgba(0, 255, 128, 0.3)',
        black: '#000000',
        green: '#00ff80',
        brightGreen: '#00ff80'
    },
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    cursorStyle: 'block'
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));
fitAddon.fit();

window.addEventListener('resize', () => fitAddon.fit());

// Welcome message
term.writeln('\x1B[1;32m=== Terminal of Gigachad ===\x1B[0m');
term.writeln('Type "help" for available commands\n');

let currentLine = '';
let commandHistory = [];
let historyIndex = -1;

term.onKey(({ key, domEvent }) => {
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter
        term.write('\r\n');
        handleCommand(currentLine);
        commandHistory.push(currentLine);
        historyIndex = -1;
        currentLine = '';
    } else if (domEvent.keyCode === 8) { // Backspace
        if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
        }
    } else if (domEvent.keyCode === 38) { // Up arrow
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentLine = commandHistory[commandHistory.length - 1 - historyIndex];
            term.write('\r\x1B[K$ ' + currentLine);
        }
    } else if (domEvent.keyCode === 40) { // Down arrow
        if (historyIndex > 0) {
            historyIndex--;
            currentLine = commandHistory[commandHistory.length - 1 - historyIndex];
            term.write('\r\x1B[K$ ' + currentLine);
        } else if (historyIndex === 0) {
            historyIndex = -1;
            currentLine = '';
            term.write('\r\x1B[K$ ');
        }
    } else if (printable) {
        currentLine += key;
        term.write(key);
    }
});

function handleCommand(cmd) {
    const [command, ...args] = cmd.trim().toLowerCase().split(' ');
    
    if (commands[command]) {
        commands[command](term, ...args);
    } else if (cmd.trim()) {
        term.writeln('\r\nUpdate soon');
    }
    
    term.write('\r\n$ ');
}

term.write('$ ');