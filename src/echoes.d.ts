declare type Echo = {
    init: (options?: EchoOption) => void,
    render: (context: Partial<Element | Document>) => void,
    detach: () => void,
};

declare type EchoOption = {
    offset?: number | string,
    offsetVertical?: number | string,
    offsetHorizontal?: number | string,
    offsetTop?: number | string,
    offsetBottom?: number | string,
    offsetLeft?: number | string,
    offsetRight?: number | string,
    throttle?: number | string,
    debounce?: boolean,
    unload?: boolean,
    callback?: (element?: HTMLElement, operation?: string) => void,
};

declare interface EchoConfig extends EchoOption {
    offset: number,
    offsetVertical: number,
    offsetHorizontal: number,
    offsetTop: number,
    offsetBottom: number,
    offsetLeft: number,
    offsetRight: number,
    throttle: number,
    debounce: boolean,
    unload: boolean,
    callback: Function,
}

declare type Rect = {
    left: number,
    top: number,
    bottom: number,
    right: number,
};