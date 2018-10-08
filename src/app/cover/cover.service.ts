import { Injectable } from '@angular/core';

@Injectable()
export class CoverService {
    coverState: string;
    enabled = true;
    isCover = function () {
        if (!this.enabled) {
            this.coverState = 'block';
            return this.coverState;
        } else {
            this.coverState = 'none';
            return this.coverState;
        }
    };
}
