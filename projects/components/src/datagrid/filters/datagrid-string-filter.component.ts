/*!
 * Copyright 2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Host, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ClrDatagridFilter } from '@clr/angular';
import { debounce, debounceTime } from 'rxjs/operators';
import { FilterBuilder } from '../../utils/filter-builder';
import { DatagridFilter, FilterComponentRendererSpec, FilterConfig, FilterRendererSpec } from './datagrid-filter';

export enum WildCardPosition {
    START = 'START',
    END = 'END',
}

/**
 * Configures the '*' position in the FIQL string output
 */
export interface DatagridStringFilterConfig extends FilterConfig<string> {
    wildCardPosition?: WildCardPosition;
}

@Component({
    selector: 'vcd-dg-string-filter',
    templateUrl: 'datagrid-string-filter.component.html',
})
export class DatagridStringFilterComponent extends DatagridFilter<string, DatagridStringFilterConfig>
    implements OnInit {
    constructor(@Host() private filterContainer: ClrDatagridFilter, private fb: FormBuilder) {
        super(filterContainer);
        this.formGroup = this.fb.group({
            filterText: '',
        });
    }

    /**
     * Changes in the formgroup are emitted for updating the clr grid state
     */
    ngOnInit(): void {
        this.debounceChanges(this.formGroup.valueChanges);
    }

    setValue(value: string): void {
        this.formGroup.setValue({
            filterText: value,
        });
    }

    getValue(): string {
        const filterBuilder = new FilterBuilder().is(this.queryField);
        let value = this.formGroup.get('filterText').value;
        if (this.config && this.config.wildCardPosition) {
            value = this.config.wildCardPosition === WildCardPosition.START ? '*' + value : value + '*';
        }
        return filterBuilder.equalTo(value).getString();
    }

    isActive(): boolean {
        return !!this.formGroup && this.formGroup.get('filterText').value;
    }
}

/**
 * Creates a {@link FilterRendererSpec} with the given config.
 * @param wildCardPosition where the * should go in the FIQL string output.
 * @param value the default value of the filter
 */
export function DatagridStringFilter(
    wildCardPosition?: WildCardPosition,
    value?: string
): FilterRendererSpec<DatagridStringFilterConfig> {
    return FilterComponentRendererSpec({
        type: DatagridStringFilterComponent,
        config: {
            wildCardPosition,
            value,
        },
    });
}