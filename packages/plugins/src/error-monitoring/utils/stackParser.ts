const FULL_MATCH =
    /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
const STACKTRACE_LIMIT = 10;

export function parseStackLine(line: string) {
    const lineMatch = line.match(FULL_MATCH);
    if (!lineMatch || !lineMatch[2]) return null;
    return {
        filename: lineMatch[2],
        functionName: lineMatch[1] || "anonymous",
        lineno: lineMatch[3] ? parseInt(lineMatch[3], 10) : undefined,
        colno: lineMatch[4] ? parseInt(lineMatch[4], 10) : undefined,
    };
}

export function parseStackFrames(error: Error) {
    const { stack } = error;
    if (!stack) return [];
    return stack
        .split("\n")
        .slice(1)
        .map(parseStackLine)
        .filter(Boolean)
        .slice(0, STACKTRACE_LIMIT);
}
