import { Injectable, Service } from '@angular/core';
import { Api } from './api';

@Injectable()
export class Base<T> {

    constructor(
        protected api: Api
    ) { }

    getAll(url: string) {
        return this.api.get<T[]>(url);
    }

    getById(
        url: string,
        id: number
    ) {
        return this.api.get<T>(
            `${url}/${id}`
        );
    }

    create(
        url: string,
        data: T
    ) {
        return this.api.post(url, data);
    }

    update(
        url: string,
        id: number,
        data: T
    ) {
        return this.api.put(
            `${url}/${id}`,
            data
        );
    }

    delete(
        url: string,
        id: number
    ) {
        return this.api.delete(
            `${url}/${id}`
        );
    }
}
