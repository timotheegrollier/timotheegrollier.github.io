import { useMemo } from 'react';
import './MarkdownRenderer.scss';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const renderedHtml = useMemo(() => {
        if (!content) return '';

        // Safe client-side markdown to HTML parser for release notes
        const lines = content.split('\n');
        const output: string[] = [];
        let inList = false;
        let inCodeBlock = false;
        let codeBlockLang = '';
        let codeBlockLines: string[] = [];
        let inTable = false;
        let tableHeader: string[] = [];
        let tableRows: string[][] = [];

        function escapeHtml(text: string): string {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function formatInline(text: string): string {
            let escaped = escapeHtml(text);

            // Inline code: `code`
            escaped = escaped.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

            // Bold: **text** or __text__
            escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            escaped = escaped.replace(/__([^_]+)__/g, '<strong>$1</strong>');

            // Italic: *text* or _text_
            escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            escaped = escaped.replace(/_([^_]+)_/g, '<em>$1</em>');

            // Markdown Links: [label](url)
            escaped = escaped.replace(
                /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
            );

            // Raw URLs (not already part of a tag)
            escaped = escaped.replace(
                /(?<!href=")(https?:\/\/[^\s<]+)/g,
                '<a href="$1" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
            );

            return escaped;
        }

        function flushTable() {
            if (!inTable) return;
            let tableHtml = '<div class="md-table-wrapper"><table class="md-table">';
            if (tableHeader.length > 0) {
                tableHtml += '<thead><tr>';
                for (const cell of tableHeader) {
                    tableHtml += `<th>${formatInline(cell.trim())}</th>`;
                }
                tableHtml += '</tr></thead>';
            }
            if (tableRows.length > 0) {
                tableHtml += '<tbody>';
                for (const row of tableRows) {
                    tableHtml += '<tr>';
                    for (const cell of row) {
                        tableHtml += `<td>${formatInline(cell.trim())}</td>`;
                    }
                    tableHtml += '</tr>';
                }
                tableHtml += '</tbody>';
            }
            tableHtml += '</table></div>';
            output.push(tableHtml);
            inTable = false;
            tableHeader = [];
            tableRows = [];
        }

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            const trimmed = rawLine.trim();

            // Code blocks: ```
            if (trimmed.startsWith('```')) {
                if (inCodeBlock) {
                    output.push(
                        `<pre class="md-code-block" data-lang="${escapeHtml(codeBlockLang)}"><code>${escapeHtml(
                            codeBlockLines.join('\n')
                        )}</code></pre>`
                    );
                    inCodeBlock = false;
                    codeBlockLines = [];
                    codeBlockLang = '';
                } else {
                    if (inList) {
                        output.push('</ul>');
                        inList = false;
                    }
                    flushTable();
                    inCodeBlock = true;
                    codeBlockLang = trimmed.slice(3).trim();
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockLines.push(rawLine);
                continue;
            }

            // Tables: | col | col |
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                if (inList) {
                    output.push('</ul>');
                    inList = false;
                }
                const cells = trimmed
                    .slice(1, -1)
                    .split('|')
                    .map((c) => c.trim());

                // Check if divider row: |---|---|
                const isDivider = cells.every((c) => /^:?-+:?$/.test(c));
                if (isDivider) {
                    // Divider confirms previous row was header
                    inTable = true;
                    continue;
                }

                if (!inTable) {
                    // Possible header
                    tableHeader = cells;
                    inTable = true;
                } else {
                    tableRows.push(cells);
                }
                continue;
            } else if (inTable) {
                flushTable();
            }

            // Empty line
            if (!trimmed) {
                if (inList) {
                    output.push('</ul>');
                    inList = false;
                }
                continue;
            }

            // Headings: #, ##, ###, ####
            if (trimmed.startsWith('#')) {
                if (inList) {
                    output.push('</ul>');
                    inList = false;
                }
                const level = trimmed.match(/^#+/)?.[0].length || 1;
                const text = trimmed.slice(level).trim();
                const tag = level <= 2 ? 'h3' : level === 3 ? 'h4' : 'h5';
                output.push(`<${tag} class="md-heading md-heading--${level}">${formatInline(text)}</${tag}>`);
                continue;
            }

            // Blockquotes: > quote
            if (trimmed.startsWith('>')) {
                if (inList) {
                    output.push('</ul>');
                    inList = false;
                }
                const text = trimmed.slice(1).trim();
                output.push(`<blockquote class="md-blockquote">${formatInline(text)}</blockquote>`);
                continue;
            }

            // Unordered Lists: - or *
            if (/^[-*]\s+/.test(trimmed)) {
                if (!inList) {
                    output.push('<ul class="md-list">');
                    inList = true;
                }
                const text = trimmed.replace(/^[-*]\s+/, '');
                output.push(`<li class="md-list-item">${formatInline(text)}</li>`);
                continue;
            }

            // Ordered Lists: 1. 2.
            if (/^\d+\.\s+/.test(trimmed)) {
                if (inList) {
                    output.push('</ul>');
                    inList = false;
                }
                const text = trimmed.replace(/^\d+\.\s+/, '');
                output.push(`<div class="md-ordered-item">${formatInline(text)}</div>`);
                continue;
            }

            // Regular paragraph
            if (inList) {
                output.push('</ul>');
                inList = false;
            }
            output.push(`<p class="md-paragraph">${formatInline(trimmed)}</p>`);
        }

        if (inCodeBlock) {
            output.push(
                `<pre class="md-code-block"><code>${escapeHtml(codeBlockLines.join('\n'))}</code></pre>`
            );
        }
        if (inList) {
            output.push('</ul>');
        }
        flushTable();

        return output.join('\n');
    }, [content]);

    return (
        <div
            className={`markdown-renderer ${className}`}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
    );
}
