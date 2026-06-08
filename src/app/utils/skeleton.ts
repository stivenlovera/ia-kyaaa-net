export function skeleton(value: string) {
    if (value === '') {
        return ' h-8 animate-pulse bg-neutral-600'
    } else {
        return ''
    }
}