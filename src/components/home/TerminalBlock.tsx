import './TerminalBlock.scss';

export function TerminalBlock() {
    return (
        <div className="terminal-window">
            <div className="terminal-header">
                <div className="terminal-title">timo@debian: ~/dev</div>
                <div className="terminal-controls">
                    <span>_</span>
                    <span>□</span>
                    <span>×</span>
                </div>
            </div>
            <div className="terminal-content">
                <div className="command-line">
                    <span className="prompt">$</span> cat developer.ts
                </div>
                <pre>
                    <code>
                        <span className="k">const</span> <span className="v">dev</span> = &#123;
                        <span className="p">name</span>: <span className="s">"Timothée"</span>,
                        <span className="p">role</span>: <span className="s">"Lead Tech"</span>,
                        <span className="p">stack</span>: [
                        <span className="s">"Symfony"</span>,
                        <span className="s">"React"</span>,
                        <span className="s">"Docker"</span>,
                        <span className="s">"TDD"</span>
                        ],
                        <span className="p">os</span>: <span className="s">"Debian"</span>
                        &#125;;
                        <span className="prompt">$</span> <span className="cursor">|</span></code>
                </pre>
            </div>
        </div>
    );
}
