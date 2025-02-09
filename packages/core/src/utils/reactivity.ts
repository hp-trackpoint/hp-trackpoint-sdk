export type Ref<T> = { value: T }

// ref: 创建一个可变的响应式对象
export function ref<T>(value: T): Ref<T> {
    return { value }
}

// computed: 返回一个动态计算的 getter
export function computed<T>(getter: () => T): Ref<T> {
    return { get value() { return getter() } }  // 使用 getter 使其自动更新
}
