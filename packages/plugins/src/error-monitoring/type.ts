// 错误类型枚举
export enum mechanismType {
    JS = 'js',
    RS = 'resource',
    UJ = 'unhandledrejection',
    HP = 'http',
    CS = 'cors',
    VUE = 'vue',
}

// 错误堆栈类型
export interface StackFrame {
    filename: string;
    functionName: string;
    lineno?: number | undefined;
    colno?: number | undefined;
}

// 异常数据结构体
export interface ExceptionMetrics {
    mechanism: mechanismType;
    value?: string;
    type: string;
    stackTrace?: StackFrame;
    errorUid: string;
    eventTime: number;
}

