import './TerminalBlock.scss';

const BIRTH_DATE = new Date(1997, 9, 10);

function getAge(referenceDate: Date = new Date()): number {
    const yearDiff = referenceDate.getFullYear() - BIRTH_DATE.getFullYear();
    const hadBirthday =
        referenceDate.getMonth() > BIRTH_DATE.getMonth() ||
        (referenceDate.getMonth() === BIRTH_DATE.getMonth() && referenceDate.getDate() >= BIRTH_DATE.getDate());

    return hadBirthday ? yearDiff : yearDiff - 1;
}

export function TerminalBlock() {
    const age = getAge();

    const rows = [
        { key: 'OS', value: 'Debian GNU/Linux (+ Ubuntu/Fedora)' },
        { key: 'Role', value: 'Developpeur Full-Stack' },
        { key: 'Age', value: `${age} ans` },
        { key: 'Focus', value: 'Architecture web, performance, DX, UI clean' },
        { key: 'Stack', value: 'React, TypeScript, Symfony, Docker' },
    ];

    return (
        <div className="terminal-window" aria-hidden="true">
            <div className="terminal-header">
                <div className="terminal-header__left">
                    <span className="terminal-dot" />
                    <span className="terminal-dot" />
                    <span className="terminal-dot" />
                    <span className="terminal-title">timothee@debian: ~/portfolio</span>
                </div>
                <span className="terminal-shell">bash</span>
            </div>

            <div className="terminal-content">
                <p className="terminal-line terminal-line--cmd">
                    <span className="prompt">$</span>
                    fastfetch --logo none --separator " : "
                </p>

                <div className="terminal-output">
                    {rows.map((row) => (
                        <p key={row.key} className="terminal-line terminal-line--out">
                            <span className="terminal-key">{row.key}</span>
                            <span className="terminal-sep">:</span>
                            <span className="terminal-value">{row.value}</span>
                        </p>
                    ))}
                </div>

                <p className="terminal-line terminal-line--cmd terminal-line--prompt-end">
                    <span className="prompt">$</span>
                    <span className="terminal-cursor">_</span>
                </p>
            </div>
        </div>
    );
}
