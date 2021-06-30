/*!
 * Copyright 2020-2021 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { IdGenerator } from '../../../id-generator/id-generator';
import { BaseWidgetObject, ElementActions, FindableWidget, FindElementOptions } from '../widget-object';
import { CypressWidgetObjectElement } from './cypress-widget-object-element';

declare const cy;
const cypressWidgetIdGenerator = new IdGenerator('cy-id');

export interface FindCypressWidgetOptions extends FindElementOptions {
    ancestor?: string | ElementActions;
    options?: { timeout: number };
}

/**
 * Knows how to find and construct Cypress widget objects within the DOM.
 *
 * T is the type of data that this will output when you call `unwrap`.
 * In almost all cases, this should be a `Cypress.Chainable`.
 * We chose to provide this as a generic because for reasons seen in
 * [this PR](https://github.com/vmware/vmware-cloud-director-ui-components/pull/248)
 * we could not load the Cypress types in our library.
 */
export class CypressWidgetObjectFinder<T> {
    /**
     * Finds a single widget object
     *
     * @param widgetConstructor - The constructor of the widget to use
     * @param findOptions - Options when finding an element
     *
     */
    public find<W extends BaseWidgetObject<T>>(
        widgetConstructor: FindableWidget<T, W>,
        findOptions?: FindCypressWidgetOptions
    ): W {
        const id = cypressWidgetIdGenerator.generate();

        let ancestor: any;
        if (findOptions?.ancestor) {
            if (typeof findOptions.ancestor == 'string') {
                ancestor = cy.get(findOptions?.ancestor, { timeout: findOptions?.options?.timeout });
            } else {
                ancestor = findOptions?.ancestor;
            }
        } else {
            ancestor = cy.get('body', { timeout: findOptions?.options?.timeout });
        }
        const parentWidget = new CypressWidgetObjectElement(ancestor, false, undefined);
        let query = widgetConstructor.tagName;
        if (findOptions?.cssSelector) {
            query = query + findOptions.cssSelector;
        }
        const parentQuery: FindCypressWidgetOptions = {
            cssSelector: query,
            dataUiSelector: findOptions?.dataUiSelector,
            text: findOptions?.text,
            index: findOptions?.index,
            options: findOptions?.options,
        };
        const root = parentWidget.get(parentQuery).unwrap().as(id);
        return new widgetConstructor(new CypressWidgetObjectElement(root, true, id));
    }
}
