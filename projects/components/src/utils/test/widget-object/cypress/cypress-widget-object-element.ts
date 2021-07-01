/*!
 * Copyright 2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */
import { SelectorUtil } from '../selector-util';
import {
    BaseWidgetObject,
    ElementActions,
    FindableWidget,
    FindElementOptions,
    WidgetObjectElement,
} from '../widget-object';
import { CypressWidgetObjectFinder, FindCypressWidgetOptions } from './cypress-widget-finder';

declare const cy;

/**
 * Implementation of WidgetObjectElement for Cypress chainables
 *
 * T is the type of data that this will output when you call `unwrap`.
 * In almost all cases, this should be a `Cypress.Chainable`.
 *
 * We chose to provide this as a generic because for reasons seen in
 * [this PR](https://github.com/vmware/vmware-cloud-director-ui-components/pull/248)
 * we could not load the Cypress types in our library.
 */
export class CypressWidgetObjectElement<T extends ElementActions> implements WidgetObjectElement<T> {
    /**
     *
     * @param chainable the chainable that represents the current element.
     * @param isRoot if the current element refers to the same element that the alias refers to.
     * @param alias refers to the alias of the root element of this current element.
     */
    constructor(private chainable: T, private isRoot: boolean, private alias: string) {}

    /**
     * @inheritdoc
     */
    get(selector: string | FindElementOptions): CypressWidgetObjectElement<T> {
        const root = this.getBase();
        const cssSelector = SelectorUtil.extractSelector(selector);
        let chainable: any;
        if (typeof selector === 'string') {
            chainable = root.find(selector);
        } else if (typeof selector.index === 'number') {
            chainable = root.find(cssSelector, selector.options).eq(selector.index);
        } else if (selector.text) {
            const queryOptions = { matchCase: false, ...(selector.options || {}) };
            chainable = root.contains(cssSelector, selector.text, queryOptions);
        } else {
            chainable = root.find(cssSelector, selector.options);
        }
        return new CypressWidgetObjectElement(chainable, false, this.alias);
    }

    /**
     * @inheritdoc
     */
    parents(selector: string | FindElementOptions): CypressWidgetObjectElement<T> {
        const root = this.getBase();
        if (typeof selector === 'string') {
            return new CypressWidgetObjectElement(root.parents(selector), false, this.alias);
        }
        return new CypressWidgetObjectElement(
            root.parents(SelectorUtil.extractSelector(selector), selector.options),
            false,
            this.alias
        );
    }

    /**
     * @inheritdoc
     */
    unwrap(): T {
        return this.chainable;
    }

    /**
     * @inheritdoc
     */
    click(options?: unknown): void {
        this.chainable.click(options);
    }

    /**
     * @inheritdoc
     */
    type(value: string, options: unknown): void {
        this.chainable.type(value, options);
    }

    /**
     * @inheritdoc
     */
    select(text: string, options: unknown): void {
        this.chainable.select(text, options);
    }

    /**
     * @inheritdoc
     */
    check(options?: unknown): void {
        this.chainable.check(options);
    }

    /**
     * @inheritdoc
     */
    uncheck(options?: unknown): void {
        this.chainable.uncheck(options);
    }

    /**
     * @inheritdoc
     */
    clear(options?: unknown): void {
        this.chainable.clear(options);
    }

    /**
     * @inheritdoc
     */
    findWidget<W extends BaseWidgetObject<T>>(widget: FindableWidget<T, W>, findOptions: FindCypressWidgetOptions): W {
        return new CypressWidgetObjectFinder<T>().find(widget, { ancestor: this.getBase(), ...findOptions });
    }

    /**
     * Gives the correct base for this current query.
     * This is to override the behavior where calls to .find will permanently change the scope of the query.
     */
    private getBase(): any {
        if (this.isRoot) {
            return cy.get('@' + this.alias);
        } else {
            return this.chainable;
        }
    }
}
