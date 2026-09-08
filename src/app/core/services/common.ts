import { Service } from '@angular/core';

@Service()
export class Common {
    formatDate(date: any) {
        return new Date(date)
            .toLocaleDateString();
    }

    generateGuid() {
        return crypto.randomUUID();
    }

    isNullOrEmpty(
        value: any
    ) {
        return !value;
    }

    debounce(
        func: Function,
        delay: number
    ) {
        let timer: any;

        return (...args: any[]) => {
            clearTimeout(timer);

            timer = setTimeout(
                () => func(...args),
                delay
            );
        };
    }
}
