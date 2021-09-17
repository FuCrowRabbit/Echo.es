declare type Echo = {
    init: (options?: EchoOption) => void,
};

declare type EchoOption = {
    root?: Element | Document,
    rootMargin?: string,
    threshold?: number | Array<number>,
    unload?: boolean,
    callback?: (entry?: IntersectionObserverEntry, operation?: 'load' | 'unload') => void,
};

declare interface EchoConfig extends EchoOption {
    root: Element | Document | null,
    rootMargin: string | null,
    threshold: number | Array<number> | null,
    unload: boolean,
    callback: (entry?: IntersectionObserverEntry, operation?: 'load' | 'unload') => void,
}
