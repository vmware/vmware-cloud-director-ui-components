/*!
 * Copyright 2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { GridSelectionType } from './../../../datagrid/datagrid.component';

import { DebugElement, Type } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { DatagridFilter } from '../../../datagrid/filters/datagrid-filter';
import { ShowClippedTextDirective } from '../../../lib/directives/show-clipped-text.directive';
import { WidgetObject } from '../widget-object';

const ROW_TAG = 'clr-dg-row';
const CELL_TAG = 'clr-dg-cell';
const COLUMN_SELECTOR = 'clr-dg-column';
const COLUMN_CSS_SELECTOR = '.datagrid-column-title';
const FILTER_SELECTOR = 'clr-dg-filter';

/**
 * Widget Object for a Clarity DataGrid
 */
export class ClrDatagridWidgetObject extends WidgetObject<ClrDatagrid> {
    static tagName = `clr-datagrid`;

    /**
     * Retrieves the text content of a cell
     * @param row 0-based index of row
     * @param column 0-based index of column
     */
    getCellText(row: number, column: number): string {
        return this.getNodeText(this.getCell(row, column));
    }

    /**
     * Gives the text content of all the cells in a row.
     */
    getRowValues(rowIndex: number): string[] {
        const toReturn = [];
        for (let columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
            toReturn.push(this.getCellText(rowIndex, columnIndex));
        }
        return toReturn;
    }

    /**
     * Gives the linked text in the given cell represented by the {@param rowIndex} and {@param columnIndex} if present.
     */
    getCellLink(rowIndex: number, columnIndex: number): string[] {
        return this.getCell(rowIndex, columnIndex)
            .nativeElement.querySelector('a')
            .getAttribute('href');
    }

    /**
     * Retrieves if the cell will clip text
     * @param column 0-based index of column
     */
    columnClippedTextDirective(column: number): ShowClippedTextDirective {
        const res = this.getCell(0, column);
        return res.injector.get(ShowClippedTextDirective);
    }

    /**
     * Returns the number of visible columns
     */
    get columnCount(): number {
        return this.component.columns ? this.component.columns.length : this.columns.length;
    }

    /**
     * Returns the text for a header
     * @param columnIndex 0-based index of header to retrieve
     */
    getColumnHeader(columnIndex: number): string {
        return this.getText(`${COLUMN_CSS_SELECTOR}:nth-of-type(${columnIndex + 1})`);
    }

    /**
     * Returns an array of the texts for columns, in DOM order
     */
    get columnHeaders(): string[] {
        return this.getTexts(COLUMN_CSS_SELECTOR);
    }

    /**
     * Returns an array of the texts for columns that are hidden.
     */
    get hiddenColumnHeaders(): string[] {
        return this.getTexts('clr-dg-column.datagrid-hidden-column');
    }

    /**
     * Returns the number of rows currently displayed
     */
    get rowCount(): number {
        return this.rows.length;
    }

    /**
     * Says if this datagrid is loading.
     */
    get loading(): boolean {
        return this.component.loading;
    }

    /**
     * Returns whether or not the column with the given index is displayed by the CSS.
     */
    isColumnDisplayed(index: number): boolean {
        return this.findElements(COLUMN_SELECTOR)[index].classes['datagrid-hidden-column'] !== true;
    }

    /*
     * Returns the CSS class of the Clarity datagrid.
     */
    get gridCssClass(): string[] {
        return Object.keys(this.root.classes);
    }

    /**
     * Returns the CSS class names of the given Clarity datarow.
     */
    getRowsCssClass(index: number): string[] {
        return Object.keys(this.rows[index].classes);
    }

    /**
     * Returns the native element contents within all the detail pane open.
     */
    getAllDetailContents(): string[] {
        return this.findElements('clr-dg-row-detail').map(detail => detail.nativeElement);
    }

    /**
     * Clicks the given details button.
     */
    clickDetailsButton(row: number): void {
        this.detailsButtons[row].nativeElement.click();
    }

    /**
     * Sorts the column at the given index.
     */
    sortColumn(index: number): void {
        this.columns[index].nativeElement.click();
    }

    /**
     * Returns the selection type of the grid.
     */
    getSelectionType(): GridSelectionType {
        if (this.findElements('clr-checkbox-wrapper').length !== 0) {
            return GridSelectionType.Multi;
        } else if (this.findElements('clr-radio-wrapper').length !== 0) {
            return GridSelectionType.Single;
        } else {
            return GridSelectionType.None;
        }
    }

    /**
     * Clicks the selection icon on the given row.
     */
    selectRow(row: number): void {
        this.click(`input`, this.rows[row]);
    }

    /**
     * Gives the pagination description text.
     */
    getPaginationDescription(): string {
        return this.findElement('.pagination-description').nativeElement.textContent;
    }

    /**
     * Gives the text next to the pagination selector.
     */
    getPaginationSizeSelectorText(): string {
        return this.findElement('clr-dg-page-size').nativeElement.textContent;
    }

    /**
     * Clicks the next page button.
     */
    nextPage(): void {
        this.click('.pagination-next');
    }

    /**
     * Gives a list of the labels of the displayed action buttons at the top of the grid.
     */
    getTopPositionedButtons(): string[] {
        return this.findElements('clr-dg-action-bar button').map(button => button.nativeElement.textContent);
    }

    /**
     * Gives the class of the cell that holds the row buttons.
     */
    getRowButtonContainerClass(rowIndex: number): string[] {
        return Object.keys(this.findElement(`.action-button-cell`, this.rows[rowIndex]).classes);
    }

    /**
     * Presses the button at the given {@param index} on the top of the grid in the given {@param group}.
     */
    pressTopButton(index: number, group: number): void {
        this.click(`clr-dg-action-bar div:nth-of-type(${group}) button:nth-of-type(${index + 1})`);
    }

    /**
     * Gives the text of the button at the given {@param index} in the given {@param group} on the top of the grid.
     */
    getTopButtonText(index: number, group: number): string {
        return this.getText(`clr-dg-action-bar div:nth-of-type(${group}) button:nth-of-type(${index + 1})`);
    }

    /**
     * Says if the button at the given {@param index} in the given {@param group} on the top of the grid is disabled.
     */
    getTopButtonDisabled(index: number, group: number): string {
        return this.findElement(`clr-dg-action-bar div:nth-of-type(${group}) button:nth-of-type(${index + 1})`)
            .nativeElement.disabled;
    }

    /**
     * Presses the button at the given {@param buttonIndex} at the row at the given {@param rowIndex}.
     */
    pressButtonAtRow(buttonIndex: number, rowIndex: number): void {
        this.click(`.action-button-group button:nth-of-type(${buttonIndex + 1})`, this.rows[rowIndex]);
    }

    /**
     * Gives the text of the button at the given {@param buttonIndex} at the row at the given {@param rowIndex}.
     */
    getButtonAtRowText(buttonIndex: number, rowIndex: number): string {
        return this.getText(
            `${ROW_TAG}:nth-of-type(${rowIndex + 1}) .action-button-group button:nth-of-type(${buttonIndex + 1})`
        );
    }

    /**
     * Says if the button at the given {@param buttonIndex} at the row at the given {@param rowIndex} is disabled.
     */
    getButtonAtRowDisabled(buttonIndex: number, rowIndex: number): string {
        return this.findElement(`${ROW_TAG}:nth-of-type(${rowIndex + 1})
             .action-button-group button:nth-of-type(${buttonIndex + 1})`).nativeElement.disabled;
    }

    /**
     * Gives the height CSS of this clr-datagrid.
     */
    get gridHeight(): string {
        return this.root.parent.nativeElement.style.getPropertyValue('--datagrid-height');
    }

    /**
     * Gives the height of the grids container.
     */
    get gridContainerClasses(): string[] {
        return Object.keys(this.root.parent.classes);
    }

    /**
     * Can be used by subclasses to create methods that assert about HTML in custom rendered columns. Note that
     * subclasses should not return the DebugElement, they should return a string from a section of the HTML.
     *
     * @param row 0-based index of row
     * @param column 0-based index of column
     */
    getCell(row: number, column: number): DebugElement {
        return this.findElement(`${ROW_TAG}:nth-of-type(${row + 1}) ${CELL_TAG}:nth-of-type(${column + 1})`);
    }

    private get rows(): DebugElement[] {
        return this.findElements(ROW_TAG);
    }

    private get columns(): DebugElement[] {
        return this.findElements(COLUMN_CSS_SELECTOR);
    }

    private get detailsButtons(): DebugElement[] {
        return this.findElements('.datagrid-expandable-caret-button');
    }

    private openFilter(): void {
        const clrDgColumn = this.findElements(COLUMN_SELECTOR)[0];
        const filterDebugEl = this.findElement(FILTER_SELECTOR, clrDgColumn);
        this.click('.datagrid-filter-toggle', filterDebugEl);
        this.detectChanges();
    }

    /**
     * Used by the {@link createDatagridFilterTestHelper} to query for a filter component. Opens filter of first
     * column and returns the filter component.
     * @param ctor The constructor of a grid filter component
     */
    getFilter<V, C>(ctor: Type<DatagridFilter<V, C>>): DatagridFilter<V, C> {
        this.openFilter();
        return this.findElement(ctor).componentInstance;
    }
}
